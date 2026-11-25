const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/clinics - Listar clínicas cadastradas (Apenas para usuários Premium Plus)
router.get('/', (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: 'user_id é obrigatório para validação de acesso.' });
  }

  const user = db.prepare('SELECT plano_id FROM users WHERE id = ?').get(userId);
  if (!user || user.plano_id !== 'plan_plus') {
    return res.status(403).json({
      error: 'Acesso Exclusivo Premium Plus',
      code: 'PREMIUM_PLUS_REQUIRED',
      message: 'A visualização de Clínicas Próximas e contato direto é um benefício exclusivo dos assinantes do Plano Premium Plus.'
    });
  }

  const clinics = db.prepare('SELECT * FROM clinics ORDER BY distancia_km ASC').all();
  return res.json({ clinics });
});

// GET /api/clinics/:clinicId/messages - Obter histórico de chat isolado da clínica
router.get('/:clinicId/messages', (req, res) => {
  const { clinicId } = req.params;
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id é obrigatório.' });
  }

  const messages = db.prepare(`
    SELECT * FROM clinic_messages
    WHERE user_id = ? AND clinic_id = ?
    ORDER BY created_at ASC
  `).all(user_id, clinicId);

  const clinic = db.prepare('SELECT * FROM clinics WHERE id = ?').get(clinicId);

  return res.json({ clinic, messages });
});

// POST /api/clinics/:clinicId/messages - Enviar mensagem no chat da clínica
// Regra: Salva a mensagem enviada pelo usuário, mas a clínica NÃO responde (Indisponível no momento)
router.post('/:clinicId/messages', (req, res) => {
  const { clinicId } = req.params;
  const { user_id, message } = req.body;

  if (!user_id || !message || !message.trim()) {
    return res.status(400).json({ error: 'user_id e message são obrigatórios.' });
  }

  // Validar se o usuário é Premium Plus
  const user = db.prepare('SELECT plano_id FROM users WHERE id = ?').get(user_id);
  if (!user || user.plano_id !== 'plan_plus') {
    return res.status(403).json({ error: 'Apenas usuários Premium Plus podem contatar clínicas.' });
  }

  const msgId = 'cmsg_' + Date.now();
  db.prepare(`
    INSERT INTO clinic_messages (id, user_id, clinic_id, remetente, conteudo)
    VALUES (?, ?, ?, 'user', ?)
  `).run(msgId, user_id, clinicId, message.trim());

  const savedMsg = db.prepare('SELECT * FROM clinic_messages WHERE id = ?').get(msgId);

  return res.status(201).json({
    message: 'Mensagem enviada com sucesso para a clínica.',
    clinic_message: savedMsg,
    notice: 'Indisponível no momento para contato. Sua mensagem foi registrada no histórico.'
  });
});

module.exports = router;
