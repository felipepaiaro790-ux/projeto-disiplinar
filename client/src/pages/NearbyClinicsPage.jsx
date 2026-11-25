import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  MapPin, Phone, Clock, Star, MessageSquare, Send, 
  AlertTriangle, Lock, Crown, ArrowRight, X, ShieldAlert, CheckCircle2 
} from 'lucide-react';
import { formatMessageTime } from '../components/ChatUtils';

export default function NearbyClinicsPage() {
  const { user, showToast } = useApp();

  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorBlocked, setErrorBlocked] = useState(false);

  // Estado do Chat da Clínica Selecionada
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const messagesEndRef = useRef(null);

  const isPremiumPlus = user?.plano_id === 'plan_plus';

  useEffect(() => {
    async function loadClinics() {
      if (!user?.id) return;
      if (!isPremiumPlus) {
        setErrorBlocked(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await api.getClinics(user.id);
        setClinics(data);
        setErrorBlocked(false);
      } catch (err) {
        if (err.data?.code === 'PREMIUM_PLUS_REQUIRED') {
          setErrorBlocked(true);
        } else {
          showToast(err.message, 'error');
        }
      } finally {
        setLoading(false);
      }
    }

    loadClinics();
  }, [user?.id, user?.plano_id]);

  // Carrega histórico exclusivo da clínica selecionada
  const handleOpenClinicChat = async (clinic) => {
    setSelectedClinic(clinic);
    try {
      const res = await api.getClinicMessages(clinic.id, user.id);
      setChatMessages(res.messages || []);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSendMessageToClinic = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !user?.id || !selectedClinic || sendingMsg) return;

    const currentMsg = inputText.trim();
    setInputText('');
    setSendingMsg(true);

    // Otimista: adiciona na tela imediatamente
    const tempMsg = {
      id: 'temp_c_' + Date.now(),
      remetente: 'user',
      conteudo: currentMsg,
      created_at: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, tempMsg]);

    try {
      const res = await api.sendClinicMessage(selectedClinic.id, user.id, currentMsg);
      // Substitui pela mensagem gravada no banco
      setChatMessages(prev => [...prev.filter(m => m.id !== tempMsg.id), res.clinic_message]);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSendingMsg(false);
    }
  };

  // CASO 1: BLOQUEIO ELEGANTE SE NÃO FOR PREMIUM PLUS
  if (errorBlocked || !isPremiumPlus) {
    return (
      <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '780px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3.5rem 2.5rem', background: '#FFFFFF', borderRadius: '24px' }}>
          
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Crown size={36} color="#D97706" />
          </div>

          <span className="badge badge-amber" style={{ marginBottom: '1rem', padding: '6px 14px' }}>
            🔒 Recurso Exclusivo do Plano Premium Plus
          </span>

          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: 'var(--slate-900)' }}>
            Acesso a Clínicas Próximas & Contato Direto
          </h2>

          <p style={{ fontSize: '1.05rem', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '620px', margin: '0 auto 2rem auto' }}>
            A lista geolocalizada de clínicas especializadas em nutrição e o canal direto de mensagem com consultórios parceiros é um benefício exclusivo dos assinantes do <strong>Plano Premium Plus (R$ 200,00/mês)</strong>.
          </p>

          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'left',
            maxWidth: '520px',
            margin: '0 auto 2.5rem auto'
          }}>
            <strong style={{ fontSize: '0.92rem', color: 'var(--slate-900)', display: 'block', marginBottom: '0.75rem' }}>
              Ao fazer upgrade para o Premium Plus você desbloqueia:
            </strong>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--slate-700)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Contato direto e chat exclusivo com clínicas de nutrição</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span><strong>1.000 tokens</strong> de IA para orientações detalhadas</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span><strong>+3 tokens de bônus</strong> em cada compra na Loja de Tokens (13 tokens por R$ 15,00)</span>
              </li>
            </ul>
          </div>

          <Link to="/planos" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: '12px' }}>
            <span>Fazer Upgrade para Premium Plus</span>
            <ArrowRight size={18} />
          </Link>

        </div>
      </div>
    );
  }

  // CASO 2: PREMIUM PLUS LIBERADO - LISTAGEM DE CLÍNICAS PRÓXIMAS
  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '1100px' }}>
      
      {/* CABEÇALHO */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-emerald" style={{ marginBottom: '0.65rem' }}>
          <Crown size={15} color="#F59E0B" /> Acesso Premium Plus Liberado
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
          Clínicas de Nutrição Próximas a Você
        </h1>
        <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem' }}>
          Encontre centros de atendimento nutricional credenciados e inicie contato direto pelo chat integrado.
        </p>
      </div>

      {/* GRID DE CARDS DAS CLÍNICAS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {clinics.map(clinic => (
          <div key={clinic.id} className="card" style={{ padding: '1.75rem', background: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'var(--emerald-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem'
                  }}>
                    {clinic.avatar_url || '🏥'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '2px' }}>
                      {clinic.nome}
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: 'var(--emerald-700)', fontWeight: 600 }}>
                      {clinic.especialidade}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF3C7', padding: '3px 8px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#B45309' }}>
                  <Star size={14} fill="#F59E0B" color="#F59E0B" />
                  <span>{clinic.nota}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--slate-600)', margin: '1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} color="var(--slate-400)" />
                  <span>{clinic.endereco} • <strong>{clinic.distancia_km} km de você</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={15} color="var(--slate-400)" />
                  <span>{clinic.telefone}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} color="var(--slate-400)" />
                  <span>{clinic.atendimento}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenClinicChat(clinic)}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <MessageSquare size={16} />
              <span>Abrir Chat com a Clínica</span>
            </button>

          </div>
        ))}
      </div>

      {/* MODAL DO CHAT EXCLUSIVO E INDEPENDENTE DA CLÍNICA */}
      {selectedClinic && (
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
          <div className="card animate-fade-in" style={{
            maxWidth: '640px',
            width: '100%',
            height: '620px',
            padding: 0,
            background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            
            {/* CABEÇALHO DO CHAT DA CLÍNICA */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--slate-200)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#FFFFFF',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.8rem' }}>{selectedClinic.avatar_url || '🏥'}</span>
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{selectedClinic.nome}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                    Canal direto • Histórico exclusivo desta clínica
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedClinic(null)}
                style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* SELO OBRIGATÓRIO: INDISPONÍVEL NO MOMENTO PARA CONTATO */}
            <div style={{
              background: '#FEF2F2',
              borderBottom: '1px solid #FECACA',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#B91C1C',
              fontSize: '0.85rem',
              fontWeight: 600,
              flexShrink: 0
            }}>
              <AlertTriangle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
              <span>
                Indisponível no momento para contato. Você pode registrar mensagens, mas o atendente presencial responderá apenas em horário comercial.
              </span>
            </div>

            {/* CORPO DE MENSAGENS ISOLADAS NO BANCO */}
            <div style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              background: 'var(--bg-primary)'
            }}>
              {chatMessages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--slate-400)' }}>
                  <MessageSquare size={36} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.9rem' }}>Nenhuma mensagem enviada para esta clínica ainda.</p>
                  <span style={{ fontSize: '0.8rem' }}>Envie suas dúvidas sobre agendamento e triagem presencial.</span>
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.remetente === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%'
                    }}
                  >
                    <div style={{
                      background: msg.remetente === 'user' ? 'linear-gradient(135deg, #10B981 0%, #0D9488 100%)' : '#FFFFFF',
                      color: msg.remetente === 'user' ? '#FFFFFF' : 'var(--slate-900)',
                      padding: '12px 16px',
                      borderRadius: msg.remetente === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      fontSize: '0.92rem',
                      boxShadow: 'var(--shadow-sm)',
                      border: msg.remetente === 'user' ? 'none' : '1px solid var(--slate-200)',
                      whiteSpace: 'pre-line'
                    }}>
                      {msg.conteudo}

                      <div style={{
                        fontSize: '0.7rem',
                        marginTop: '4px',
                        textAlign: 'right',
                        opacity: 0.75
                      }}>
                        {formatMessageTime(msg.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* FORMULÁRIO DE ENVIO */}
            <form onSubmit={handleSendMessageToClinic} style={{
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
                placeholder="Escreva sua mensagem para a clínica..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={sendingMsg}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '9999px',
                  border: '1px solid var(--slate-200)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  background: '#FFFFFF',
                  color: 'var(--slate-900)'
                }}
              />

              <button
                type="submit"
                disabled={sendingMsg || !inputText.trim()}
                className="btn btn-primary"
                style={{ width: '44px', height: '44px', borderRadius: '50%', padding: 0, flexShrink: 0 }}
              >
                <Send size={16} />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
