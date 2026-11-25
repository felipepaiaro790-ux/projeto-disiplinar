import React from 'react';

export function formatMessageTime(dateString) {
  if (!dateString) return '';
  try {
    let date;
    if (typeof dateString === 'string') {
      const normalized = dateString.replace(' ', 'T');
      date = new Date(normalized.endsWith('Z') || normalized.includes('+') ? normalized : normalized + 'Z');
      if (isNaN(date.getTime())) {
        date = new Date(dateString.replace(/-/g, '/'));
      }
    } else {
      date = new Date(dateString);
    }
    if (isNaN(date.getTime())) {
      return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}

export function MarkdownRenderer({ content, color = 'inherit' }) {
  if (!content) return null;
  const lines = content.split('\n');
  return (
    <div style={{ color, lineHeight: 1.6, wordBreak: 'break-word' }}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} style={{ height: '0.6rem' }} />;
        }
        const renderFormattedText = (text) => {
          const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
          return parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={pIdx} style={{ fontStyle: 'italic', opacity: 0.9 }}>{part.slice(1, -1)}</em>;
            }
            return part;
          });
        };
        const isNumberedList = /^\d+\.\s/.test(trimmed);
        const isBulletList = /^[-•*]\s/.test(trimmed);
        if (isNumberedList || isBulletList) {
          return (
            <div
              key={lineIdx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                marginTop: '4px',
                marginBottom: '4px',
                paddingLeft: '4px'
              }}
            >
              <span style={{ fontWeight: 700, opacity: 0.85, flexShrink: 0 }}>
                {isNumberedList ? trimmed.match(/^\d+\./)[0] : '•'}
              </span>
              <div style={{ flex: 1 }}>
                {renderFormattedText(trimmed.replace(/^(\d+\.|[-•*])\s*/, ''))}
              </div>
            </div>
          );
        }
        return (
          <p key={lineIdx} style={{ margin: '0 0 6px 0' }}>
            {renderFormattedText(line)}
          </p>
        );
      })}
    </div>
  );
}
