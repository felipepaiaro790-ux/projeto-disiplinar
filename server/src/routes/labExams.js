const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/lab-exams/user/:userId - Listar exames laboratoriais do paciente
router.get('/user/:userId', (req, res) => {
  const exams = db.prepare(`
    SELECT * FROM lab_exams 
    WHERE user_id = ? 
    ORDER BY data_exame DESC, created_at DESC
  `).all(req.params.userId);

  // Formatar valores_json
  const formatted = exams.map(e => ({
    ...e,
    valores: JSON.parse(e.valores_json || '{}')
  }));

  return res.json({ exams: formatted });
});

// POST /api/lab-exams - Adicionar novo exame laboratorial
router.post('/', (req, res) => {
  const { user_id, tipo_exame, data_exame, valores, laudo_resumo, arquivo_url } = req.body;
  if (!user_id || !tipo_exame || !data_exame || !valores) {
    return res.status(400).json({ error: 'user_id, tipo_exame, data_exame e valores são obrigatórios.' });
  }

  const id = 'exam_' + Date.now();
  const valoresJson = typeof valores === 'string' ? valores : JSON.stringify(valores);

  db.prepare(`
    INSERT INTO lab_exams (id, user_id, tipo_exame, data_exame, valores_json, laudo_resumo, arquivo_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    user_id,
    tipo_exame,
    data_exame,
    valoresJson,
    laudo_resumo || '',
    arquivo_url || null
  );

  const created = db.prepare('SELECT * FROM lab_exams WHERE id = ?').get(id);
  created.valores = JSON.parse(created.valores_json);

  return res.status(201).json({ message: 'Exame laboratorial registrado com sucesso!', exam: created });
});

// DELETE /api/lab-exams/:id - Excluir exame
router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM lab_exams WHERE id = ?').run(req.params.id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Exame não encontrado.' });
  }
  return res.json({ message: 'Exame excluído com sucesso.' });
});

module.exports = router;
