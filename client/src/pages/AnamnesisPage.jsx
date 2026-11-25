import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { FileText, CheckCircle2, AlertCircle, Heart, Activity, ShieldCheck, Save, Sparkles, Scale } from 'lucide-react';

export default function AnamnesisPage() {
  const { user, anamnesisData, refreshUserData, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Estados da Anamnese Profunda
  const [formData, setFormData] = useState({
    idade: 32,
    sexo: 'male',
    peso: 89.5,
    altura: 178,
    circunferencia_cintura: 96,
    circunferencia_quadril: 102,
    nivel_atividade: 'light',
    objetivo: 'lose_weight',
    diabetes: 'prediabetes',
    hipertensao: true,
    dislipidemia: true,
    doenca_cardiaca: false,
    esteatose_hepatica: true,
    outras_patologias: 'Histórico familiar de diabetes tipo 2 e hipertensão',
    alergias_alimentares: 'Amendoim e camarão',
    intolerancia_lactose: true,
    intolerancia_gluten: false,
    medicamentos_uso_continuo: 'Losartana 50mg pela manhã',
    qualidade_sono: 'regular',
    consumo_agua_litros: 2.2,
    nivel_estresse: 'high',
    observacoes_clinicas: 'Paciente relata episódios de compulsão noturna por carboidratos simples.'
  });

  // Preenche dados caso já existam no banco
  useEffect(() => {
    if (anamnesisData?.anamnesis) {
      const a = anamnesisData.anamnesis;
      setFormData({
        idade: a.idade,
        sexo: a.sexo,
        peso: a.peso,
        altura: a.altura,
        circunferencia_cintura: a.circunferencia_cintura || '',
        circunferencia_quadril: a.circunferencia_quadril || '',
        nivel_atividade: a.nivel_atividade || 'moderate',
        objetivo: a.objetivo || 'maintain',
        diabetes: a.diabetes || 'none',
        hipertensao: !!a.hipertensao,
        dislipidemia: !!a.dislipidemia,
        doenca_cardiaca: !!a.doenca_cardiaca,
        esteatose_hepatica: !!a.esteatose_hepatica,
        outras_patologias: a.outras_patologias || '',
        alergias_alimentares: a.alergias_alimentares || '',
        intolerancia_lactose: !!a.intolerancia_lactose,
        intolerancia_gluten: !!a.intolerancia_gluten,
        medicamentos_uso_continuo: a.medicamentos_uso_continuo || '',
        qualidade_sono: a.qualidade_sono || 'regular',
        consumo_agua_litros: a.consumo_agua_litros || 2.0,
        nivel_estresse: a.nivel_estresse || 'moderate',
        observacoes_clinicas: a.observacoes_clinicas || ''
      });
    }
  }, [anamnesisData]);

  // Cálculos em tempo real
  const imc = formData.peso && formData.altura 
    ? (formData.peso / ((formData.altura / 100) * (formData.altura / 100))).toFixed(1)
    : 0;

  const rcq = formData.circunferencia_cintura && formData.circunferencia_quadril
    ? (formData.circunferencia_cintura / formData.circunferencia_quadril).toFixed(2)
    : null;

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!user?.id) {
      showToast('Faça login para salvar sua anamnese.', 'error');
      return;
    }

    setSaving(true);
    try {
      await api.saveAnamnesis({
        ...formData,
        user_id: user.id
      });
      await refreshUserData();
      showToast('Anamnese clínica salva com sucesso no banco relacional!', 'success');
    } catch (err) {
      showToast(err.message || 'Erro ao salvar anamnese', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '940px' }}>
      
      {/* CABEÇALHO */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-emerald" style={{ marginBottom: '0.65rem' }}>
          <ShieldCheck size={16} /> Prontuário Clínico & Avaliação de Riscos
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Anamnese Nutricional Detalhada</h1>
        <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem' }}>
          Coleta abrangente de dados biométricos, riscos metabólicos e comorbidades para casos como <strong>obesidade</strong> e <strong>reeducação alimentar séria</strong>.
        </p>
      </div>

      {/* CARD RESUMO BIOMÉTRICO DINÂMICO */}
      <div style={{
        background: 'linear-gradient(135deg, #ECFDF5 0%, #EFF6FF 100%)',
        border: '1px solid #A7F3D0',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)', fontWeight: 600, display: 'block' }}>IMC Calculado</span>
          <strong style={{ fontSize: '1.8rem', color: 'var(--slate-900)' }}>{imc} <span style={{ fontSize: '0.85rem' }}>kg/m²</span></strong>
          <span style={{ display: 'block', fontSize: '0.78rem', color: imc >= 30 ? '#EF4444' : (imc >= 25 ? '#F59E0B' : '#10B981'), fontWeight: 700 }}>
            {imc >= 30 ? 'Obesidade' : (imc >= 25 ? 'Sobrepeso' : 'Faixa Ideal')}
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)', fontWeight: 600, display: 'block' }}>Relação Cintura/Quadril (RCQ)</span>
          <strong style={{ fontSize: '1.8rem', color: 'var(--slate-900)' }}>{rcq || '--'}</strong>
          <span style={{ display: 'block', fontSize: '0.78rem', color: (formData.sexo === 'male' && rcq >= 0.90) ? '#EF4444' : '#10B981', fontWeight: 700 }}>
            {rcq ? ((formData.sexo === 'male' && rcq >= 0.90) ? 'Risco Cardiovascular Alto' : 'Risco Adequado') : 'Pendente circunferências'}
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)', fontWeight: 600, display: 'block' }}>Quadro Metabólico</span>
          <strong style={{ fontSize: '1.2rem', color: 'var(--slate-900)', display: 'block', marginTop: '6px' }}>
            {formData.diabetes === 'prediabetes' ? 'Pré-Diabetes' : (formData.diabetes !== 'none' ? 'Diabetes' : 'Normoglicêmico')}
          </strong>
          <span style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>
            {formData.hipertensao ? 'Hipertenso • ' : ''}{formData.dislipidemia ? 'Dislipidemia' : ''}
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)', fontWeight: 600, display: 'block' }}>Água Recomendada</span>
          <strong style={{ fontSize: '1.8rem', color: 'var(--slate-900)' }}>
            {((formData.peso * 35) / 1000).toFixed(1)} <span style={{ fontSize: '0.85rem' }}>L/dia</span>
          </strong>
          <span style={{ display: 'block', fontSize: '0.78rem', color: '#047857', fontWeight: 600 }}>35ml/kg corporal</span>
        </div>
      </div>

      {/* STEPPER DE NAVEGAÇÃO DE ETAPAS */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--slate-200)', marginBottom: '2rem', gap: '1rem', overflowX: 'auto' }}>
        {[
          { id: 1, label: '1. Dados Biométricos & Medidas' },
          { id: 2, label: '2. Histórico Clínico & Patologias' },
          { id: 3, label: '3. Alergias, Intolerâncias & Fármacos' },
          { id: 4, label: '4. Hábitos de Vida & Rotina' }
        ].map(step => (
          <button
            key={step.id}
            type="button"
            onClick={() => setCurrentStep(step.id)}
            style={{
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              borderBottom: currentStep === step.id ? '3px solid var(--emerald-500)' : '3px solid transparent',
              fontWeight: currentStep === step.id ? 700 : 500,
              color: currentStep === step.id ? 'var(--emerald-600)' : 'var(--slate-600)',
              cursor: 'pointer',
              fontSize: '0.92rem',
              whiteSpace: 'nowrap'
            }}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* FORMULÁRIO */}
      <form onSubmit={handleSave} className="card" style={{ padding: '2.5rem' }}>
        
        {/* ETAPA 1: BIOMETRIA */}
        {currentStep === 1 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-900)' }}>1. Dados Biométricos e Medidas Antropométricas</h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>Esses dados alimentam os cálculos de TMB, IMC e distribuição de macronutrientes da IA.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Idade (anos)</label>
                <input
                  type="number"
                  value={formData.idade}
                  onChange={e => setFormData({ ...formData, idade: Number(e.target.value) })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Sexo Biológico</label>
                <select
                  value={formData.sexo}
                  onChange={e => setFormData({ ...formData, sexo: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)', background: '#FFFFFF' }}
                >
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Peso Atual (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.peso}
                  onChange={e => setFormData({ ...formData, peso: Number(e.target.value) })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Altura (cm)</label>
                <input
                  type="number"
                  value={formData.altura}
                  onChange={e => setFormData({ ...formData, altura: Number(e.target.value) })}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>
                  Circunferência da Cintura (cm) - <em>Vital para risco de obesidade</em>
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 96.0"
                  value={formData.circunferencia_cintura}
                  onChange={e => setFormData({ ...formData, circunferencia_cintura: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Circunferência do Quadril (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 102.0"
                  value={formData.circunferencia_quadril}
                  onChange={e => setFormData({ ...formData, circunferencia_quadril: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Nível de Atividade Física</label>
                <select
                  value={formData.nivel_atividade}
                  onChange={e => setFormData({ ...formData, nivel_atividade: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)', background: '#FFFFFF' }}
                >
                  <option value="sedentary">Sedentário (Pouco ou nenhum exercício)</option>
                  <option value="light">Levemente Ativo (Exercício 1 a 3 dias/sem)</option>
                  <option value="moderate">Moderadamente Ativo (Exercício 3 a 5 dias/sem)</option>
                  <option value="intense">Muito Ativo (Treinos pesados 6 a 7 dias/sem)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Objetivo Primário</label>
                <select
                  value={formData.objetivo}
                  onChange={e => setFormData({ ...formData, objetivo: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)', background: '#FFFFFF' }}
                >
                  <option value="lose_weight">Perda de Gordura / Controle de Obesidade</option>
                  <option value="maintain">Manutenção e Reeducação Alimentar</option>
                  <option value="gain_muscle">Hipertrofia / Ganho de Massa Magra</option>
                  <option value="clinical_control">Controle Clínico (Diabetes, Colesterol)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 2: HISTÓRICO CLÍNICO E PATOLOGIAS */}
        {currentStep === 2 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-900)' }}>2. Histórico Clínico & Condições Patológicas</h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem' }}>Essas informações são cruciais para que a IA nunca sugira alimentos prejudiciais às suas condições médicas.</p>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Controle de Diabetes / Glicemia</label>
              <select
                value={formData.diabetes}
                onChange={e => setFormData({ ...formData, diabetes: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)', background: '#FFFFFF' }}
              >
                <option value="none">Nenhum histórico de diabetes (Normal)</option>
                <option value="prediabetes">Pré-Diabetes (Glicemia de jejum entre 100-125 mg/dL)</option>
                <option value="type1">Diabetes Tipo 1 (Insulinodependente)</option>
                <option value="type2">Diabetes Tipo 2</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid var(--slate-200)', borderRadius: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.hipertensao}
                  onChange={e => setFormData({ ...formData, hipertensao: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Hipertensão Arterial (Pressão Alta)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid var(--slate-200)', borderRadius: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.dislipidemia}
                  onChange={e => setFormData({ ...formData, dislipidemia: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Dislipidemia (Colesterol ou Triglicerídeos altos)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid var(--slate-200)', borderRadius: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.esteatose_hepatica}
                  onChange={e => setFormData({ ...formData, esteatose_hepatica: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Esteatose Hepática (Gordura no Fígado)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid var(--slate-200)', borderRadius: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.doenca_cardiaca}
                  onChange={e => setFormData({ ...formData, doenca_cardiaca: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Histórico Cardiovascular / Cardiopatias</span>
              </label>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Outras Doenças ou Histórico Familiar Relevante</label>
              <textarea
                rows={3}
                placeholder="Ex: Histórico de hipotireoidismo, ácido úrico elevado, etc."
                value={formData.outras_patologias}
                onChange={e => setFormData({ ...formData, outras_patologias: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
              />
            </div>
          </div>
        )}

        {/* ETAPA 3: ALERGIAS, INTOLERÂNCIAS E MEDICAMENTOS */}
        {currentStep === 3 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-900)' }}>3. Alergias, Intolerâncias e Medicamentos Contínuos</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid var(--slate-200)', borderRadius: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.intolerancia_lactose}
                  onChange={e => setFormData({ ...formData, intolerancia_lactose: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Intolerância à Lactose</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid var(--slate-200)', borderRadius: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.intolerancia_gluten}
                  onChange={e => setFormData({ ...formData, intolerancia_gluten: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Doença Celíaca / Intolerância ao Glúten</span>
              </label>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Alergias Alimentares Declaradas</label>
              <input
                type="text"
                placeholder="Ex: Amendoim, camarão, nozes, corante tartrazina..."
                value={formData.alergias_alimentares}
                onChange={e => setFormData({ ...formData, alergias_alimentares: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Medicamentos em Uso Contínuo</label>
              <input
                type="text"
                placeholder="Ex: Losartana 50mg, Metformina 850mg, Levotiroxina..."
                value={formData.medicamentos_uso_continuo}
                onChange={e => setFormData({ ...formData, medicamentos_uso_continuo: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
              />
            </div>
          </div>
        )}

        {/* ETAPA 4: HÁBITOS & OBSERVAÇÕES */}
        {currentStep === 4 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-900)' }}>4. Hábitos de Vida, Sono e Estresse</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Consumo Hídrico Diário (Litros)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.consumo_agua_litros}
                  onChange={e => setFormData({ ...formData, consumo_agua_litros: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Qualidade do Sono</label>
                <select
                  value={formData.qualidade_sono}
                  onChange={e => setFormData({ ...formData, qualidade_sono: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)', background: '#FFFFFF' }}
                >
                  <option value="poor">Ruim (Insônia / Acorda cansado)</option>
                  <option value="regular">Regular (6 a 7 horas com despertares)</option>
                  <option value="good">Boa (7 a 8 horas reparadoras)</option>
                  <option value="excellent">Excelente (Sono profundo)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Nível de Estresse Diário</label>
                <select
                  value={formData.nivel_estresse}
                  onChange={e => setFormData({ ...formData, nivel_estresse: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)', background: '#FFFFFF' }}
                >
                  <option value="low">Baixo (Tranquilo)</option>
                  <option value="moderate">Moderado (Sob controle)</option>
                  <option value="high">Alto / Crônico (Compulsões)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '6px' }}>Observações e Padrões de Fome/Compulsão</label>
              <textarea
                rows={3}
                placeholder="Ex: Fome emocional no final da tarde, consumo de refrigerantes aos fins de semana, etc."
                value={formData.observacoes_clinicas}
                onChange={e => setFormData({ ...formData, observacoes_clinicas: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
              />
            </div>
          </div>
        )}

        {/* BOTÕES DE NAVEGAÇÃO E SALVAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--slate-200)' }}>
          {currentStep > 1 ? (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Etapa Anterior
            </button>
          ) : <div />}

          <div style={{ display: 'flex', gap: '1rem' }}>
            {currentStep < 4 ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Próxima Etapa
              </button>
            ) : null}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={18} />
              <span>{saving ? 'Gravando no Banco...' : 'Salvar Prontuário Clínico'}</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
