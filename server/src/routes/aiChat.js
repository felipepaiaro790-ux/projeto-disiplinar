const express = require('express');
const router = express.Router();
const db = require('../database');

// Função de Geração de Resposta Especializada em Nutrição
function generateSpecializedNutritionResponse(userMessage, anamnesis, exams) {
  const msgLower = userMessage.toLowerCase();

  let infoClinica = '';
  if (anamnesis) {
    const alturaM = anamnesis.altura / 100;
    const imc = (anamnesis.peso / (alturaM * alturaM)).toFixed(1);
    infoClinica += `Paciente com IMC ${imc} (${anamnesis.peso}kg, ${anamnesis.altura}cm, ${anamnesis.idade} anos). `;
    if (anamnesis.diabetes && anamnesis.diabetes !== 'none') infoClinica += `Condição glicêmica: ${anamnesis.diabetes}. `;
    if (anamnesis.hipertensao) infoClinica += `Hipertenso em acompanhamento. `;
    if (anamnesis.dislipidemia) infoClinica += `Dislipidemia/colesterol alterado. `;
    if (anamnesis.intolerancia_lactose) infoClinica += `Intolerante a lactose. `;
    if (anamnesis.alergias_alimentares) infoClinica += `Alergias: ${anamnesis.alergias_alimentares}. `;
  }

  if (msgLower.includes('lanche') || msgLower.includes('comer') || msgLower.includes('refeição') || msgLower.includes('dieta') || msgLower.includes('café') || msgLower.includes('almoço') || msgLower.includes('jantar')) {
    let alimentosProibidos = [];
    if (anamnesis?.intolerancia_lactose) alimentosProibidos.push('laticínios convencionais com lactose');
    if (anamnesis?.alergias_alimentares) alimentosProibidos.push(anamnesis.alergias_alimentares);

    return `Com base na sua **Anamnese Clínica** e nos seus **marcadores metabólicos laboratoriais**, estruturei uma recomendação pautada em evidências nutricionais:

🎯 **Diretriz Terapêutica:**
${infoClinica ? `Levando em consideração seu perfil (${infoClinica}), nosso foco principal é **estabilizar o índice glicêmico**, modular a inflamação e preservar massa magra com saciedade.` : 'Foco em saciedade e equilíbrio de macronutrientes.'}
${alimentosProibidos.length > 0 ? `\n🚫 **Restrições respeitadas:** Exclusão estrita de ${alimentosProibidos.join(', ')}.` : ''}

🥗 **Sugestão Prática Recomendada:**
1. **Fonte Proteica de Alto Valor Biológico:** 2 ovos caipiras pochê ou 120g de tofu grelhado / pasta de atum em azeite de oliva extra virgem.
2. **Carboidrato Complexo de Baixa Carga Glicêmica:** 1 fatia de pão de fermentação natural 100% integral ou 30g de farelo de aveia.
3. **Fibras Solúveis & Antioxidantes:** Mix de morangos com sementes de abóbora e chia (1 colher de sobremesa): as fibras retardam a absorção dos carboidratos e auxiliam no perfil lipídico.
4. **Hidratação Terapêutica:** Chá de hibisco com canela (sem açúcar) ou 300ml de água mineral.

*⚕️ Nota Técnica: Esta orientação foi formulada seguindo as diretrizes clínicas da ASBRAN e Consenso Brasileiro de Nutrição Clínica. Ela atua como ferramenta de suporte à decisão e não anula a consulta com seu nutricionista assistente.*`;
  }

  if (msgLower.includes('exame') || msgLower.includes('glicemia') || msgLower.includes('colesterol') || msgLower.includes('triglicerídeo') || msgLower.includes('sangue')) {
    let dadosExameTexto = 'Não há exames cadastrados recentemente.';
    if (exams && exams.length > 0) {
      const e = exams[0];
      const vals = JSON.parse(e.valores_json || '{}');
      dadosExameTexto = Object.entries(vals).map(([k, v]) => `• **${k.replace('_', ' ').toUpperCase()}**: ${v}`).join('\n');
    }

    return `Analisei os parâmetros laboratoriais mais recentes do seu prontuário:

📋 **Marcadores Identificados:**
${dadosExameTexto}

🔍 **Interpretação e Conduta Nutricional:**
- **Metabolismo Glicídico:** É fundamental evitar o consumo de carboidratos refinados isolados (farinhas brancas, sucos coados e açúcar). Sempre associe carboidratos a fibras solúveis (aveia, psyllium, legumes) e fontes proteicas.
- **Perfil Lipídico:** Para auxiliar na redução do LDL e triglicerídeos, aumente a ingestão de gorduras monoinsaturadas (azeite de oliva extravirgem, abacate) e ômega-3.
- **Acompanhamento:** Sugiro registrar a evolução desses marcadores daqui a 60-90 dias para compararmos o impacto da reeducação alimentar.

*⚠️ Importante: Alterações laboratoriais devem sempre ser avaliadas em conjunto com o médico clínico ou endocrinologista responsável.*`;
  }

  return `Olá! Sou a **NutriIA**, seu assistente nutricional clínico e analítico no NutriTrack.

Estou configurada com acesso contínuo aos dados da sua **anamnese clínica** ${anamnesis ? `(IMC atual, patologias e histórico de ${anamnesis.peso}kg)` : ''} e seus **exames laboratoriais**.

Como posso te auxiliar hoje? Você pode me perguntar:
- *"Qual refeição fazer no lanche da tarde considerando minha anamnese?"*
- *"Como melhorar meus níveis de colesterol e glicemia através dos alimentos?"*
- *"Quais alimentos evitar com base nas minhas intolerâncias registradas?"*

*A NutriIA é uma tecnologia de apoio respaldada por diretrizes de nutrição clínica, promovendo decisões alimentares inteligentes e conscientes.*`;
}

