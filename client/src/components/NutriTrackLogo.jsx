import React from 'react';

export default function NutriTrackLogo({ size = 36, showText = true, lightMode = true }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
      {/* Símbolo Vetorial SVG de Alta Fidelidade: Folha Orgânica + Onda Biométrica + Escudo Clínico */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 4px 10px rgba(13, 148, 136, 0.25))' }}
      >
        <defs>
          <linearGradient id="nutriGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#A7F3D0" />
          </linearGradient>
        </defs>

        {/* Círculo base orgânico estilizado */}
        <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#nutriGrad)" />
        
        {/* Folha Estilizada (Nutrição & Saúde) */}
        <path
          d="M24 10C24 10 35 14 35 25C35 31 29 36 22 36C15 36 12 30 12 25C12 17 24 10 24 10Z"
          fill="#FFFFFF"
          fillOpacity="0.2"
        />

        {/* Nervura central / Eixo de crescimento */}
        <path
          d="M24 11C24 11 25 24 17 32"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Linha de Pulso / Monitoramento Clínico (Ciência & Dados) */}
        <path
          d="M10 26H18L21 20L25 31L28 24L31 27H38"
          stroke="url(#pulseGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Ponto de Precisão / Tecnologia */}
        <circle cx="38" cy="27" r="2.5" fill="#34D399" />
      </svg>

      {showText && (
        <span style={{
          fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: size * 0.58,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: lightMode ? '#0F172A' : '#FFFFFF',
          lineHeight: 1
        }}>
          Nutri<span style={{
            background: 'linear-gradient(135deg, #10B981 0%, #0D9488 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Track</span>
          <span style={{
            fontSize: '0.55em',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginLeft: '6px',
            padding: '2px 6px',
            borderRadius: '9999px',
            backgroundColor: '#ECFDF5',
            color: '#047857',
            border: '1px solid #A7F3D0',
            verticalAlign: 'middle'
          }}>
            PRO
          </span>
        </span>
      )}
    </div>
  );
}
