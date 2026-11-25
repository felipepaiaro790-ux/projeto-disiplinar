const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'nutritrack.db');
const db = new DatabaseSync(dbPath);

// Habilitar Foreign Keys
db.exec('PRAGMA foreign_keys = ON;');

function initDatabase() {
  db.exec(`
    -- Tabela de Planos de Assinatura
    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      preco_mensal REAL NOT NULL,
      tokens_mensais INTEGER NOT NULL,
      tokens_diarios INTEGER DEFAULT 0,
      descricao TEXT NOT NULL,
      recursos_json TEXT NOT NULL,
      destaque INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de Usuários (Pacientes e Profissionais)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      role TEXT CHECK(role IN ('patient', 'nutritionist', 'clinic_admin')) DEFAULT 'patient',
      plano_id TEXT REFERENCES plans(id) ON DELETE SET NULL,
      tokens_balance INTEGER DEFAULT 0,
      telefone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de Anamnese Clínica e Dados Biomédicos Aprofundados
    CREATE TABLE IF NOT EXISTS anamnesis (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      idade INTEGER NOT NULL,
      sexo TEXT CHECK(sexo IN ('male', 'female', 'other')) NOT NULL,
      peso REAL NOT NULL,
      altura REAL NOT NULL,
      circunferencia_cintura REAL,
      circunferencia_quadril REAL,
      nivel_atividade TEXT CHECK(nivel_atividade IN ('sedentary', 'light', 'moderate', 'intense', 'very_intense')) DEFAULT 'moderate',
      objetivo TEXT CHECK(objetivo IN ('lose_weight', 'maintain', 'gain_muscle', 'clinical_control')) DEFAULT 'maintain',
      
      -- Histórico Clínico & Patologias
      diabetes TEXT DEFAULT 'none',
      hipertensao INTEGER DEFAULT 0,
      dislipidemia INTEGER DEFAULT 0,
      doenca_cardiaca INTEGER DEFAULT 0,
      esteatose_hepatica INTEGER DEFAULT 0,
      outras_patologias TEXT,
      
      -- Alergias, Intolerâncias e Medicamentos
      alergias_alimentares TEXT,
      intolerancia_lactose INTEGER DEFAULT 0,
      intolerancia_gluten INTEGER DEFAULT 0,
      medicamentos_uso_continuo TEXT,
      
      -- Hábitos & Rotina
      qualidade_sono TEXT DEFAULT 'regular',
      consumo_agua_litros REAL DEFAULT 2.0,
      nivel_estresse TEXT DEFAULT 'moderate',
      observacoes_clinicas TEXT,
      
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de Exames Laboratoriais
    CREATE TABLE IF NOT EXISTS lab_exams (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      tipo_exame TEXT NOT NULL,
      data_exame DATE NOT NULL,
      valores_json TEXT NOT NULL,
      laudo_resumo TEXT,
      arquivo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de Clínicas Fictícias Parceiras (Para Clínicas Próximas)
    CREATE TABLE IF NOT EXISTS clinics (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      especialidade TEXT NOT NULL,
      distancia_km REAL NOT NULL,
      endereco TEXT NOT NULL,
      telefone TEXT NOT NULL,
      nota REAL NOT NULL,
      atendimento TEXT NOT NULL,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de Mensagens do Chat com Clínicas (Isolamento por clinic_id)
    CREATE TABLE IF NOT EXISTS clinic_messages (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      clinic_id TEXT NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
      remetente TEXT CHECK(remetente IN ('user', 'clinic')) NOT NULL,
      conteudo TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de Sessões de Chat com a NutriIA
    CREATE TABLE IF NOT EXISTS ai_chats (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      titulo TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de Mensagens do Chat IA com Contagem de Tokens (1 token por pergunta)
    CREATE TABLE IF NOT EXISTS ai_messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL REFERENCES ai_chats(id) ON DELETE CASCADE,
      remetente TEXT CHECK(remetente IN ('user', 'assistant')) NOT NULL,
      conteudo TEXT NOT NULL,
      tokens_consumidos INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de Extrato e Histórico de Transações de Tokens
    CREATE TABLE IF NOT EXISTS token_transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      quantidade INTEGER NOT NULL,
      tipo TEXT CHECK(tipo IN ('PLAN_RELOAD', 'EXTRA_PURCHASE', 'AI_MESSAGE_DEBIT', 'INITIAL_BONUS')) NOT NULL,
      descricao TEXT NOT NULL,
      saldo_apos INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela do Portal B2B: Clínicas Leads
    CREATE TABLE IF NOT EXISTS clinic_leads (
      id TEXT PRIMARY KEY,
      nome_clinica TEXT NOT NULL,
      nome_responsavel TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT NOT NULL,
      cidade TEXT,
      estado TEXT,
      qtd_nutricionistas TEXT,
      mensagem TEXT,
      status TEXT CHECK(status IN ('new', 'contacted', 'demo_scheduled', 'partner_active', 'closed')) DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

initDatabase();

module.exports = db;
