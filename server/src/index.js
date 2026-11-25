const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Inicialização do Banco de Dados Relacional SQLite
require('./database');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos de uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Servir o Frontend SPA React compilado em produção
const clientDistPath = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// Rotas RESTful da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/anamnesis', require('./routes/anamnesis'));
app.use('/api/lab-exams', require('./routes/labExams'));
app.use('/api/ai-chat', require('./routes/aiChat'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/tokens', require('./routes/tokens'));
app.use('/api/clinics', require('./routes/clinics'));
app.use('/api/b2b', require('./routes/b2b'));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'NutriTrack Pro Clinical API',
    version: '2.1.0',
    timestamp: new Date().toISOString()
  });
});

// Fallback SPA: Qualquer rota não-API entrega o index.html do React
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Middleware Global de Erros
app.use((err, req, res, next) => {
  console.error('❌ Erro no Servidor:', err);
  res.status(500).json({ error: 'Erro interno no servidor.', details: err.message });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 NutriTrack Pro rodando em http://localhost:${PORT}`);
  console.log(`📊 Backend RESTful + Banco Relacional SQLite: ATIVO`);
  console.log(`🏥 Rotas de Clínicas Próximas & Chats: ATIVAS`);
  console.log(`====================================================`);
});
