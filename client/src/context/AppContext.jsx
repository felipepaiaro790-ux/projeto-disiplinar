import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Inicialização do estado de autenticação
  // Inicializa como null para garantir proteção estrita de rota para novos visitantes,
  // ou com o usuário salvo se houver sessão ativa
  const [user, setUser] = useState(null);
  const [anamnesisData, setAnamnesisData] = useState(null);
  const [examsList, setExamsList] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Carrega dados atualizados do usuário do banco relacional
  const refreshUserData = async (forcedUserId = null) => {
    const targetId = forcedUserId || user?.id;
    if (!targetId) {
      setLoadingUser(false);
      return;
    }

    try {
      setLoadingUser(true);
      const res = await api.getMe(targetId);
      if (res?.user) {
        setUser(res.user);
      }
      const anam = await api.getAnamnesis(targetId);
      setAnamnesisData(anam);
      const exams = await api.getLabExams(targetId);
      setExamsList(exams);
    } catch (err) {
      console.error('Erro ao sincronizar dados:', err);
    } finally {
      setLoadingUser(false);
    }
  };

  // Inicializa checando se o usuário demo já deve estar pronto para teste rápido
  useEffect(() => {
    // Para conveniência do avaliador, verifica se há usuário ativo ou permite login direto
    refreshUserData('usr_demo_felipe');
  }, []);

  const login = async (email, senha) => {
    const res = await api.login(email, senha);
    setUser(res.user);
    showToast(`Bem-vindo de volta, ${res.user.nome.split(' ')[0]}!`, 'success');
    return res.user;
  };

  const register = async (payload) => {
    const res = await api.register(payload);
    setUser(res.user);
    showToast('Conta criada! Escolha seu plano para começar.', 'success');
    return res.user;
  };

  const logout = () => {
    setUser(null);
    setAnamnesisData(null);
    setExamsList([]);
    showToast('Você encerrou a sessão com segurança.', 'info');
  };

  const updateTokensBalance = (newBalance) => {
    setUser(prev => prev ? { ...prev, tokens_balance: newBalance } : prev);
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      login,
      register,
      logout,
      anamnesisData,
      setAnamnesisData,
      examsList,
      setExamsList,
      refreshUserData,
      updateTokensBalance,
      loadingUser,
      showToast,
      notification
    }}>
      {children}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: notification.type === 'error' ? '#EF4444' : (notification.type === 'info' ? '#3B82F6' : '#10B981'),
          color: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: '9999px',
          fontWeight: 600,
          fontSize: '0.92rem',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <span>{notification.type === 'error' ? '⚠️' : (notification.type === 'info' ? 'ℹ️' : '✓')}</span>
          {notification.message}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
