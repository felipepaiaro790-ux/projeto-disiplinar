const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/tokens/transactions/user/:userId - Extrato
router.get('/transactions/user/:userId', (req, res) => {
  const transactions = db.prepare(`
    SELECT * FROM token_transactions 
    WHERE user_id = ? 
    ORDER BY created_at DESC 
    LIMIT 50
  `).all(req.params.userId);

  const user = db.prepare('SELECT tokens_balance, plano_id FROM users WHERE id = ?').get(req.params.userId);

  return res.json({
    tokens_balance: user ? user.tokens_balance : 0,
    plano_id: user ? user.plano_id : null,
    transactions
  });
});

// POST /api/tokens/recharge - Compra de Pacote na Loja de Tokens
// Regra atualizada:
// - Pacote padrão (Normal): 10 tokens por R$ 15,00
// - Bônus Premium Plus: Ganha +3 tokens extras (total 13 tokens por R$ 15,00)
router.post('/recharge', (req, res) => {
  const { user_id, package_type } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id é obrigatório.' });
  }

  const user = db.prepare('SELECT id, tokens_balance, plano_id FROM users WHERE id = ?').get(user_id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  const isPremiumPlus = user.plano_id === 'plan_plus';
  const baseTokens = 10;
  const bonusTokens = isPremiumPlus ? 3 : 0;
  const totalTokens = baseTokens + bonusTokens;
  const preco = 15.00;

  const newBalance = user.tokens_balance + totalTokens;
  db.prepare('UPDATE users SET tokens_balance = ? WHERE id = ?').run(newBalance, user_id);

  const desc = isPremiumPlus
    ? `Compra de Pacote na Loja: 10 tokens + 3 bônus Premium Plus (R$ 15,00)`
    : `Compra de Pacote na Loja: 10 tokens (R$ 15,00)`;

  db.prepare(`
    INSERT INTO token_transactions (id, user_id, quantidade, tipo, descricao, saldo_apos)
    VALUES (?, ?, ?, 'EXTRA_PURCHASE', ?, ?)
  `).run(
    'trans_' + Date.now(),
    user_id,
    totalTokens,
    desc,
    newBalance
  );

  return res.json({
    message: `${totalTokens} Tokens creditados com sucesso! ${bonusTokens > 0 ? `(Inclui +${bonusTokens} tokens de bônus exclusivos do seu Premium Plus)` : ''}`,
    tokens_added: totalTokens,
    base_tokens: baseTokens,
    bonus_tokens: bonusTokens,
    tokens_balance: newBalance,
    preco: preco
  });
});

module.exports = router;
