"use client";

import React, { useState } from "react";
import { QRPosterCustomizer, QRTemplateConfig } from "./QRPosterCustomizer";

interface QRPosterSectionProps {
  business: {
    slug: string;
    name: string;
    google_review_url?: string | null;
  };
  socials: {
    profile_photo?: string | null;
    phone?: string | null;
    email?: string | null;
    location?: string | null;
    qr_customization?: Partial<QRTemplateConfig>;
  };
}

export function QRPosterSection({ business, socials }: QRPosterSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const reviewUrl = business.google_review_url || `https://myrevlink.in/b/${business.slug}/rate`;
  const savedCustomization = socials.qr_customization || {};

  const initialConfig: Partial<QRTemplateConfig> = {
    templateId: savedCustomization.templateId || "google_arch",
    businessName: savedCustomization.businessName || business.name,
    businessLogo: savedCustomization.businessLogo || socials.profile_photo || "",
    reviewLink: savedCustomization.reviewLink || reviewUrl,
    headline: savedCustomization.headline || "Scan to Rate Us on Google",
    subheadline: savedCustomization.subheadline || "Scan this code to leave us a 5-star review & help our local business grow!",
    thankyouNote: savedCustomization.thankyouNote || "Thank you for your visit!",
    accentColor: savedCustomization.accentColor || "#1a73e8",
    phone: savedCustomization.phone || socials.phone || "",
    email: savedCustomization.email || socials.email || "",
    location: savedCustomization.location || socials.location || "",
  };

  const handleSave = async (config: QRTemplateConfig) => {
    const res = await fetch("/api/save-qr-customization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qr_customization: config }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to save QR customization");
    }
  };

  return (
    <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 0.5rem" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "var(--foreground)" }}>
            Printable Review QR Poster Customizer
          </h3>
          <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
            Choose from 5 templates, edit text & colors, and download your high-res PNG poster.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              cursor: "pointer",
              padding: "0.5rem 0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.85rem",
              fontWeight: 600,
              transition: "all 0.2s"
            }}
          >
            <span>{isCollapsed ? "Expand Customizer" : "Collapse Customizer"}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* Collapsible Area */}
      <div
        style={{
          maxHeight: isCollapsed ? "0px" : "2400px",
          opacity: isCollapsed ? 0 : 1,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out",
          width: "100%"
        }}
      >
        <div style={{ marginTop: "0.5rem" }}>
          <QRPosterCustomizer
            initialConfig={initialConfig}
            onSave={handleSave}
            isPaid={true}
            showSaveButton={true}
          />
        </div>
      </div>
    </div>
  );
}