// GET /api/ai-chat/chats/user/:userId - Listar todas as sessões de chat do usuário
router.get('/chats/user/:userId', (req, res) => {
  const user = db.prepare('SELECT plano_id FROM users WHERE id = ?').get(req.params.userId);
  if (!user || !user.plano_id) {
    return res.status(403).json({
      error: 'Assinatura Necessária',
      code: 'SUBSCRIPTION_REQUIRED',
      message: 'O Chat com nossa IA Nutricional é desbloqueado exclusivamente a partir do plano Premium Padrão.'
    });
  }

  const chats = db.prepare(`
    SELECT c.*, 
      (SELECT conteudo FROM ai_messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as ultima_mensagem
    FROM ai_chats c
    WHERE c.user_id = ?
    ORDER BY c.updated_at DESC
  `).all(req.params.userId);

  return res.json({ chats });
});

// POST /api/ai-chat/chats - Criar nova sessão de chat
router.post('/chats', (req, res) => {
  const { user_id, titulo } = req.body;
  if (!user_id) return res.status(400).json({ error: 'user_id é obrigatório.' });

  const user = db.prepare('SELECT plano_id FROM users WHERE id = ?').get(user_id);
  if (!user || !user.plano_id) {
    return res.status(403).json({ error: 'Assinatura necessária para criar consultas com a IA.' });
  }

  const chatId = 'chat_' + Date.now();
  const chatTitle = titulo || 'Nova Consulta Nutricional';

  db.prepare(`
    INSERT INTO ai_chats (id, user_id, titulo)
    VALUES (?, ?, ?)
  `).run(chatId, user_id, chatTitle);

  const msgId = 'msg_' + Date.now();
  db.prepare(`
    INSERT INTO ai_messages (id, chat_id, remetente, conteudo, tokens_consumidos)
    VALUES (?, ?, 'assistant', 'Olá! Sou a NutriIA. Estou pronta para analisar sua anamnese clínica, exames laboratoriais e montar estratégias alimentares precisas. Como posso te apoiar agora?', 0)
  `).run(msgId, chatId);

  const chat = db.prepare('SELECT * FROM ai_chats WHERE id = ?').get(chatId);
  return res.status(201).json({ chat });
});

// DELETE /api/ai-chat/chats/:chatId - Excluir sessão de chat
router.delete('/chats/:chatId', (req, res) => {
  db.prepare('DELETE FROM ai_chats WHERE id = ?').run(req.params.chatId);
  return res.json({ message: 'Conversa excluída com sucesso.' });
});

