import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import NutriTrackLogo from './NutriTrackLogo';
import { useApp } from '../context/AppContext';
import { Sparkles, Activity, FileText, Building2, CreditCard, LogOut, MapPin, Crown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useApp();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Se não estiver logado, exibe apenas a barra superior limpa
  if (!user) {
    return (
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--slate-200)',
        padding: '0.85rem 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/login">
            <NutriTrackLogo size={36} />
          </Link>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" className="btn btn-outline" style={{ fontSize: '0.88rem', padding: '6px 16px' }}>Entrar</Link>
            <Link to="/cadastro" className="btn btn-primary" style={{ fontSize: '0.88rem', padding: '6px 16px' }}>Cadastrar-se</Link>
          </div>
        </div>
      </header>
    );
  }

  const isPremiumPlus = user?.plano_id === 'plan_plus';
  const hasPlan = !!user?.plano_id;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--slate-200)',
      padding: '0.85rem 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo Link */}
        <Link to="/dashboard">
          <NutriTrackLogo size={36} />
        </Link>

        {/* Links de Navegação Principal */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: isActive('/dashboard') ? 700 : 500,
              color: isActive('/dashboard') ? 'var(--emerald-600)' : 'var(--slate-600)',
              fontSize: '0.9rem'
            }}
          >
            <Activity size={17} />
            Dashboard
          </Link>

          <Link
            to="/anamnese"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: isActive('/anamnese') ? 700 : 500,
              color: isActive('/anamnese') ? 'var(--emerald-600)' : 'var(--slate-600)',
              fontSize: '0.9rem'
            }}
          >
            <FileText size={17} />
            Anamnese
          </Link>

          {/* Chat com a IA */}
          <Link
            to="/ia-chat"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: isActive('/ia-chat') ? 700 : 500,
              color: isActive('/ia-chat') ? 'var(--emerald-600)' : 'var(--slate-600)',
              fontSize: '0.9rem'
            }}
          >
            <Sparkles size={17} color="#0D9488" />
            NutriIA
            {!hasPlan && (
              <span style={{ fontSize: '0.65rem', background: '#F1F5F9', color: '#64748B', padding: '1px 6px', borderRadius: '4px' }}>
                Bloqueado
              </span>
            )}
          </Link>

          {/* Clínicas Próximas (Exclusivo Premium Plus) */}
          <Link
            to="/clinicas-proximas"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: isActive('/clinicas-proximas') ? 700 : 500,
              color: isActive('/clinicas-proximas') ? 'var(--emerald-600)' : 'var(--slate-600)',
              fontSize: '0.9rem'
            }}
          >
            <MapPin size={17} color={isPremiumPlus ? '#10B981' : '#94A3B8'} />
            Clínicas Próximas
            {isPremiumPlus ? (
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                Plus
              </span>
            ) : (
              <span style={{ fontSize: '0.65rem', background: '#FEF3C7', color: '#B45309', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                🔒 Plus
              </span>
            )}
          </Link>

          {/* Aba de Assinaturas (Estilo Canva) */}
          <Link
            to="/planos"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: isActive('/planos') ? 700 : 600,
              color: isActive('/planos') ? '#7C3AED' : '#6D28D9',
              fontSize: '0.9rem',
              background: '#F5F3FF',
              padding: '5px 12px',
              borderRadius: '9999px',
              border: '1px solid #DDD6FE'
            }}
          >
            <Crown size={16} color="#7C3AED" />
            Assinaturas
          </Link>

          <Link
            to="/clinicas"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: isActive('/clinicas') ? 700 : 500,
              color: 'var(--slate-500)',
              fontSize: '0.88rem'
            }}
          >
            <Building2 size={15} />
            B2B
          </Link>
        </nav>

        {/* Saldo de Tokens e Perfil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* Badge de Tokens de IA */}
          <Link to="/ia-chat" title="Acessar IA e Loja de Tokens">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--emerald-50)',
              border: '1px solid var(--emerald-100)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer'
            }}>
              <Sparkles size={14} color="#10B981" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857' }}>
                {user?.tokens_balance?.toLocaleString('pt-BR')} <span style={{ fontWeight: 500, fontSize: '0.8em' }}>tokens</span>
              </span>
            </div>
          </Link>

          {/* Nome e Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)' }}>
              {user?.nome?.split(' ')[0]}
            </span>
            <button
              onClick={logout}
              className="btn btn-outline"
              style={{ padding: '6px 8px', borderRadius: 'var(--radius-full)' }}
              title="Sair da conta"
            >
              <LogOut size={15} />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
