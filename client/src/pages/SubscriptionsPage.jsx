import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, Sparkles, Crown, ShieldCheck, Bell, 
  ArrowRight, Gift, Lock, Zap, MapPin 
} from 'lucide-react';

export default function SubscriptionsPage() {
  const { user, refreshUserData, showToast } = useApp();

  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('plan_plus'); // Default no recomendado
  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      try {
        setLoading(true);
        const data = await api.getPlans();
        setPlans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || {
    id: 'plan_plus',
    nome: 'Premium Plus',
    preco_mensal: 200.00,
    tokens_mensais: 1000,
    descricao: 'Acesso completo com 1.000 tokens, Clínicas Próximas e +3 tokens bônus na loja.'
  };

  const handleConfirmSubscription = async () => {
    if (!user?.id) {
      showToast('Faça login para assinar um plano.', 'error');
      return;
    }

    setActivating(true);
    try {
      const res = await api.subscribePlan(user.id, selectedPlan.id);
      await refreshUserData();
      showToast(`Parabéns! Você assinou o ${selectedPlan.nome} com sucesso!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActivating(false);
    }
  };

  const isCurrentPlanActive = user?.plano_id === selectedPlan.id;

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '1080px' }}>
      
      {/* TÍTULO INSPIRADO NO CANVA PRO */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.02em', color: 'var(--slate-900)', marginBottom: '0.6rem' }}>
          Escolha seu plano NutriTrack Pro
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '1rem', color: 'var(--slate-600)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#10B981" />
            <span>Desbloqueie IA Nutricional clínica, anamnese completa e acompanhamento contínuo.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#10B981" />
            <span>Cancele ou altere de plano a qualquer momento sem taxas ocultas.</span>
          </div>
        </div>
      </div>

      {/* LAYOUT EM DUAS COLUNAS ESTILO CHECKOUT DO CANVA */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        
        {/* COLUNA DA ESQUERDA: CARDS SELECIONÁVEIS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--slate-700)' }}>
            Selecione uma opção de assinatura:
          </span>

          {/* CARD 1: PREMIUM PADRÃO (R$ 50,00/mês) */}
          <div
            onClick={() => setSelectedPlanId('plan_padrao')}
            style={{
              border: selectedPlanId === 'plan_padrao' ? '2.5px solid #8B5CF6' : '1.5px solid var(--slate-200)',
              borderRadius: '16px',
              padding: '1.5rem',
              background: selectedPlanId === 'plan_padrao' ? '#FAF5FF' : '#FFFFFF',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: selectedPlanId === 'plan_padrao' ? '0 8px 24px -4px rgba(139, 92, 246, 0.15)' : 'var(--shadow-sm)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--slate-900)', marginBottom: '4px' }}>
                  Premium Padrão
                </h3>
                <strong style={{ fontSize: '1.4rem', color: '#6D28D9', fontFamily: 'var(--font-heading)' }}>
                  R$ 100,00<span style={{ fontSize: '0.85rem', color: 'var(--slate-600)', fontWeight: 500 }}>/mês</span>
                </strong>
              </div>

              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: selectedPlanId === 'plan_padrao' ? '6px solid #8B5CF6' : '2px solid var(--slate-300)',
                background: '#FFFFFF',
                marginTop: '4px'
              }} />
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
              Acesso à IA Nutricional especializada para reeducação diária.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--slate-700)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#8B5CF6" />
                <span>Desbloqueia o <strong>Chat com a IA Nutricional</strong></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#8B5CF6" />
                <span>Concede <strong>100 tokens diários</strong> (1 token por mensagem)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#8B5CF6" />
                <span>Acesso à Loja de Tokens (10 tokens por R$ 15,00)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-400)' }}>
                <Lock size={15} />
                <span>Clínicas Próximas: <em>Indisponível neste plano</em></span>
              </li>
            </ul>
          </div>

          {/* CARD 2: PREMIUM PLUS (R$ 100,00/mês - RECOMENDADO) */}
          <div
            onClick={() => setSelectedPlanId('plan_plus')}
            style={{
              border: selectedPlanId === 'plan_plus' ? '2.5px solid #10B981' : '1.5px solid var(--slate-200)',
              borderRadius: '16px',
              padding: '1.5rem',
              background: selectedPlanId === 'plan_plus' ? '#ECFDF5' : '#FFFFFF',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: selectedPlanId === 'plan_plus' ? '0 12px 30px -4px rgba(16, 185, 129, 0.2)' : 'var(--shadow-sm)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Tag Recomendado */}
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '20px',
              background: '#EF4444',
              color: '#FFFFFF',
              padding: '3px 12px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Recomendado
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', marginTop: '4px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--slate-900)', marginBottom: '4px' }}>
                    Premium Plus
                  </h3>
                  <Crown size={18} color="#F59E0B" />
                </div>
                <strong style={{ fontSize: '1.4rem', color: '#047857', fontFamily: 'var(--font-heading)' }}>
                  R$ 200,00<span style={{ fontSize: '0.85rem', color: 'var(--slate-600)', fontWeight: 500 }}>/mês</span>
                </strong>
              </div>

              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: selectedPlanId === 'plan_plus' ? '6px solid #10B981' : '2px solid var(--slate-300)',
                background: '#FFFFFF',
                marginTop: '4px'
              }} />
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
              Experiência médica completa: mais tokens, clínicas parceiras e bônus exclusivo na loja.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--slate-700)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span>Desbloqueia o <strong>Chat com nossa IA Nutricional</strong></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span>Concede <strong>1.000 tokens</strong> de uso imediato</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span>🌟 <strong>Desbloqueia a página de Clínicas Próximas & Contato Direto</strong></span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontWeight: 600 }}>
                <Gift size={16} color="#F59E0B" />
                <span>🎁 <strong>Bônus na Loja de Tokens:</strong> Ganhe <strong>+3 tokens extras</strong> a cada compra (13 tokens por R$ 15,00)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* COLUNA DA DIREITA: LINHA DO TEMPO & CONFIRMAÇÃO (ESTILO CANVA) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* CARD DA LINHA DO TEMPO */}
          <div className="card" style={{ padding: '1.75rem', background: '#FFFFFF', borderRadius: '18px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              
              {/* Linha vertical conectora */}
              <div style={{
                position: 'absolute',
                left: '18px',
                top: '20px',
                bottom: '20px',
                width: '2px',
                background: 'var(--slate-200)',
                zIndex: 0
              }} />

              {/* Evento 1: Hoje */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#10B981',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Gift size={20} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--slate-900)', display: 'block' }}>Hoje</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: 0 }}>
                    Acesso imediato ao <strong>{selectedPlan.nome}</strong>. Seus tokens são creditados no ato.
                  </p>
                </div>
              </div>

              {/* Evento 2: Notificação prévia */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '2px solid var(--slate-300)',
                  color: 'var(--slate-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bell size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--slate-900)', display: 'block' }}>Daqui a 25 dias</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: 0 }}>
                    Enviaremos um lembrete transparente antes da renovação mensal do seu ciclo.
                  </p>
                </div>
              </div>

              {/* Evento 3: Renovação */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '2px solid #FCD34D',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Crown size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '0.98rem', color: 'var(--slate-900)', display: 'block' }}>Daqui a 30 dias</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: 0 }}>
                    Seu plano será renovado com recarga automática de novos créditos, a menos que você cancele.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* CARD DE TOTAL & BOTÃO PRINCIPAL DE CONFIRMAÇÃO */}
          <div className="card" style={{ padding: '1.75rem', background: '#FFFFFF', borderRadius: '18px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)', display: 'block' }}>Plano Selecionado</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>{selectedPlan.nome}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)', display: 'block' }}>A pagar hoje</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--slate-900)', fontFamily: 'var(--font-heading)' }}>
                  R$ {selectedPlan.preco_mensal?.toFixed(2).replace('.', ',')}
                </strong>
              </div>
            </div>

            <button
              onClick={handleConfirmSubscription}
              disabled={activating}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: selectedPlan.id === 'plan_plus' 
                  ? 'linear-gradient(135deg, #10B981 0%, #0D9488 100%)' 
                  : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px -3px rgba(0,0,0,0.15)',
                transition: 'all 0.2s'
              }}
            >
              {activating ? 'Ativando Assinatura...' : (
                isCurrentPlanActive ? 'Plano Já Ativo (Clique para Renovar)' : 'Confirmar e Ativar Assinatura'
              )}
              <ArrowRight size={18} />
            </button>

            <p style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textAlign: 'center', marginTop: '12px', lineHeight: 1.4 }}>
              Ambiente de demonstração imediata: o plano é ativado diretamente no banco de dados e desbloqueia a IA e Clínicas instantaneamente.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