// GET /api/ai-chat/messages/:chatId - Listar mensagens de um chat
router.get('/messages/:chatId', (req, res) => {
  const messages = db.prepare(`
    SELECT * FROM ai_messages 
    WHERE chat_id = ? 
    ORDER BY created_at ASC
  `).all(req.params.chatId);

  return res.json({ messages });
});

// POST /api/ai-chat/message - Enviar mensagem do usuário, debitar EXATAMENTE 1 TOKEN por mensagem
router.post('/message', (req, res) => {
  const { user_id, chat_id, message } = req.body;
  if (!user_id || !chat_id || !message) {
    return res.status(400).json({ error: 'user_id, chat_id e message são obrigatórios.' });
  }

  const user = db.prepare('SELECT id, tokens_balance, plano_id FROM users WHERE id = ?').get(user_id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  // Validar se tem plano ativo
  if (!user.plano_id) {
    return res.status(403).json({
      error: 'Assinatura Necessária',
      code: 'SUBSCRIPTION_REQUIRED',
      message: 'Desbloqueie o acesso à NutriIA escolhendo o plano Premium Padrão ou Premium Plus.'
    });
  }

  // Regra Exata: Cada interação consome 1 token
  const tokenCost = 1;

  if (user.tokens_balance < tokenCost) {
    return res.status(403).json({
      error: 'Saldo de tokens insuficiente.',
      code: 'INSUFFICIENT_TOKENS',
      tokens_balance: user.tokens_balance,
      tokens_needed: tokenCost,
      message: 'Seus tokens para este ciclo esgotaram. Visite nossa Loja de Tokens dentro do chat para adquirir pacotes avulsos e continuar sua consulta.'
    });
  }

  // 2. Buscar dados clínicos da anamnese e exames
  const anamnesis = db.prepare('SELECT * FROM anamnesis WHERE user_id = ?').get(user_id);
  const exams = db.prepare('SELECT * FROM lab_exams WHERE user_id = ? ORDER BY data_exame DESC LIMIT 3').all(user_id);

  // 3. Salvar mensagem do usuário
  const userMsgId = 'msg_' + Date.now();
  db.prepare(`
    INSERT INTO ai_messages (id, chat_id, remetente, conteudo, tokens_consumidos)
    VALUES (?, ?, 'user', ?, 0)
  `).run(userMsgId, chat_id, message);

  // Atualizar título do chat se for a primeira mensagem
  const msgCount = db.prepare("SELECT count(*) as count FROM ai_messages WHERE chat_id = ? AND remetente = 'user'").get(chat_id);
  if (msgCount.count <= 1) {
    const newTitle = message.length > 28 ? message.substring(0, 28) + '...' : message;
    db.prepare('UPDATE ai_chats SET titulo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newTitle, chat_id);
  } else {
    db.prepare('UPDATE ai_chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(chat_id);
  }

  // 4. Gerar resposta clínica especializada
  const aiResponseText = generateSpecializedNutritionResponse(message, anamnesis, exams);

  // 5. Salvar resposta da IA com débito de 1 token
  const aiMsgId = 'msg_' + (Date.now() + 1);
  db.prepare(`
    INSERT INTO ai_messages (id, chat_id, remetente, conteudo, tokens_consumidos)
    VALUES (?, ?, 'assistant', ?, ?)
  `).run(aiMsgId, chat_id, aiResponseText, tokenCost);

  // 6. Debitar 1 token do saldo
  const newBalance = user.tokens_balance - tokenCost;
  db.prepare('UPDATE users SET tokens_balance = ? WHERE id = ?').run(newBalance, user_id);

  // 7. Registrar transação
  db.prepare(`
    INSERT INTO token_transactions (id, user_id, quantidade, tipo, descricao, saldo_apos)
    VALUES (?, ?, ?, 'AI_MESSAGE_DEBIT', ?, ?)
  `).run(
    'trans_' + Date.now(),
    user_id,
    -tokenCost,
    `Interação NutriIA (1 token consumido)`,
    newBalance
  );

  return res.json({
    user_message: { id: userMsgId, chat_id, remetente: 'user', conteudo: message },
    ai_message: { id: aiMsgId, chat_id, remetente: 'assistant', conteudo: aiResponseText, tokens_consumidos: tokenCost },
    tokens_consumed: tokenCost,
    tokens_balance: newBalance
  });
});

module.exports = router;
