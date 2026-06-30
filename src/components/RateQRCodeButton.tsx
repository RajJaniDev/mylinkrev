"use client";

import { useState, useEffect } from "react";

export function RateQRCodeButton({ slug }: { slug: string }) {
  const [showQR, setShowQR] = useState(false);
  const [rateUrl, setRateUrl] = useState(`https://myrevlink.com/b/${slug}/rate`);

  useEffect(() => {
    // If we're on localhost, use localhost URL for easier testing, otherwise use the production URL
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      setRateUrl(`http://localhost:3000/b/${slug}/rate`);
    } else if (typeof window !== 'undefined') {
      setRateUrl(`${window.location.origin}/b/${slug}/rate`);
    }
  }, [slug]);

  if (!showQR) {
    return (
      <div style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-start' }}>
        <button 
          onClick={() => setShowQR(true)}
          style={{
            background: 'none', border: 'none', color: 'var(--primary)',
            fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'none',
            fontWeight: 500, transition: 'color 0.2s', padding: '0.5rem 0',
            display: 'flex', alignItems: 'center', gap: '0.25rem'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-hover)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--primary)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <rect x="7" y="7" width="3" height="3"></rect>
            <rect x="14" y="7" width="3" height="3"></rect>
            <rect x="7" y="14" width="3" height="3"></rect>
            <rect x="14" y="14" width="3" height="3"></rect>
          </svg>
          Get Rate Us QR Code
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(59, 130, 246, 0.05)', padding: '1.5rem', borderRadius: '1rem',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
      border: '1px solid rgba(59, 130, 246, 0.2)', width: '100%', marginTop: '1rem',
      position: 'relative', maxWidth: '300px'
    }}>
      <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Rate Us QR Code</h3>
      <p style={{ margin: 0, color: 'var(--secondary-foreground)', fontSize: '0.875rem', textAlign: 'center' }}>
        Customers can scan this to instantly start the rating flow.
      </p>
      
      <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(rateUrl)}`} 
          alt="Rate Us QR Code" 
          style={{ width: '150px', height: '150px', display: 'block' }} 
        />
      </div>
      
      <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
        <button 
          onClick={() => window.print()}
          style={{
            flex: 1, background: 'var(--primary)', color: 'white', border: 'none',
            padding: '0.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem',
            cursor: 'pointer', transition: 'background 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'var(--primary)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print
        </button>
        <button 
          onClick={() => setShowQR(false)}
          style={{
            flex: 1, background: 'var(--secondary)', color: 'var(--secondary-foreground)', border: '1px solid var(--border)',
            padding: '0.5rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem',
            cursor: 'pointer', transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--border)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'var(--secondary)'}
        >
          Minimize
        </button>
      </div>
    </div>
  );
}
