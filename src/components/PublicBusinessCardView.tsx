"use client";

import React, { useState } from "react";
import Link from "next/link";

interface CardData {
  slug: string;
  full_name: string;
  job_title: string;
  company_name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  linkedin: string;
  instagram: string;
  logo_base64: string;
  qr_destination: string;
  map_url: string;
  template_id: string;
  custom_accent: string;
}

const TEMPLATE_PRESETS = [
  { id: "classic", name: "Classic Corporate", bg: "#1e293b", text: "#f8fafc", accent: "#f59e0b", font: "serif" },
  { id: "modern", name: "Modern Creator", bg: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", text: "#ffffff", accent: "#f472b6", font: "sans-serif" },
  { id: "elegant", name: "Elegant Luxury", bg: "#fafaf9", text: "#1c1917", accent: "#78350f", font: "serif" },
  { id: "minimalist", name: "Minimalist Light", bg: "#f8fafc", text: "#0f172a", accent: "#3b82f6", font: "sans-serif" },
  { id: "neon", name: "Neon Vibe", bg: "#09090b", text: "#f4f4f5", accent: "#06b6d4", font: "monospace" },
];

export function PublicBusinessCardView({ card }: { card: CardData }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const currentTemplate = TEMPLATE_PRESETS.find(t => t.id === card.template_id) || TEMPLATE_PRESETS[0];
  const accentColor = card.custom_accent || currentTemplate.accent;

  const qrDataValue = card.qr_destination === "website" ? card.website : card.map_url;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrDataValue.startsWith("http") ? qrDataValue : "https://" + qrDataValue)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center", width: "100%", padding: "2rem 0" }}>
      
      <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>
        🔄 Click the card below to flip and view the QR Code
      </span>

      {/* 3D Flip Card */}
      <div
        className={`flip-card-container ${isFlipped ? "is-flipped" : ""}`}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ width: "100%", maxWidth: "480px" }}
      >
        <div className="flip-card-inner">
          
          {/* CARD FRONT */}
          <div
            className="flip-card-front"
            style={{
              backgroundColor: currentTemplate.bg.startsWith("linear") ? undefined : currentTemplate.bg,
              backgroundImage: currentTemplate.bg.startsWith("linear") ? currentTemplate.bg : undefined,
              border: card.template_id === "minimalist" ? "1px solid #e2e8f0" : card.template_id === "neon" ? `2px solid ${accentColor}` : card.template_id === "classic" ? `1px solid ${accentColor}` : "none",
              color: currentTemplate.text,
              fontFamily: currentTemplate.font === "serif" ? "Georgia, serif" : currentTemplate.font === "monospace" ? "Courier New, monospace" : "system-ui, sans-serif"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800 }}>{card.full_name}</h3>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {card.job_title}
                  </span>
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, opacity: 0.9 }}>
                  {card.company_name}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.68rem", opacity: 0.9, borderTop: card.template_id === "minimalist" ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.1)", paddingTop: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div>📞 {card.phone}</div>
                <div>📧 {card.email}</div>
                <div>🌐 {card.website}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div>📍 {card.address}</div>
                {card.linkedin && <div>🔗 LinkedIn: {card.linkedin}</div>}
                {card.instagram && <div>📸 Instagram: {card.instagram}</div>}
              </div>
            </div>
          </div>

          {/* CARD BACK */}
          <div
            className="flip-card-back"
            style={{
              backgroundColor: currentTemplate.bg.startsWith("linear") ? undefined : currentTemplate.bg,
              backgroundImage: currentTemplate.bg.startsWith("linear") ? currentTemplate.bg : undefined,
              border: card.template_id === "minimalist" ? "1px solid #e2e8f0" : card.template_id === "neon" ? `2px solid ${accentColor}` : card.template_id === "classic" ? `1px solid ${accentColor}` : "none",
              color: currentTemplate.text,
              fontFamily: currentTemplate.font === "serif" ? "Georgia, serif" : currentTemplate.font === "monospace" ? "Courier New, monospace" : "system-ui, sans-serif",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem"
            }}
          >
            {/* Left of Back: Logo / Brand */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", flex: 1, textAlign: "center" }}>
              {card.logo_base64 ? (
                <img 
                  src={card.logo_base64} 
                  alt="Logo" 
                  style={{ width: "70px", height: "70px", borderRadius: "0.5rem", objectFit: "cover", border: "1px solid rgba(255,255,255,0.2)" }} 
                />
              ) : (
                <div style={{ width: "70px", height: "70px", borderRadius: "0.5rem", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                  🏢
                </div>
              )}
              <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>{card.company_name}</h4>
            </div>

            {/* Right of Back: QR Code */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flex: 1 }}>
              <div style={{ background: "white", padding: "0.5rem", borderRadius: "0.75rem", display: "flex" }}>
                <img 
                  src={qrImageUrl} 
                  alt="Business QR" 
                  style={{ width: "100px", height: "100px", display: "block" }} 
                />
              </div>
              <span style={{ fontSize: "0.55rem", opacity: 0.8, textAlign: "center" }}>
                Scan to visit {card.qr_destination === "website" ? "website" : "location"}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "480px" }}>
        <Link href="/tools/digital-business-card" style={{ width: "100%" }}>
          <button
            style={{
              width: "100%",
              background: "white",
              color: "#2563eb",
              border: "1px solid #2563eb",
              padding: "0.85rem",
              borderRadius: "0.75rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            ✨ Create Your Own Free Card
          </button>
        </Link>
      </div>
    </div>
  );
}
