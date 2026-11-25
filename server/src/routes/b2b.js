const express = require('express');
const router = express.Router();
const db = require('../database');

// POST /api/b2b/leads - Cadastro de proposta/parceria de clínicas e nutricionistas
router.post('/leads', (req, res) => {
  const { nome_clinica, nome_responsavel, email, telefone, cidade, estado, qtd_nutricionistas, mensagem } = req.body;

  if (!nome_clinica || !nome_responsavel || !email || !telefone) {
    return res.status(400).json({ error: 'Nome da clínica, responsável, e-mail e telefone são obrigatórios.' });
  }

  const id = 'lead_' + Date.now();
  db.prepare(`
    INSERT INTO clinic_leads (id, nome_clinica, nome_responsavel, email, telefone, cidade, estado, qtd_nutricionistas, mensagem, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
  `).run(
    id, nome_clinica, nome_responsavel, email, telefone,
    cidade || '', estado || '', qtd_nutricionistas || '1 a 3', mensagem || ''
  );

  const created = db.prepare('SELECT * FROM clinic_leads WHERE id = ?').get(id);
  return res.status(201).json({
    message: 'Solicitação de parceria enviada com sucesso! Nossa equipe entrará em contato em até 24 horas.',
    lead: created
  });
});

// GET /api/b2b/leads - Listar leads (para administração clínica B2B)
router.get('/leads', (req, res) => {
  const leads = db.prepare('SELECT * FROM clinic_leads ORDER BY created_at DESC').all();
  return res.json({ leads });
});

module.exports = router;
