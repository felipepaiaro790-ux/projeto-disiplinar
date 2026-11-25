import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, Activity, FileText, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Scale, HeartPulse, Building2 } from 'lucide-react';

export default function Home() {
  const { user } = useApp();

  // Mini Calculadora Interativa Rápida
  const [peso, setPeso] = useState(78);
  const [altura, setAltura] = useState(175);
  const [idade, setIdade] = useState(28);
  const [genero, setGenero] = useState('male');

  const imc = (peso / ((altura / 100) * (altura / 100))).toFixed(1);
  let statusImc = 'Peso Adequado';
  let corBadge = 'var(--emerald-500)';

  if (imc < 18.5) { statusImc = 'Abaixo do peso'; corBadge = '#3B82F6'; }
  else if (imc >= 25 && imc < 30) { statusImc = 'Sobrepeso (Atenção)'; corBadge = '#F59E0B'; }
  else if (imc >= 30) { statusImc = 'Obesidade (Risco Clínico)'; corBadge = '#EF4444'; }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      
      {/* HERO SECTION */}
      <section style={{
        padding: '4.5rem 0 3.5rem 0',
        background: 'linear-gradient(180deg, rgba(236, 253, 245, 0.6) 0%, rgba(248, 250, 252, 0) 100%)'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center' }}>
          
          <div>
            <div className="badge badge-emerald" style={{ marginBottom: '1.25rem' }}>
              <ShieldCheck size={16} />
              Pautado em Evidências Clínicas & Nutrição Baseada em Dados
            </div>

            <h1 style={{ fontSize: '3rem', letterSpacing: '-0.03em', marginBottom: '1.25rem', color: 'var(--slate-900)' }}>
              Acompanhamento nutricional sério para atingir sua <span style={{
                background: 'linear-gradient(135deg, #10B981 0%, #0D9488 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>melhor saúde</span>.
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--slate-600)', marginBottom: '2rem', maxWidth: '560px' }}>
              Muito além de calorias: o <strong>NutriTrack Pro</strong> integra <strong>Anamnese Clínica Profunda</strong>, 
              análise de <strong>Exames Laboratoriais</strong> e uma <strong>IA Especializada em Nutrição</strong> 
              para reeducação alimentar, controle de obesidade e suporte clínico.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/anamnese" className="btn btn-primary" style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}>
                <span>Preencher Anamnese Clínica</span>
                <ArrowRight size={18} />
              </Link>

              <Link to="/ia-chat" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                <Sparkles size={18} />
                <span>Testar NutriIA</span>
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '2.5rem' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--slate-900)' }}>100%</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>Focado em Saúde Real</span>
              </div>
              <div style={{ width: '1px', height: '32px', background: 'var(--slate-200)' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--slate-900)' }}>Exames</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>Glicemia, Lipídios e Mais</span>
              </div>
              <div style={{ width: '1px', height: '32px', background: 'var(--slate-200)' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '1.4rem', color: 'var(--slate-900)' }}>B2B & B2C</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>Pacientes e Clínicas</span>
              </div>
            </div>
          </div>

          {/* CARD INTERATIVO RÁPIDO */}
          <div className="card" style={{ padding: '2rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'var(--emerald-50)', padding: '10px', borderRadius: '12px' }}>
                  <HeartPulse size={24} color="#10B981" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>Simulação Antropométrica</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>Amostra de avaliação imediata</span>
                </div>
              </div>
              <span className="badge" style={{ backgroundColor: corBadge + '18', color: corBadge, border: `1px solid ${corBadge}40` }}>
                {statusImc}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
                  Peso Atual (kg)
                </label>
                <input
                  type="number"
                  value={peso}
                  onChange={e => setPeso(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--slate-200)', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
                  Altura (cm)
                </label>
                <input
                  type="number"
                  value={altura}
                  onChange={e => setAltura(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--slate-200)', fontSize: '1rem' }}
                />
              </div>
            </div>

            {/* Display de Resultado */}
            <div style={{ background: 'var(--bg-subtle)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--slate-600)' }}>Índice de Massa Corporal (IMC)</span>
                <strong style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--slate-900)' }}>
                  {imc} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--slate-600)' }}>kg/m²</span>
                </strong>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                *No NutriTrack, o IMC é apenas a porta de entrada. Conectamos circunferência abdominal, exames laboratoriais e histórico de saúde para uma análise verdadeira.
              </p>
            </div>

            <Link to="/anamnese" className="btn btn-primary" style={{ width: '100%', borderRadius: '12px' }}>
              Avançar para Anamnese Completa & Exames
            </Link>
          </div>

        </div>
      </section>

      {/* DIFERENCIAIS CLÍNICOS */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>Inovação Tecnológica em Saúde</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Por que a abordagem do NutriTrack é superior?</h2>
            <p style={{ color: 'var(--slate-600)' }}>Projetado com base nas recomendações da banca avaliadora para garantir rigor científico e sustentabilidade.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.75rem' }}>
            
            <div className="card">
              <div style={{ background: 'var(--emerald-50)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <FileText size={24} color="#10B981" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Anamnese Clínica & Obesidade</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                Coleta dados biométricos aprofundados (circunferências, RCQ), histórico patológico (diabetes, hipertensão, esteatose hepática), alergias e intolerâncias.
              </p>
            </div>

            <div className="card">
              <div style={{ background: 'var(--blue-50)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Activity size={24} color="#3B82F6" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Exames Laboratoriais Integrados</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                Permite registro de marcadores essenciais (glicemia de jejum, hemoglobina glicada HbA1c, colesterol, triglicerídeos e vitaminas) para orientações precisas.
              </p>
            </div>

            <div className="card">
              <div style={{ background: 'var(--amber-50)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Sparkles size={24} color="#F59E0B" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>IA Especializada & Sistema de Tokens</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                Fim de respostas genéricas. A NutriIA cruza todo o prontuário do paciente, operando com consumo de tokens controlado e integrado aos planos de assinatura.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* BANNER B2B PARA CLÍNICAS */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            padding: '3rem',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '2.5rem',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                <Building2 size={16} /> Módulo Exclusivo para Profissionais & Clínicas
              </div>
              <h2 style={{ color: '#FFFFFF', fontSize: '2.2rem', marginBottom: '1rem' }}>
                Potencialize os resultados dos seus pacientes com o NutriTrack B2B
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '1.05rem', marginBottom: '1.75rem' }}>
                Sua clínica conta com painel exclusivo para monitoramento do consumo de IA pelos pacientes, 
                padronização de protocolos de obesidade e suporte contínuo entre as consultas presenciais.
              </p>
              <Link to="/clinicas" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
                Conhecer Soluções para Clínicas & Parcerias
              </Link>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h4 style={{ color: '#F8FAFC', marginBottom: '1rem' }}>Benefícios Clínicos Corporativos:</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0', fontSize: '0.92rem' }}>
                  <CheckCircle2 size={18} color="#10B981" /> Redução de evasão de pacientes em 40%
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0', fontSize: '0.92rem' }}>
                  <CheckCircle2 size={18} color="#10B981" /> Gestão multi-nutricionistas e prontuários
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0', fontSize: '0.92rem' }}>
                  <CheckCircle2 size={18} color="#10B981" /> Pacotes corporativos de tokens com desconto
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0', fontSize: '0.92rem' }}>
                  <CheckCircle2 size={18} color="#10B981" /> Relatórios de evolução clínica exportáveis
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
