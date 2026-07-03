"use client";

import React, { useState } from "react";

interface ContactSectionProps {
  phone?: string;
  whatsapp?: string;
  email?: string;
}

export function ContactSection({ phone, whatsapp, email }: ContactSectionProps) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopy = (text: string, type: "phone" | "email") => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === "phone") {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      alignItems: "center",
      width: "100%",
      marginTop: "0.25rem",
      marginBottom: "0.25rem"
    }}>
      
      {/* Phone & WhatsApp Row */}
      {(phone || whatsapp) && (
        <div style={{
          display: "flex",
          gap: "0.65rem",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          width: "100%"
        }}>
          {phone && (
            <button
              onClick={() => handleCopy(phone, "phone")}
              title="Copy phone number"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--secondary)",
                border: "1px solid var(--border)",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                color: "var(--foreground)",
                fontSize: "0.85rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                height: "38px"
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "var(--border)"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "var(--secondary)"; }}
            >
              {copiedPhone ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span style={{ color: "#10b981", fontWeight: 600 }}>Copied!</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>{phone}</span>
                </>
              )}
            </button>
          )}

          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "color-mix(in srgb, #25D366 10%, transparent)",
                border: "1px solid color-mix(in srgb, #25D366 25%, transparent)",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                color: "#25D366",
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                height: "38px"
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "color-mix(in srgb, #25D366 18%, transparent)"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "color-mix(in srgb, #25D366 10%, transparent)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      )}

      {/* Email Row */}
      {email && (
        <button
          onClick={() => handleCopy(email, "email")}
          title="Copy email address"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--secondary)",
            border: "1px solid var(--border)",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            color: "var(--foreground)",
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            height: "38px",
            maxWidth: "100%"
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "var(--border)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "var(--secondary)"; }}
        >
          {copiedEmail ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span style={{ color: "#10b981", fontWeight: 600 }}>Copied!</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</span>
            </>
          )}
        </button>
      )}

    </div>
  );
}
