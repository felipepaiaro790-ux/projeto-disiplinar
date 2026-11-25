const API_BASE = 'http://localhost:4000/api';

export const api = {
  // Auth
  async login(email, senha) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro no login');
    return data;
  },

  async register(payload) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro no cadastro');
    return data;
  },

  async getMe(userId) {
    const res = await fetch(`${API_BASE}/auth/me/${userId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao carregar usuário');
    return data;
  },

  // Anamnese
  async getAnamnesis(userId) {
    const res = await fetch(`${API_BASE}/anamnesis/${userId}`);
    if (res.status === 404) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao buscar anamnese');
    return data;
  },

  async saveAnamnesis(payload) {
    const res = await fetch(`${API_BASE}/anamnesis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao salvar anamnese');
    return data;
  },

  // Exames Laboratoriais
  async getLabExams(userId) {
    const res = await fetch(`${API_BASE}/lab-exams/user/${userId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao buscar exames');
    return data.exams || [];
  },

  async createLabExam(payload) {
    const res = await fetch(`${API_BASE}/lab-exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao criar exame');
    return data;
  },

  async deleteLabExam(examId) {
    const res = await fetch(`${API_BASE}/lab-exams/${examId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao excluir exame');
    return data;
  },

  // IA Nutricional & Múltiplos Chats
  async getAIChats(userId) {
    const res = await fetch(`${API_BASE}/ai-chat/chats/user/${userId}`);
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.message || data.error || 'Erro ao buscar chats');
      err.data = data;
      throw err;
    }
    return data.chats || [];
  },

  async createAIChat(userId, titulo) {
    const res = await fetch(`${API_BASE}/ai-chat/chats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, titulo })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao criar chat');
    return data.chat;
  },

  async deleteAIChat(chatId) {
    const res = await fetch(`${API_BASE}/ai-chat/chats/${chatId}`, { method: 'DELETE' });
    return res.json();
  },

  async getChatMessages(chatId) {
    const res = await fetch(`${API_BASE}/ai-chat/messages/${chatId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao buscar mensagens');
    return data.messages || [];
  },

  async sendAIMessage(userId, chatId, message) {
    const res = await fetch(`${API_BASE}/ai-chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, chat_id: chatId, message })
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.message || data.error || 'Erro ao processar mensagem com a IA');
      err.data = data;
      throw err;
    }
    return data;
  },

  // Planos e Assinaturas
  async getPlans() {
    const res = await fetch(`${API_BASE}/plans`);
    const data = await res.json();
    return data.plans || [];
  },

  async subscribePlan(userId, planId) {
    const res = await fetch(`${API_BASE}/plans/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, plan_id: planId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao assinar plano');
    return data;
  },

  // Loja de Tokens e Recargas
  async getTokenTransactions(userId) {
    const res = await fetch(`${API_BASE}/tokens/transactions/user/${userId}`);
    const data = await res.json();
    return data;
  },

  async rechargeTokens(userId) {
    const res = await fetch(`${API_BASE}/tokens/recharge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro na compra de tokens');
    return data;
  },

  // Clínicas Próximas & Chats Independentes
  async getClinics(userId) {
    const res = await fetch(`${API_BASE}/clinics?user_id=${userId}`);
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.message || data.error || 'Erro ao carregar clínicas');
      err.data = data;
      throw err;
    }
    return data.clinics || [];
  },

  async getClinicMessages(clinicId, userId) {
    const res = await fetch(`${API_BASE}/clinics/${clinicId}/messages?user_id=${userId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao carregar mensagens da clínica');
    return data;
  },

  async sendClinicMessage(clinicId, userId, message) {
    const res = await fetch(`${API_BASE}/clinics/${clinicId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, message })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao enviar mensagem para a clínica');
    return data;
  },

  // Portal B2B para Clínicas
  async submitB2BLead(payload) {
    const res = await fetch(`${API_BASE}/b2b/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erro ao enviar proposta');
    return data;
  }
};
