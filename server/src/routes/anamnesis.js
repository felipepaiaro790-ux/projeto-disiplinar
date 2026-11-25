const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/anamnesis/:userId - Buscar anamnese do usuário
router.get('/:userId', (req, res) => {
  const anamnesis = db.prepare('SELECT * FROM anamnesis WHERE user_id = ?').get(req.params.userId);
  if (!anamnesis) {
    return res.status(404).json({ message: 'Nenhuma anamnese clínica encontrada para este usuário.' });
  }

  // Cálculos automáticos derivados
  const alturaMetros = anamnesis.altura / 100;
  const imc = parseFloat((anamnesis.peso / (alturaMetros * alturaMetros)).toFixed(1));
  let rcq = null;
  if (anamnesis.circunferencia_cintura && anamnesis.circunferencia_quadril) {
    rcq = parseFloat((anamnesis.circunferencia_cintura / anamnesis.circunferencia_quadril).toFixed(2));
  }

  // Classificação de Risco
  let classificacaoImc = 'Peso Saudável';
  let riscoMetabolico = 'Baixo';

  if (imc < 18.5) {
    classificacaoImc = 'Abaixo do peso';
  } else if (imc >= 25 && imc < 30) {
    classificacaoImc = 'Sobrepeso (Pré-obesidade)';
    riscoMetabolico = 'Aumentado';
  } else if (imc >= 30 && imc < 35) {
    classificacaoImc = 'Obesidade Grau I';
    riscoMetabolico = 'Alto';
  } else if (imc >= 35 && imc < 40) {
    classificacaoImc = 'Obesidade Grau II (Severa)';
    riscoMetabolico = 'Muito Alto';
  } else if (imc >= 40) {
    classificacaoImc = 'Obesidade Grau III (Mórbida)';
    riscoMetabolico = 'Crítico';
  }

  // Verificação de risco cardiovascular por RCQ
  let riscoRCQ = 'Normal';
  if (anamnesis.sexo === 'male' && rcq >= 0.90) riscoRCQ = 'Elevado';
  if (anamnesis.sexo === 'female' && rcq >= 0.85) riscoRCQ = 'Elevado';

  return res.json({
    anamnesis,
    metricas: {
      imc,
      classificacaoImc,
      rcq,
      riscoRCQ,
      riscoMetabolico
    }
  });
});

// POST /api/anamnesis - Criar ou Atualizar Anamnese Completa (Upsert)
router.post('/', (req, res) => {
  const {
    user_id, idade, sexo, peso, altura,
    circunferencia_cintura, circunferencia_quadril,
    nivel_atividade, objetivo, diabetes, hipertensao,
    dislipidemia, doenca_cardiaca, esteatose_hepatica,
    outras_patologias, alergias_alimentares,
    intolerancia_lactose, intolerancia_gluten,
    medicamentos_uso_continuo, qualidade_sono,
    consumo_agua_litros, nivel_estresse, observacoes_clinicas
  } = req.body;

  if (!user_id || !idade || !sexo || !peso || !altura) {
    return res.status(400).json({ error: 'Campos biométricos essenciais são obrigatórios (idade, sexo, peso, altura).' });
  }

  const existing = db.prepare('SELECT id FROM anamnesis WHERE user_id = ?').get(user_id);
  const anamId = existing ? existing.id : ('anam_' + Date.now());

  db.prepare(`
    INSERT OR REPLACE INTO anamnesis (
      id, user_id, idade, sexo, peso, altura,
      circunferencia_cintura, circunferencia_quadril,
      nivel_atividade, objetivo, diabetes, hipertensao,
      dislipidemia, doenca_cardiaca, esteatose_hepatica,
      outras_patologias, alergias_alimentares,
      intolerancia_lactose, intolerancia_gluten,
      medicamentos_uso_continuo, qualidade_sono,
      consumo_agua_litros, nivel_estresse, observacoes_clinicas,
      updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?,
      ?, ?,
      ?, ?,
      ?, ?, ?,
      CURRENT_TIMESTAMP
    )
  `).run(
    anamId, user_id, idade, sexo, peso, altura,
    circunferencia_cintura || null, circunferencia_quadril || null,
    nivel_atividade || 'moderate', objetivo || 'maintain',
    diabetes || 'none', hipertensao ? 1 : 0,
    dislipidemia ? 1 : 0, doenca_cardiaca ? 1 : 0, esteatose_hepatica ? 1 : 0,
    outras_patologias || '', alergias_alimentares || '',
    intolerancia_lactose ? 1 : 0, intolerancia_gluten ? 1 : 0,
    medicamentos_uso_continuo || '', qualidade_sono || 'regular',
    consumo_agua_litros || 2.0, nivel_estresse || 'moderate',
    observacoes_clinicas || ''
  );

  const updated = db.prepare('SELECT * FROM anamnesis WHERE id = ?').get(anamId);
  return res.json({ message: 'Anamnese clínica salva com sucesso!', anamnesis: updated });
});

module.exports = router;
