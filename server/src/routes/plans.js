const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/plans - Listar todos os planos cadastrados
router.get('/', (req, res) => {
  const plans = db.prepare('SELECT * FROM plans ORDER BY preco_mensal ASC').all();
  const formatted = plans.map(p => ({
    ...p,
    recursos: JSON.parse(p.recursos_json || '[]')
  }));
  return res.json({ plans: formatted });
});

// POST /api/plans/subscribe - Ativar assinatura (Premium Padrão ou Premium Plus)
router.post('/subscribe', (req, res) => {
  const { user_id, plan_id } = req.body;
  if (!user_id || !plan_id) {
    return res.status(400).json({ error: 'user_id e plan_id são obrigatórios.' });
  }

  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(plan_id);
  if (!plan) return res.status(404).json({ error: 'Plano não encontrado.' });

  const user = db.prepare('SELECT id, tokens_balance FROM users WHERE id = ?').get(user_id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  // Regra:
  // Se for Premium Padrão: 100 tokens iniciais (100 tokens diários)
  // Se for Premium Plus: 1.000 tokens de uso
  const grantedTokens = plan.id === 'plan_plus' ? 1000 : 100;
  const newBalance = user.tokens_balance + grantedTokens;

  db.prepare('UPDATE users SET plano_id = ?, tokens_balance = ? WHERE id = ?').run(plan_id, newBalance, user_id);

  // Registrar no extrato
  db.prepare(`
    INSERT INTO token_transactions (id, user_id, quantidade, tipo, descricao, saldo_apos)
    VALUES (?, ?, ?, 'PLAN_RELOAD', ?, ?)
  `).run(
    'trans_' + Date.now(),
    user_id,
    grantedTokens,
    `Ativação da assinatura ${plan.nome}`,
    newBalance
  );

  return res.json({
    message: `Plano ${plan.nome} ativado com sucesso!`,
    tokens_balance: newBalance,
    tokens_added: grantedTokens,
    plan: {
      id: plan.id,
      nome: plan.nome,
      preco_mensal: plan.preco_mensal
    }
  });
});

module.exports = router;
