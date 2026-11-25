import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import NutriTrackLogo from '../components/NutriTrackLogo';
import { Lock, Mail, User, Phone, CheckCircle2 } from 'lucide-react';

export default function AuthPage({ isRegister = false }) {
  const { login, register } = useApp();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('felipe@nutritrack.com');
  const [senha, setSenha] = useState('senha123');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({ nome, email, senha, telefone });
        navigate('/anamnese');
      } else {
        await login(email, senha);
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div className="card animate-fade-in" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <NutriTrackLogo size={42} />
          <h2 style={{ fontSize: '1.6rem', marginTop: '1rem', marginBottom: '0.4rem' }}>
            {isRegister ? 'Criar Prontuário NutriTrack' : 'Acesse seu Prontuário'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)' }}>
            {isRegister 
              ? 'Inicie seu acompanhamento clínico com IA especializada e exames.'
              : 'Entre com seus dados para acessar histórico, tokens e anamnese.'}
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'var(--red-50)',
            border: '1px solid #FECACA',
            color: '#B91C1C',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
                Nome Completo
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                <input
                  type="text"
                  placeholder="Ex: Carlos Silva"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid var(--slate-200)', fontSize: '0.95rem' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
              E-mail
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid var(--slate-200)', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
                Telefone / WhatsApp (Opcional)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                <input
                  type="text"
                  placeholder="(11) 98765-4321"
                  value={telefone}
                  onChange={e => setTelefone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid var(--slate-200)', fontSize: '0.95rem' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', display: 'block', marginBottom: '4px' }}>
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid var(--slate-200)', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '11px', marginTop: '0.5rem', borderRadius: '8px' }}
          >
            {loading ? 'Processando...' : (isRegister ? 'Criar Prontuário & Começar' : 'Entrar no Sistema')}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          {isRegister ? (
            <span>Já possui prontuário? <Link to="/login" style={{ color: 'var(--emerald-600)', fontWeight: 600 }}>Faça Login</Link></span>
          ) : (
            <span>Ainda não tem conta? <Link to="/cadastro" style={{ color: 'var(--emerald-600)', fontWeight: 600 }}>Cadastre-se grátis</Link></span>
          )}
        </div>

        {/* Dica para a banca avaliadora */}
        <div style={{ marginTop: '1.5rem', padding: '10px', background: 'var(--bg-subtle)', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--slate-600)' }}>
          💡 <strong>Acesso Rápido para a Banca:</strong> Clique diretamente em <em>"Entrar no Sistema"</em> para logar com o paciente de teste pré-configurado (Felipe Rosa).
        </div>

      </div>
    </div>
  );
}
