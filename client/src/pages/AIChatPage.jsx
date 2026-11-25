import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Send, Plus, Trash2, ShieldCheck, AlertCircle, 
  Coins, MessageSquare, Bot, User, CheckCircle2, ShoppingBag, Crown, Gift, X 
} from 'lucide-react';
import { formatMessageTime, MarkdownRenderer } from '../components/ChatUtils';

export default function AIChatPage() {
  const { user, updateTokensBalance, refreshUserData, showToast } = useApp();

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);

  // Modal da Loja de Tokens
  const [shopOpen, setShopOpen] = useState(false);
  const [buyingTokens, setBuyingTokens] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isPremiumPlus = user?.plano_id === 'plan_plus';
  const hasPlan = !!user?.plano_id;

  const fetchChats = async () => {
    if (!user?.id || !hasPlan) {
      setLoadingChats(false);
      return;
    }
    try {
      setLoadingChats(true);
      const res = await api.getAIChats(user.id);
      setChats(res);

      if (res.length > 0 && !activeChatId) {
        setActiveChatId(res[0].id);
      } else if (res.length === 0) {
        const newChat = await api.createAIChat(user.id, 'Orientação Nutricional');
        setChats([newChat]);
        setActiveChatId(newChat.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user?.id, user?.plano_id]);

  useEffect(() => {
    if (!activeChatId) return;
    const fetchMsgs = async () => {
      try {
        const msgs = await api.getChatMessages(activeChatId);
        setMessages(msgs);
        setTimeout(scrollToBottom, 80);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMsgs();
  }, [activeChatId]);

  const handleCreateNewChat = async () => {
    if (!user?.id) return;
    try {
      const newChat = await api.createAIChat(user.id, `Consulta #${chats.length + 1}`);
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      showToast('Nova sessão clínica criada!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!confirm('Deseja excluir esta conversa do histórico?')) return;
    try {
      await api.deleteAIChat(chatId);
      const remaining = chats.filter(c => c.id !== chatId);
      setChats(remaining);
      if (activeChatId === chatId) {
        setActiveChatId(remaining[0]?.id || null);
      }
      showToast('Conversa excluída do banco relacional.', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !user?.id || !activeChatId || loadingMsg) return;

    const currentMsg = inputText.trim();
    setInputText('');

    const tempUserMsg = {
      id: 'temp_u_' + Date.now(),
      remetente: 'user',
      conteudo: currentMsg,
      tokens_consumidos: 0,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setLoadingMsg(true);
    setTimeout(scrollToBottom, 40);

    try {
      const res = await api.sendAIMessage(user.id, activeChatId, currentMsg);
      setMessages(prev => [...prev.filter(m => m.id !== tempUserMsg.id), res.user_message, res.ai_message]);
      updateTokensBalance(res.tokens_balance);
      fetchChats();
      setTimeout(scrollToBottom, 80);
    } catch (err) {
      if (err.data?.code === 'INSUFFICIENT_TOKENS') {
        showToast('Tokens esgotados! Abra a Loja de Tokens para recarregar.', 'error');
        setShopOpen(true);
      } else {
        showToast(err.message || 'Erro ao comunicar com a IA', 'error');
      }
    } finally {
      setLoadingMsg(false);
    }
  };

  // Compra de Tokens na Loja integrada
  const handleBuyTokensFromShop = async () => {
    if (!user?.id) return;
    setBuyingTokens(true);
    try {
      const res = await api.rechargeTokens(user.id);
      updateTokensBalance(res.tokens_balance);
      await refreshUserData();
      showToast(res.message, 'success');
      setShopOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBuyingTokens(false);
    }
  };

  // BLOQUEIO PARA USUÁRIO SEM PLANO
  if (!hasPlan) {
    return (
      <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '720px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3.5rem 2rem', background: '#FFFFFF' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--emerald-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Sparkles size={32} color="#10B981" />
          </div>

          <span className="badge badge-amber" style={{ marginBottom: '1rem' }}>
            🔒 Acesso Exclusivo para Assinantes
          </span>

          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--slate-900)' }}>
            O Chat com a NutriIA está bloqueado
          </h2>

          <p style={{ fontSize: '1rem', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Para desbloquear nossa inteligência artificial clínica e começar a receber orientações pautadas na sua anamnese e exames laboratoriais, escolha o plano <strong>Premium Padrão</strong> ou <strong>Premium Plus</strong>.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/planos" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
              Ver Planos e Desbloquear Agora
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1150px' }}>
      
      {/* BARRA SUPERIOR DO CHAT COM SALDO & BOTÃO DA LOJA DE TOKENS */}
      <div style={{
        background: 'var(--emerald-50)',
        border: '1px solid var(--emerald-100)',
        borderRadius: '12px',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        fontSize: '0.85rem',
        color: '#065F46',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="#10B981" />
          <span>
            <strong>IA Nutricional Ativa:</strong> Consumo de <strong>1 token por interação</strong>. Baseado nas diretrizes da ASBRAN e SBD.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#047857' }}>
            <Coins size={16} />
            <span>Saldo: {user?.tokens_balance?.toLocaleString('pt-BR')} Tokens</span>
          </div>

          {/* BOTÃO DA LOJA DE TOKENS */}
          <button
            onClick={() => setShopOpen(true)}
            className="btn btn-primary"
            style={{
              fontSize: '0.8rem',
              padding: '6px 14px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShoppingBag size={14} />
            <span>Loja de Tokens</span>
          </button>
        </div>
      </div>

      {/* ÁREA DO CHAT MULTI-SESSÃO */}
      <div className="card" style={{
        padding: 0,
        height: 'calc(100vh - 180px)',
        minHeight: '560px',
        maxHeight: '780px',
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        overflow: 'hidden',
        background: '#FFFFFF'
      }}>
        
        {/* SIDEBAR: HISTÓRICO DE CHATS DO BANCO DE DADOS */}
        <aside style={{
          background: 'var(--bg-primary)',
          borderRight: '1px solid var(--slate-200)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          padding: '1.25rem'
        }}>
          <button
            onClick={handleCreateNewChat}
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1.25rem', borderRadius: '10px', fontSize: '0.88rem', flexShrink: 0 }}
          >
            <Plus size={16} />
            <span>Nova Consulta IA</span>
          </button>

          <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--slate-400)', marginBottom: '0.65rem', flexShrink: 0 }}>
            Histórico no Banco
          </span>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: activeChatId === chat.id ? 'var(--emerald-50)' : '#FFFFFF',
                  border: activeChatId === chat.id ? '1px solid var(--emerald-100)' : '1px solid var(--slate-200)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  transition: 'all 0.15s',
                  flexShrink: 0
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <MessageSquare size={16} color={activeChatId === chat.id ? '#10B981' : 'var(--slate-400)'} />
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: activeChatId === chat.id ? 700 : 500,
                    color: activeChatId === chat.id ? '#047857' : 'var(--slate-700)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {chat.titulo}
                  </span>
                </div>

                {chats.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: '2px' }}
                    title="Excluir chat"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--slate-200)', flexShrink: 0 }}>
            <button
              onClick={() => setShopOpen(true)}
              className="btn btn-secondary btn-outline"
              style={{ width: '100%', fontSize: '0.82rem', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <ShoppingBag size={14} />
              <span>Comprar Tokens</span>
            </button>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL DE CONVERSA */}
        <main style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: '#FFFFFF', overflow: 'hidden' }}>
          
          {/* HEADER DO CHAT ATIVO */}
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--slate-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            background: '#FFFFFF'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/ai_avatar.png"
                alt="NutriIA Avatar"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '2px solid #A7F3D0'
                }}
              />
              <div>
                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>NutriIA Clínica</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>
                  {user?.plano_nome || 'Plano Ativo'} • 1 token/pergunta
                </span>
              </div>
            </div>

            <button
              onClick={() => setShopOpen(true)}
              style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#047857',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShoppingBag size={14} />
              <span>Loja de Tokens</span>
            </button>
          </div>

          {/* LISTA DE MENSAGENS COM SCROLL DEDICADO */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignSelf: msg.remetente === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                {msg.remetente === 'assistant' && (
                  <img
                    src="/ai_avatar.png"
                    alt="NutriIA"
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      flexShrink: 0,
                      marginTop: '2px',
                      border: '1.5px solid #A7F3D0',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                    }}
                  />
                )}

                <div style={{
                  background: msg.remetente === 'user' ? 'linear-gradient(135deg, #10B981 0%, #0D9488 100%)' : 'var(--bg-subtle)',
                  color: msg.remetente === 'user' ? '#FFFFFF' : 'var(--slate-900)',
                  padding: '14px 18px',
                  borderRadius: msg.remetente === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontSize: '0.92rem',
                  lineHeight: 1.55,
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {msg.remetente === 'assistant' ? (
                    <MarkdownRenderer content={msg.conteudo} />
                  ) : (
                    <div style={{ whiteSpace: 'pre-line' }}>{msg.conteudo}</div>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '8px',
                    fontSize: '0.72rem',
                    opacity: 0.75,
                    borderTop: '1px dashed rgba(0,0,0,0.1)',
                    paddingTop: '4px'
                  }}>
                    <span>{formatMessageTime(msg.created_at)}</span>
                    {msg.tokens_consumidos > 0 && (
                      <span style={{ fontWeight: 600 }}>🪙 {msg.tokens_consumidos} token</span>
                    )}
                  </div>
                </div>

                {msg.remetente === 'user' && (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--slate-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <User size={18} color="var(--slate-600)" />
                  </div>
                )}
              </div>
            ))}

            {loadingMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                <Sparkles size={16} className="animate-spin" />
                <span>NutriIA cruzando seus dados clínicos e formulando resposta...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM FIXO NA BASE */}
          <form onSubmit={handleSendMessage} style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--slate-200)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            background: '#FFFFFF',
            flexShrink: 0
          }}>
            <input
              type="text"
              placeholder="Digite sua dúvida clínica (1 token por mensagem)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loadingMsg}
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '9999px',
                border: '1px solid var(--slate-200)',
                fontSize: '0.95rem',
                outline: 'none',
                background: '#FFFFFF',
                color: 'var(--slate-900)'
              }}
            />

            <button
              type="submit"
              disabled={loadingMsg || !inputText.trim()}
              className="btn btn-primary"
              style={{ width: '46px', height: '46px', borderRadius: '50%', padding: 0, flexShrink: 0 }}
            >
              <Send size={18} />
            </button>
          </form>

        </main>
      </div>

      {/* MODAL DA LOJA DE TOKENS */}
      {shopOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ maxWidth: '480px', width: '100%', padding: '2rem', background: '#FFFFFF' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={22} color="#10B981" />
                <h3 style={{ fontSize: '1.3rem' }}>Loja de Tokens NutriIA</h3>
              </div>
              <button
                onClick={() => setShopOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
              Adquira tokens avulsos para continuar suas consultas com a NutriIA.
            </p>

            {/* CARD DO PACOTE OFICIAL */}
            <div style={{
              border: isPremiumPlus ? '2px solid #10B981' : '1px solid var(--slate-200)',
              borderRadius: '16px',
              padding: '1.5rem',
              background: isPremiumPlus ? '#ECFDF5' : 'var(--bg-subtle)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <strong style={{ fontSize: '1.2rem', color: 'var(--slate-900)' }}>
                  Pacote de Tokens
                </strong>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857', fontFamily: 'var(--font-heading)' }}>
                  R$ 15,00
                </span>
              </div>

              {/* Quantidade de Tokens (10 tokens para Normal, 13 tokens para Premium Plus) */}
              <div style={{ margin: '1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Coins size={20} color="#10B981" />
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    {isPremiumPlus ? '13 Tokens de IA' : '10 Tokens de IA'}
                  </span>
                </div>

                {isPremiumPlus ? (
                  <div style={{
                    marginTop: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#FFFFFF',
                    border: '1px solid #A7F3D0',
                    color: '#047857',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}>
                    <Gift size={14} color="#F59E0B" />
                    <span>+3 Tokens bônus inclusos (Benefício Premium Plus!)</span>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginTop: '6px' }}>
                    💡 Dica: Usuários do <strong>Premium Plus</strong> ganham <strong>+3 tokens extras</strong> por compra (13 tokens).
                  </p>
                )}
              </div>

              <button
                onClick={handleBuyTokensFromShop}
                disabled={buyingTokens}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', fontWeight: 700 }}
              >
                {buyingTokens ? 'Processando compra...' : 'Comprar por R$ 15,00'}
              </button>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              Saldo atual de tokens: <strong>{user?.tokens_balance}</strong>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
