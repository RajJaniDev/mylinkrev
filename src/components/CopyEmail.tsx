"use client";

import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      title="Copy email to clipboard"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
        padding: '0.25rem 0.75rem', borderRadius: '1rem', marginTop: '0.5rem',
        color: 'var(--foreground)', fontSize: '0.875rem', cursor: 'pointer',
        transition: 'background 0.2s', margin: '0.5rem auto 0 auto'
      }}
    >
      ✉️ {email}
      {copied ? (
        <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold' }}>Copied!</span>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      )}
    </button>
  );
}
