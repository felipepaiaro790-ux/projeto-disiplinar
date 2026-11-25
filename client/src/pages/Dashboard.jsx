import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { 
  Activity, FileText, Sparkles, Plus, Trash2, Upload, AlertCircle, 
  CheckCircle2, TrendingUp, Calendar, Heart, ShieldAlert 
} from 'lucide-react';

export default function Dashboard() {
  const { user, anamnesisData, examsList, refreshUserData, showToast } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  // Formulário para registrar novo exame laboratorial
  const [tipoExame, setTipoExame] = useState('perfil_metabolico');
  const [dataExame, setDataExame] = useState(new Date().toISOString().split('T')[0]);
  const [glicemia, setGlicemia] = useState('105');
  const [hba1c, setHba1c] = useState('5.8');
  const [colesterolTotal, setColesterolTotal] = useState('205');
  const [ldl, setLdl] = useState('130');
  const [triglicerideos, setTriglicerideos] = useState('165');
  const [laudoResumo, setLaudoResumo] = useState('');

  const anam = anamnesisData?.anamnesis;
  const metricas = anamnesisData?.metricas;

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoadingAdd(true);
    try {
      await api.createLabExam({
        user_id: user.id,
        tipo_exame: tipoExame,
        data_exame: dataExame,
        valores: {
          glicemia_jejum: Number(glicemia),
          hba1c: Number(hba1c),
          colesterol_total: Number(colesterolTotal),
          ldl: Number(ldl),
          triglicerideos: Number(triglicerideos)
        },
        laudo_resumo: laudoResumo || 'Exame de rotina metabólica inserido pelo paciente.',
        arquivo_url: 'laudo_upload_manual.pdf'
      });

      await refreshUserData();
      showToast('Exame laboratorial registrado com sucesso!', 'success');
      setModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleDeleteExam = async (id) => {
    if (!confirm('Deseja realmente remover este registro de exame?')) return;
    try {
      await api.deleteLabExam(id);
      await refreshUserData();
      showToast('Exame removido com sucesso.', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.5rem', maxWidth: '1100px' }}>
      
      {/* CABEÇALHO DO DASHBOARD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
            Prontuário Ativo do Paciente
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Olá, {user?.nome?.split(' ')[0] || 'Paciente'} 👋</h1>
          <p style={{ color: 'var(--slate-600)' }}>
            Visão clínica integrada: antropometria, exames laboratoriais e consumo de inteligência artificial.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setModalOpen(true)} className="btn btn-secondary">
            <Plus size={18} />
            <span>Inserir Exame</span>
          </button>

          <Link to="/ia-chat" className="btn btn-primary">
            <Sparkles size={18} />
            <span>Consultar NutriIA</span>
          </Link>
        </div>
      </div>

      {/* CARDS DE STATUS RÁPIDO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>IMC Atual</span>
            <Activity size={18} color="#10B981" />
          </div>
          <strong style={{ fontSize: '1.8rem', display: 'block', margin: '4px 0', color: 'var(--slate-900)' }}>
            {metricas?.imc || '--'} <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>kg/m²</span>
          </strong>
          <span className="badge" style={{
            background: (metricas?.imc >= 30 ? 'var(--red-50)' : (metricas?.imc >= 25 ? 'var(--amber-50)' : 'var(--emerald-50)')),
            color: (metricas?.imc >= 30 ? '#B91C1C' : (metricas?.imc >= 25 ? '#B45309' : '#047857'))
          }}>
            {metricas?.classificacaoImc || 'Pendente Anamnese'}
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>Risco Cintura/Quadril (RCQ)</span>
            <Heart size={18} color="#EF4444" />
          </div>
          <strong style={{ fontSize: '1.8rem', display: 'block', margin: '4px 0', color: 'var(--slate-900)' }}>
            {metricas?.rcq || '--'}
          </strong>
          <span className="badge" style={{
            background: metricas?.riscoRCQ === 'Elevado' ? 'var(--red-50)' : 'var(--emerald-50)',
            color: metricas?.riscoRCQ === 'Elevado' ? '#B91C1C' : '#047857'
          }}>
            {metricas?.riscoRCQ ? `Risco ${metricas.riscoRCQ}` : 'Sem dados'}
          </span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>Tokens de NutriIA</span>
            <Sparkles size={18} color="#0D9488" />
          </div>
          <strong style={{ fontSize: '1.8rem', display: 'block', margin: '4px 0', color: 'var(--teal-700)' }}>
            {user?.tokens_balance?.toLocaleString('pt-BR') || 0}
          </strong>
          <Link to="/planos" style={{ fontSize: '0.78rem', color: 'var(--emerald-600)', fontWeight: 600 }}>
            {user?.plano_nome || 'Plano Vital'} • Recarregar
          </Link>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)', fontSize: '0.82rem', fontWeight: 600 }}>
            <span>Laudos Laboratoriais</span>
            <FileText size={18} color="#3B82F6" />
          </div>
          <strong style={{ fontSize: '1.8rem', display: 'block', margin: '4px 0', color: 'var(--slate-900)' }}>
            {examsList?.length || 0}
          </strong>
          <span style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>
            {examsList?.length > 0 ? 'Último exame integrado' : 'Nenhum exame inserido'}
          </span>
        </div>

      </div>

      {/* SEÇÃO PRINCIPAL: TABELA DE EXAMES & QUADRO CLÍNICO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '1.75rem' }}>
        
        {/* TABELA DE EXAMES LABORATORIAIS */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem' }}>Exames Laboratoriais Registrados</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                Marcadores que embasam a IA clínica e evitam condutas alimentares perigosas.
              </p>
            </div>
            <button onClick={() => setModalOpen(true)} className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
              + Novo Exame
            </button>
          </div>

          {examsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--bg-subtle)', borderRadius: '12px' }}>
              <FileText size={36} color="var(--slate-400)" style={{ margin: '0 auto 10px auto' }} />
              <p style={{ color: 'var(--slate-600)', fontSize: '0.92rem' }}>Nenhum exame laboratorial registrado ainda.</p>
              <button onClick={() => setModalOpen(true)} className="btn btn-secondary" style={{ marginTop: '12px' }}>
                Registrar Primeiro Exame
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {examsList.map(exam => (
                <div key={exam.id} style={{
                  border: '1px solid var(--slate-200)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  background: '#FFFFFF'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="var(--slate-400)" />
                      <strong style={{ fontSize: '0.92rem', color: 'var(--slate-900)' }}>
                        {exam.tipo_exame.replace(/_/g, ' ').toUpperCase()}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>({exam.data_exame})</span>
                    </div>

                    <button
                      onClick={() => handleDeleteExam(exam.id)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                      title="Excluir exame"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Marcadores em Pílulas */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    {Object.entries(exam.valores || {}).map(([key, val]) => (
                      <span key={key} style={{
                        background: 'var(--bg-subtle)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--slate-700)'
                      }}>
                        {key.replace(/_/g, ' ').toUpperCase()}: <strong>{val}</strong>
                      </span>
                    ))}
                  </div>

                  {exam.laudo_resumo && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', fontStyle: 'italic', borderLeft: '2px solid var(--emerald-500)', paddingLeft: '8px', marginTop: '6px' }}>
                      {exam.laudo_resumo}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RESUMO DA ANAMNESE CLÍNICA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Resumo Clínico</h3>
              <Link to="/anamnese" style={{ fontSize: '0.82rem', color: 'var(--emerald-600)', fontWeight: 600 }}>
                Editar
              </Link>
            </div>

            {anam ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--slate-600)', display: 'block' }}>Glicemia / Diabetes:</span>
                  <strong>{anam.diabetes === 'none' ? 'Normal (Sem diabetes)' : (anam.diabetes === 'prediabetes' ? '⚠️ Pré-Diabetes' : anam.diabetes)}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--slate-600)', display: 'block' }}>Comorbidades Ativas:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {anam.hipertensao ? <span className="badge badge-amber">Hipertensão</span> : null}
                    {anam.dislipidemia ? <span className="badge badge-amber">Dislipidemia</span> : null}
                    {anam.esteatose_hepatica ? <span className="badge badge-amber">Gordura Hepática</span> : null}
                    {!anam.hipertensao && !anam.dislipidemia && !anam.esteatose_hepatica ? <span>Nenhuma relatada</span> : null}
                  </div>
                </div>

                <div>
                  <span style={{ color: 'var(--slate-600)', display: 'block' }}>Alergias / Intolerâncias:</span>
                  <strong>
                    {anam.intolerancia_lactose ? 'Intolerante a Lactose • ' : ''}
                    {anam.alergias_alimentares || 'Nenhuma alergia grave declarada'}
                  </strong>
                </div>

                <div>
                  <span style={{ color: 'var(--slate-600)', display: 'block' }}>Medicamentos:</span>
                  <strong style={{ color: 'var(--slate-700)' }}>{anam.medicamentos_uso_continuo || 'Nenhum medicamento'}</strong>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginBottom: '12px' }}>Anamnese clínica ainda não preenchida.</p>
                <Link to="/anamnese" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>Preencher Agora</Link>
              </div>
            )}
          </div>

          {/* DICA DE CONSULTA COM A IA */}
          <div style={{ background: 'var(--emerald-50)', border: '1px solid var(--emerald-100)', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={18} color="#10B981" />
              <strong style={{ fontSize: '0.92rem', color: '#047857' }}>NutriIA Pronta para Cruzamento</strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#065F46', lineHeight: 1.5 }}>
              A IA já está carregada com seus <strong>{examsList.length} exames</strong> e parâmetros de sobrepeso/obesidade. Acesse o chat para tirar dúvidas de substituição de alimentos.
            </p>
          </div>

        </div>

      </div>

      {/* MODAL PARA INSERIR EXAME LABORATORIAL */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Registrar Exame Laboratorial</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
              Insira os principais marcadores do seu laudo de sangue para que a IA oriente sua alimentação com segurança.
            </p>

            <form onSubmit={handleCreateExam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tipo de Painel</label>
                  <select
                    value={tipoExame}
                    onChange={e => setTipoExame(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--slate-200)', background: '#FFF' }}
                  >
                    <option value="perfil_metabolico">Painel Glicídico & Metabólico</option>
                    <option value="perfil_lipidico">Perfil Lipídico Completo</option>
                    <option value="vitaminas_minerais">Vitaminas & Micronutrientes</option>
                    <option value="funcao_hepatica_renal">Função Hepática e Renal</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Data da Coleta</label>
                  <input
                    type="date"
                    value={dataExame}
                    onChange={e => setDataExame(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                  />
                </div>
              </div>

              {/* Grid de Marcadores Comuns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', background: 'var(--bg-subtle)', padding: '1rem', borderRadius: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block' }}>Glicemia (mg/dL)</label>
                  <input type="number" value={glicemia} onChange={e => setGlicemia(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--slate-200)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block' }}>HbA1c Glicada (%)</label>
                  <input type="number" step="0.1" value={hba1c} onChange={e => setHba1c(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--slate-200)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block' }}>Colesterol (mg/dL)</label>
                  <input type="number" value={colesterolTotal} onChange={e => setColesterolTotal(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--slate-200)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block' }}>LDL (mg/dL)</label>
                  <input type="number" value={ldl} onChange={e => setLdl(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--slate-200)' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block' }}>Triglicerídeos (mg/dL)</label>
                  <input type="number" value={triglicerideos} onChange={e => setTriglicerideos(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--slate-200)' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Observações do Laudo Médico / Resumo</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Leve resistência à insulina, indicado diminuir açúcares simples."
                  value={laudoResumo}
                  onChange={e => setLaudoResumo(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" disabled={loadingAdd} className="btn btn-primary">
                  {loadingAdd ? 'Salvando...' : 'Salvar no Prontuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
