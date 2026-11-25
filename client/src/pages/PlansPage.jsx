import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, Sparkles, CheckCircle2, ShieldCheck, Zap, 
  Coins, History, ShoppingBag, ArrowRight 
} from 'lucide-react';

export default function PlansPage() {
  const { user, refreshUserData, showToast } = useApp();

  const [plans, setPlans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState(null);
  const [buyingPack, setBuyingPack] = useState(null);

  const fetchPlansAndTransactions = async () => {
    try {
      setLoading(true);
      const plansData = await api.getPlans();
      setPlans(plansData);

      if (user?.id) {
        const transData = await api.getTokenTransactions(user.id);
        setTransactions(transData.transactions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlansAndTransactions();
  }, [user?.id]);

  const handleSubscribe = async (planId) => {
    if (!user?.id) {
      showToast('Faça login para assinar um plano.', 'error');
      return;
    }

    setSubscribingId(planId);
    try {
      const res = await api.subscribePlan(user.id, planId);
      await refreshUserData();
      await fetchPlansAndTransactions();
      showToast(res.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubscribingId(null);
    }
  };

  const handleBuyTokens = async (packageType) => {
    if (!user?.id) {
      showToast('Faça login para comprar tokens.', 'error');
      return;
    }

    setBuyingPack(packageType);
    try {
      const res = await api.rechargeTokens(user.id, packageType);
      await refreshUserData();
      await fetchPlansAndTransactions();
      showToast(res.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBuyingPack(null);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3.5rem 1.5rem', maxWidth: '1100px' }}>
      
      {/* CABEÇALHO */}
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem auto' }}>
        <div className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
          <Coins size={16} /> Economia de Tokens & Planos Sustentáveis
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Planos Transparentes & Créditos de IA</h1>
        <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem' }}>
          Estrutura de precificação viável que cobre custos operacionais de IA, prontuários clínicos e equipe de nutrição.
        </p>
      </div>

      {/* GRID DE PLANOS MENSAIS DO BANCO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem', marginBottom: '4rem' }}>
        {plans.map(plan => {
          const isCurrent = user?.plano_id === plan.id;

          return (
            <div
              key={plan.id}
              className="card"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                border: plan.destaque ? '2px solid var(--emerald-500)' : '1px solid var(--slate-200)',
                transform: plan.destaque ? 'scale(1.03)' : 'none',
                boxShadow: plan.destaque ? 'var(--shadow-emerald)' : 'var(--shadow-md)',
                background: '#FFFFFF'
              }}
            >
              {plan.destaque === 1 && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--emerald-500)',
                  color: '#FFFFFF',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  Mais Recomendado
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>{plan.nome}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', minHeight: '40px' }}>{plan.descricao}</p>
              </div>

              {/* Preço */}
              <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-200)', paddingBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--slate-400)' }}>R$</span>
                <strong style={{ fontSize: '2.5rem', color: 'var(--slate-900)', fontFamily: 'var(--font-heading)' }}>
                  {plan.preco_mensal.toFixed(2).replace('.', ',')}
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}> /mês</span>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '8px',
                  background: 'var(--emerald-50)',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  color: '#047857',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}>
                  <Sparkles size={16} />
                  <span>{plan.tokens_mensais.toLocaleString('pt-BR')} Tokens de IA /mês</span>
                </div>
              </div>

              {/* Lista de Recursos */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, marginBottom: '2rem' }}>
                {plan.recursos.map((rec, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: 'var(--slate-700)' }}>
                    <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribingId === plan.id || isCurrent}
                className={isCurrent ? 'btn btn-secondary' : (plan.destaque ? 'btn btn-primary' : 'btn btn-outline')}
                style={{ width: '100%', borderRadius: '10px', padding: '11px' }}
              >
                {isCurrent ? 'Plano Atual Ativo' : (subscribingId === plan.id ? 'Ativando...' : 'Assinar Plano')}
              </button>
            </div>
          );
        })}
      </div>

      {/* COMPRA AVULSA DE PACOTES DE TOKENS */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '3.5rem', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>Precisa de mais créditos de IA?</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)' }}>
              Compre pacotes avulsos de tokens sem necessidade de mudar de plano. Os tokens nunca expiram.
            </p>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '8px 16px', borderRadius: '9999px', fontSize: '0.88rem', fontWeight: 700 }}>
            Seu saldo atual: <span style={{ color: 'var(--emerald-600)' }}>{user?.tokens_balance?.toLocaleString('pt-BR')} Tokens</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          
          <div style={{ border: '1px solid var(--slate-200)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-400)' }}>PACOTE RÁPIDO</span>
            <strong style={{ display: 'block', fontSize: '1.8rem', margin: '6px 0', color: 'var(--slate-900)' }}>500 Tokens</strong>
            <span style={{ fontSize: '1.1rem', color: 'var(--emerald-600)', fontWeight: 700, display: 'block', marginBottom: '12px' }}>R$ 9,90</span>
            <button
              onClick={() => handleBuyTokens('pack_500')}
              disabled={buyingPack === 'pack_500'}
              className="btn btn-outline"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              {buyingPack === 'pack_500' ? 'Processando...' : 'Comprar 500'}
            </button>
          </div>

          <div style={{ border: '2px solid var(--emerald-500)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', background: 'var(--emerald-50)' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#047857' }}>MAIS POPULAR</span>
            <strong style={{ display: 'block', fontSize: '1.8rem', margin: '6px 0', color: '#047857' }}>1.500 Tokens</strong>
            <span style={{ fontSize: '1.1rem', color: 'var(--emerald-700)', fontWeight: 700, display: 'block', marginBottom: '12px' }}>R$ 19,90</span>
            <button
              onClick={() => handleBuyTokens('pack_1500')}
              disabled={buyingPack === 'pack_1500'}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              {buyingPack === 'pack_1500' ? 'Processando...' : 'Comprar 1.500'}
            </button>
          </div>

          <div style={{ border: '1px solid var(--slate-200)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-400)' }}>PACOTE TURBO</span>
            <strong style={{ display: 'block', fontSize: '1.8rem', margin: '6px 0', color: 'var(--slate-900)' }}>4.000 Tokens</strong>
            <span style={{ fontSize: '1.1rem', color: 'var(--emerald-600)', fontWeight: 700, display: 'block', marginBottom: '12px' }}>R$ 39,90</span>
            <button
              onClick={() => handleBuyTokens('pack_4000')}
              disabled={buyingPack === 'pack_4000'}
              className="btn btn-outline"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              {buyingPack === 'pack_4000' ? 'Processando...' : 'Comprar 4.000'}
            </button>
          </div>

        </div>
      </div>

      {/* EXTRATO DE TRANSAÇÕES DE TOKENS DO BANCO */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <History size={20} color="var(--slate-600)" />
          <h3 style={{ fontSize: '1.25rem' }}>Extrato de Uso & Recargas de Tokens</h3>
        </div>

        {transactions.length === 0 ? (
          <p style={{ color: 'var(--slate-400)', fontSize: '0.88rem' }}>Nenhuma movimentação de tokens registrada ainda.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {transactions.map(t => (
              <div key={t.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'var(--bg-subtle)',
                fontSize: '0.88rem'
              }}>
                <div>
                  <strong style={{ color: 'var(--slate-900)', display: 'block' }}>{t.descricao}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                    {new Date(t.created_at).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <strong style={{
                    color: t.quantidade > 0 ? '#10B981' : '#EF4444',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {t.quantidade > 0 ? `+${t.quantidade}` : t.quantidade} Tokens
                  </strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                    Saldo pós: {t.saldo_apos.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
