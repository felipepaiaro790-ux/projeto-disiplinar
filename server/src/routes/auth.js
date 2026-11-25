const express = require('express');
const router = express.Router();
const db = require('../database');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  const user = db.prepare(`
    SELECT u.*, p.nome as plano_nome, p.tokens_mensais, p.tokens_diarios, p.preco_mensal
    FROM users u
    LEFT JOIN plans p ON u.plano_id = p.id
    WHERE u.email = ?
  `).get(email);

  if (!user || user.senha !== senha) {
    return res.status(401).json({ error: 'Credenciais inválidas. Verifique seu e-mail e senha.' });
  }

  delete user.senha;
  return res.json({ message: 'Login realizado com sucesso!', user });
});

// POST /api/auth/register
// Regra: Novo usuário inicia SEM plano (plano_id = null) e com 0 tokens
router.post('/register', (req, res) => {
  const { nome, email, senha, telefone } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
  }

  const id = 'usr_' + Date.now();

  db.prepare(`
    INSERT INTO users (id, nome, email, senha, role, plano_id, tokens_balance, telefone)
    VALUES (?, ?, ?, ?, 'patient', NULL, 0, ?)
  `).run(id, nome, email, senha, telefone || null);

  const newUser = db.prepare(`
    SELECT u.*, NULL as plano_nome, 0 as tokens_mensais
    FROM users u
    WHERE u.id = ?
  `).get(id);

  delete newUser.senha;
  return res.status(201).json({ message: 'Conta criada com sucesso! Escolha um plano para desbloquear a IA e recursos.', user: newUser });
});

// GET /api/auth/me/:id
router.get('/me/:id', (req, res) => {
  const user = db.prepare(`
    SELECT u.*, p.nome as plano_nome, p.tokens_mensais, p.tokens_diarios, p.preco_mensal
    FROM users u
    LEFT JOIN plans p ON u.plano_id = p.id
    WHERE u.id = ?
  `).get(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }
  delete user.senha;
  return res.json({ user });
});

module.exports = router;
