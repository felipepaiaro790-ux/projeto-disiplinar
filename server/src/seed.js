const db = require('./database');

function runSeed() {
  console.log('🌱 Atualizando Seed do Banco de Dados NutriTrack...');

  // 1. Cadastrar Planos Oficiais solicitados: Premium Padrão (R$100) e Premium Plus (R$200)
  const plans = [
    {
      id: 'plan_padrao',
      nome: 'Premium Padrão',
      preco_mensal: 100.00,
      tokens_mensais: 3000,
      tokens_diarios: 100,
      descricao: 'Desbloqueia o chat com a IA Nutricional e concede 100 tokens diários de consulta.',
      recursos_json: JSON.stringify([
        'Desbloqueia o Chat com a NutriIA Oficial',
        '100 Tokens diários de consulta (1 token por pergunta)',
        'Análise da Anamnese e Exames pela IA',
        'Cálculo e ajuste de calorias e peso',
        'Acesso à Loja de Tokens (10 tokens por R$ 15,00)'
      ]),
      destaque: 0
    },
    {
      id: 'plan_plus',
      nome: 'Premium Plus',
      preco_mensal: 200.00,
      tokens_mensais: 1000,
      tokens_diarios: 0,
      descricao: 'Acesso completo com 1.000 tokens, desbloqueio de Clínicas Próximas e bônus na loja.',
      recursos_json: JSON.stringify([
        'Tudo do Premium Padrão',
        '1.000 Tokens de uso com a NutriIA',
        'Desbloqueio Exclusivo da página de Clínicas Próximas',
        'Canal de contato direto com clínicas de nutrição',
        'Bônus Especial na Loja: Ganhe +3 tokens extras a cada compra (13 tokens por R$ 15,00)',
        'Prioridade máxima e suporte clínico avançado'
      ]),
      destaque: 1
    }
  ];

  const insertPlan = db.prepare(`
    INSERT OR REPLACE INTO plans (id, nome, preco_mensal, tokens_mensais, tokens_diarios, descricao, recursos_json, destaque)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const plan of plans) {
    insertPlan.run(
      plan.id,
      plan.nome,
      plan.preco_mensal,
      plan.tokens_mensais,
      plan.tokens_diarios,
      plan.descricao,
      plan.recursos_json,
      plan.destaque
    );
  }
  console.log('✅ Planos Premium Padrão e Premium Plus registrados!');

  // 2. Cadastrar Clínicas Fictícias de Nutrição e Saúde
  const clinics = [
    {
      id: 'clinica_1',
      nome: 'Clínica NutriVida & Metabolismo',
      especialidade: 'Nutrição Clínica, Obesidade & Emagrecimento',
      distancia_km: 1.2,
      endereco: 'Av. Paulista, 1420 - Bela Vista, São Paulo - SP',
      telefone: '(11) 3288-4100',
      nota: 4.9,
      atendimento: 'Segunda a Sexta, 08h às 19h',
      avatar_url: '🏥'
    },
    {
      id: 'clinica_2',
      nome: 'Instituto GastroNutri Integrado',
      especialidade: 'Gastroenterologia, Intolerâncias & Doença Celíaca',
      distancia_km: 2.8,
      endereco: 'Rua Oscar Freire, 850 - Jardins, São Paulo - SP',
      telefone: '(11) 3064-1290',
      nota: 4.8,
      atendimento: 'Segunda a Sábado, 08h às 18h',
      avatar_url: '🥗'
    },
    {
      id: 'clinica_3',
      nome: 'Centro Clínico BioHealth & Performance',
      especialidade: 'Nutrição Esportiva & Longevidade Saudável',
      distancia_km: 3.5,
      endereco: 'Rua Funchal, 418 - Vila Olímpia, São Paulo - SP',
      telefone: '(11) 3845-7722',
      nota: 4.9,
      atendimento: 'Segunda a Sexta, 07h às 21h',
      avatar_url: '⚡'
    },
    {
      id: 'clinica_4',
      nome: 'Espaço Renovar Nutrição Preventiva',
      especialidade: 'Doenças Metabólicas, Diabetes & Hipertensão',
      distancia_km: 4.1,
      endereco: 'Alameda Santos, 1800 - Cerqueira César, São Paulo - SP',
      telefone: '(11) 3141-9030',
      nota: 4.7,
      atendimento: 'Segunda a Sexta, 08h às 18h',
      avatar_url: '🌿'
    },
    {
      id: 'clinica_5',
      nome: 'Clínica Pediátrica & Materno-Infantil NutriCare',
      especialidade: 'Nutrição Gestacional, Infantil & Seletividade',
      distancia_km: 5.3,
      endereco: 'Rua Vergueiro, 2200 - Vila Mariana, São Paulo - SP',
      telefone: '(11) 5082-3344',
      nota: 5.0,
      atendimento: 'Segunda a Sexta, 08h às 17h',
      avatar_url: '👶'
    }
  ];

  const insertClinic = db.prepare(`
    INSERT OR REPLACE INTO clinics (id, nome, especialidade, distancia_km, endereco, telefone, nota, atendimento, avatar_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of clinics) {
    insertClinic.run(c.id, c.nome, c.especialidade, c.distancia_km, c.endereco, c.telefone, c.nota, c.atendimento, c.avatar_url);
  }
  console.log('✅ Clínicas parceiras cadastradas com sucesso!');

  // 3. Usuário Demo Pré-configurado para a banca
  const testUserId = 'usr_demo_felipe';
  db.prepare(`
    INSERT OR REPLACE INTO users (id, nome, email, senha, role, plano_id, tokens_balance, telefone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    testUserId,
    'Felipe Rosa (Paciente Demo)',
    'felipe@nutritrack.com',
    'senha123',
    'patient',
    'plan_plus', // Inicia no Premium Plus para demonstrar todos os recursos liberados
    1000,
    '(11) 98765-4321'
  );

  // Anamnese do paciente de teste
  db.prepare(`
    INSERT OR REPLACE INTO anamnesis (
      id, user_id, idade, sexo, peso, altura, circunferencia_cintura, circunferencia_quadril,
      nivel_atividade, objetivo, diabetes, hipertensao, dislipidemia, doenca_cardiaca, esteatose_hepatica,
      outras_patologias, alergias_alimentares, intolerancia_lactose, intolerancia_gluten,
      medicamentos_uso_continuo, qualidade_sono, consumo_agua_litros, nivel_estresse, observacoes_clinicas
    ) VALUES (
      'anam_demo_felipe', ?, 32, 'male', 89.5, 178, 96.0, 102.0,
      'light', 'lose_weight', 'prediabetes', 1, 1, 0, 1,
      'Histórico familiar de diabetes tipo 2', 'Amendoim e camarão', 1, 0,
      'Losartana 50mg', 'regular', 2.2, 'high', 'Compulsão por carboidratos à noite'
    )
  `).run(testUserId);

  // Exame laboratorial do paciente
  db.prepare(`
    INSERT OR REPLACE INTO lab_exams (id, user_id, tipo_exame, data_exame, valores_json, laudo_resumo, arquivo_url)
    VALUES ('exam_1', ?, 'perfil_metabolico_glicidico', '2026-10-15', ?, ?, 'laudo_outubro.pdf')
  `).run(
    testUserId,
    JSON.stringify({ glicemia_jejum: 108, hba1c: 5.9, colesterol_total: 218, ldl: 142, triglicerideos: 185 }),
    'Quadro compatível com pré-diabetes e dislipidemia mista.'
  );

  // Mensagem isolada pré-existente na clínica 1 para demonstrar histórico funcionando
  db.prepare(`
    INSERT OR REPLACE INTO clinic_messages (id, user_id, clinic_id, remetente, conteudo, created_at)
    VALUES ('cmsg_demo_1', ?, 'clinica_1', 'user', 'Olá! Gostaria de saber os horários disponíveis para consulta presencial de avaliação nutricional.', '2026-11-20 10:30:00')
  `).run(testUserId);

  console.log('🎉 Seed completo atualizado com sucesso!');
}

if (require.main === module) {
  runSeed();
}

module.exports = runSeed;
