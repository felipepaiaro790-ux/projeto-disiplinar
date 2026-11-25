import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';

// Páginas SPA
import AuthPage from './pages/AuthPage';
import AnamnesisPage from './pages/AnamnesisPage';
import Dashboard from './pages/Dashboard';
import AIChatPage from './pages/AIChatPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import NearbyClinicsPage from './pages/NearbyClinicsPage';
import ClinicsB2BPage from './pages/ClinicsB2BPage';

// Componente de Proteção Estrita de Rotas: Redireciona não autenticados para /login
function ProtectedRoute({ children }) {
  const { user, loadingUser } = useApp();

  if (loadingUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'var(--slate-500)' }}>
        <span>Carregando prontuário seguro...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navegação Global SPA */}
      <Navbar />

      {/* Roteamento Principal SPA */}
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Rotas Públicas de Acesso */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage isRegister={false} />} />
          <Route path="/cadastro" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage isRegister={true} />} />

          {/* Rotas Protegidas - Autenticação Obrigatória */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/anamnese" element={<ProtectedRoute><AnamnesisPage /></ProtectedRoute>} />
          <Route path="/ia-chat" element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} />
          <Route path="/planos" element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>} />
          <Route path="/clinicas-proximas" element={<ProtectedRoute><NearbyClinicsPage /></ProtectedRoute>} />
          
          {/* Portal B2B */}
          <Route path="/clinicas" element={<ClinicsB2BPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </main>

      {/* Rodapé */}
      <footer style={{
        background: 'var(--slate-900)',
        color: 'var(--slate-400)',
        padding: '2.5rem 0',
        borderTop: '1px solid var(--slate-800)',
        fontSize: '0.85rem'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong style={{ color: '#FFFFFF', fontSize: '1rem', display: 'block' }}>NutriTrack Pro</strong>
            <span>Plataforma de Monitoramento Nutricional & Apoio Clínico Inteligente</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p>&copy; {new Date().getFullYear()} NutriTrack Saúde Digital Ltda. Todos os direitos reservados.</p>
            <span style={{ fontSize: '0.78rem', opacity: 0.8 }}>Pautado em diretrizes da ASBRAN e Conselhos de Nutrição Clínica.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
