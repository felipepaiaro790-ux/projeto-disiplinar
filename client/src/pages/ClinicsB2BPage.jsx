import React, { useState } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { 
  Building2, CheckCircle2, Users, ShieldCheck, TrendingUp, 
  BarChart3, Headphones, ArrowRight, Sparkles 
} from 'lucide-react';

export default function ClinicsB2BPage() {
  const { showToast } = useApp();

  const [nomeClinica, setNomeClinica] = useState('');
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('São Paulo');
  const [estado, setEstado] = useState('SP');
  const [qtdNutricionistas, setQtdNutricionistas] = useState('4 a 10');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitB2BLead({
        nome_clinica: nomeClinica,
        nome_responsavel: nomeResponsavel,
        email,
        telefone,
        cidade,
        estado,
        qtd_nutricionistas: qtdNutricionistas,
        mensagem
      });

      setEnviado(true);
      showToast('Proposta comercial enviada com sucesso! Entraremos em contato.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      
      {/* HERO SECTION B2B */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '5rem 0 4rem 0'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center' }}>
          
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34D399',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.5rem'
            }}>
              <Building2 size={16} /> NutriTrack Enterprise & Parcerias Clínicas
            </div>

            <h1 style={{ fontSize: '3rem', color: '#FFFFFF', letterSpacing: '-0.03em', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              A tecnologia de IA nutricional que sua <span style={{
                background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>clínica precisa</span> para fidelizar pacientes.
            </h1>

            <p style={{ fontSize: '1.1rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '560px' }}>
              Integre sua equipe de nutricionistas ao ecossistema NutriTrack. Monitore a evolução metabólica, 
              o consumo diário de IA e aumente o engajamento de pacientes com sobrepeso e patologias crônicas.
            </p>

            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <strong style={{ fontSize: '2rem', color: '#FFFFFF', display: 'block' }}>+300%</strong>
                <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Adesão ao plano alimentar</span>
              </div>
              <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <strong style={{ fontSize: '2rem', color: '#FFFFFF', display: 'block' }}>LGPD</strong>
                <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Prontuários Criptografados</span>
              </div>
              <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <strong style={{ fontSize: '2rem', color: '#FFFFFF', display: 'block' }}>B2B Token</strong>
                <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Pacotes de IA com desconto</span>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO DE PROPOSTA B2B */}
          <div className="card" style={{ padding: '2.5rem', background: '#FFFFFF', color: 'var(--slate-900)' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Agende uma Demonstração B2B</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
              Descubra como integrar o NutriTrack aos prontuários e nutricionistas da sua clínica.
            </p>

            {enviado ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Solicitação Recebida com Sucesso!</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
                  Nosso consultor executivo de saúde digital entrará em contato via WhatsApp e e-mail com a apresentação comercial personalizada.
                </p>
                <button onClick={() => setEnviado(false)} className="btn btn-outline">
                  Enviar Outra Solicitação
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nome da Clínica ou Consultório</label>
                  <input
                    type="text"
                    placeholder="Ex: Clínica Bem Estar Integrado"
                    value={nomeClinica}
                    onChange={e => setNomeClinica(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nome do Responsável</label>
                    <input
                      type="text"
                      placeholder="Dr(a). Responsável"
                      value={nomeResponsavel}
                      onChange={e => setNomeResponsavel(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Telefone / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="(11) 98765-4321"
                      value={telefone}
                      onChange={e => setTelefone(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>E-mail Profissional</label>
                  <input
                    type="email"
                    placeholder="contato@clinica.com.br"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nº de Nutricionistas</label>
                    <select
                      value={qtdNutricionistas}
                      onChange={e => setQtdNutricionistas(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-200)', background: '#FFF' }}
                    >
                      <option value="1 a 3">1 a 3 nutricionistas</option>
                      <option value="4 a 10">4 a 10 nutricionistas</option>
                      <option value="10+">Mais de 10 nutricionistas</option>
                      <option value="rede">Rede Hospitalar / Franquia</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Estado (UF)</label>
                    <input
                      type="text"
                      value={estado}
                      onChange={e => setEstado(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Mensagem ou Necessidade Específica</label>
                  <textarea
                    rows={2}
                    placeholder="Conte-nos sobre a demanda dos seus pacientes..."
                    value={mensagem}
                    onChange={e => setMensagem(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', marginTop: '0.5rem' }}
                >
                  {loading ? 'Transmitindo dados...' : 'Solicitar Demonstração Comercial'}
                </button>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* DIFERENCIAIS CORPORATIVOS */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>Ecossistema B2B</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Soluções Feitas para Ambientes Médicos</h2>
            <p style={{ color: 'var(--slate-600)' }}>
              Como o NutriTrack transforma a relação entre o nutricionista e o paciente entre as consultas.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem' }}>
            
            <div className="card">
              <div style={{ background: 'var(--emerald-50)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Users size={24} color="#10B981" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Acompanhamento Inter-Consultas</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                O maior motivo de abandono da dieta ocorre entre as consultas de 30 dias. A NutriIA atua como uma extensão do seu nutricionista, mantendo o paciente no plano.
              </p>
            </div>

            <div className="card">
              <div style={{ background: 'var(--blue-50)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <BarChart3 size={24} color="#3B82F6" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Painel de Gestão da Clínica</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                Acompanhe o engajamento dos seus nutricionistas, volume de consultas IA consumidas e métricas médias de perda ponderal da clínica.
              </p>
            </div>

            <div className="card">
              <div style={{ background: 'var(--amber-50)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} color="#F59E0B" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Padronização de Protocolos</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                Parametrize a conduta da IA de acordo com os protocolos específicos da sua clínica para pacientes bariátricos, diabéticos ou esportivos.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
