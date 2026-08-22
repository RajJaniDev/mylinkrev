"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { PREDEFINED_TEMPLATES } from "./QRPosterCustomizer";

interface QRPosterSectionProps {
  business: {
    slug: string;
    name: string;
    google_review_url?: string | null;
  };
  socials: {
    profile_photo?: string | null;
    qr_customization?: any;
  };
}

export function QRPosterSection({ business, socials }: QRPosterSectionProps) {
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const reviewUrl = business.google_review_url || `https://myrevlink.in/b/${business.slug}/rate`;
  const savedConfig = socials.qr_customization || {};

  const templateId = savedConfig.templateId || "google_arch";
  const selectedTemplate = PREDEFINED_TEMPLATES.find(t => t.id === templateId) || PREDEFINED_TEMPLATES[0];

  const headline = savedConfig.headline || "Scan to Rate Us on Google";
  const subheadline = savedConfig.subheadline || "Scan this code to leave us a 5-star review & help our business grow!";
  const accentColor = savedConfig.accentColor || "#1a73e8";

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(reviewUrl)}`;

  // Quick PNG Image Download handler
  const handleDownloadPNG = () => {
    const canvas = hiddenCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1500;
    const H = 2000;
    canvas.width = W;
    canvas.height = H;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = qrImageUrl;

    qrImg.onload = () => {
      // Draw poster canvas
      ctx.fillStyle = "#ea4335"; ctx.fillRect(0, 0, 375, 140);
      ctx.fillStyle = "#fbbc05"; ctx.fillRect(375, 0, 375, 140);
      ctx.fillStyle = "#34a853"; ctx.fillRect(750, 0, 375, 140);
      ctx.fillStyle = "#4285f4"; ctx.fillRect(1125, 0, 375, 140);

      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(750, 140, 110, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#4285f4"; ctx.font = "900 100px sans-serif"; ctx.textAlign = "center"; ctx.fillText("G", 750, 175);
      ctx.fillStyle = "#fbbc05"; ctx.font = "60px sans-serif"; ctx.fillText("★ ★ ★ ★ ★", 750, 310);

      ctx.fillStyle = "#0f172a"; ctx.font = "800 68px sans-serif"; ctx.fillText(headline.toUpperCase(), 750, 420);

      // Business Box
      ctx.fillStyle = "#f8fafc"; ctx.fillRect(250, 480, 1000, 130);
      ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 4; ctx.strokeRect(250, 480, 1000, 130);
      ctx.fillStyle = accentColor; ctx.font = "800 58px sans-serif"; ctx.fillText(business.name, 750, 565);

      // QR Code
      ctx.fillStyle = "#ffffff"; ctx.fillRect(425, 660, 650, 650);
      ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 4; ctx.strokeRect(425, 660, 650, 650);
      ctx.drawImage(qrImg, 475, 710, 550, 550);

      ctx.fillStyle = "#475569"; ctx.font = "500 36px sans-serif"; ctx.fillText(subheadline, 750, 1420);
      ctx.fillStyle = "#64748b"; ctx.font = "700 32px sans-serif"; ctx.fillText("powered by myrevlink.in", 750, 1880);

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = `${business.name.toLowerCase().replace(/\s+/g, "-")}-review-qr.png`;
      a.href = dataUrl;
      a.click();
    };
  };

  return (
    <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      
      <canvas ref={hiddenCanvasRef} style={{ display: "none" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "var(--foreground)" }}>
            Printable Review QR Poster
          </h3>
          <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
            Currently active design: <strong>{selectedTemplate.name}</strong>
          </p>
        </div>

        <Link
          href="/dashboard/qr"
          style={{
            textDecoration: "none",
            background: "linear-gradient(90deg, var(--primary), var(--accent))",
            color: "white",
            padding: "0.6rem 1.25rem",
            borderRadius: "var(--radius-md)",
            fontWeight: 700,
            fontSize: "0.875rem",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          Customize & Manage Review QR
        </Link>
      </div>

      {/* Single Default Selected Poster Card Preview */}
      <div style={{
        background: "white",
        border: "1px solid var(--border)",
        borderRadius: "1.25rem",
        padding: "1.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "2rem",
        flexWrap: "wrap",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)"
      }}>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flex: 1, minWidth: "280px" }}>
          {/* Printable poster preview box */}
          <div
            id="printable-poster"
            style={{
              width: "140px",
              height: "180px",
              background: "white",
              borderRadius: "0.75rem",
              border: `3px solid ${accentColor}`,
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              padding: "0.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
              flexShrink: 0
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.55rem", fontWeight: 800, color: "#0f172a", textTransform: "uppercase" }}>
                {headline}
              </div>
              <div style={{ fontSize: "0.6rem", fontWeight: 800, color: accentColor }}>
                {business.name}
              </div>
            </div>

            <div style={{ background: "white", padding: "0.2rem", borderRadius: "0.3rem", border: "1px solid #e2e8f0" }}>
              <img
                src={qrImageUrl}
                alt="Review QR Code"
                style={{ width: "70px", height: "70px", display: "block", objectFit: "contain" }}
              />
            </div>

            <div style={{ fontSize: "0.45rem", color: "#64748b", fontWeight: 700 }}>
              powered by myrevlink.in
            </div>
          </div>

          <div>
            <div style={{
              display: "inline-block",
              background: "#eff6ff",
              color: "#2563eb",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "0.2rem 0.6rem",
              borderRadius: "1rem",
              marginBottom: "0.4rem"
            }}>
              {selectedTemplate.name}
            </div>
            <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
              {business.name}
            </h4>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", maxWidth: "350px", lineHeight: 1.4 }}>
              Customers scan this QR code to rate your business on Google.
            </p>
          </div>
        </div>

        {/* Action Buttons (NO EMOJIS) */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleDownloadPNG}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "0.75rem 1.25rem",
              borderRadius: "0.5rem",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)"
            }}
          >
            Download PNG Image
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            style={{
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              padding: "0.75rem 1.25rem",
              borderRadius: "0.5rem",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer"
            }}
          >
            Print Poster
          </button>

          <Link
            href="/dashboard/qr"
            style={{
              textDecoration: "none",
              background: "#f1f5f9",
              color: "#334155",
              border: "1px solid #cbd5e1",
              padding: "0.75rem 1.25rem",
              borderRadius: "0.5rem",
              fontWeight: 700,
              fontSize: "0.875rem"
            }}
          >
            Manage QR
          </Link>
        </div>
      </div>

    </div>
  );
}
