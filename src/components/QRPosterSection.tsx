"use client";

import React, { useState } from "react";
import { PrintButton } from "./PrintButton";

interface QRPosterSectionProps {
  business: {
    slug: string;
    name: string;
    google_review_url?: string | null;
  };
  socials: {
    profile_photo?: string | null;
  };
}

export function QRPosterSection({ business, socials }: QRPosterSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 0.5rem" }}>
        <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Printable QR Poster</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <PrintButton />
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              cursor: "pointer",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-md)",
              transition: "background 0.2s, color 0.2s, transform 0.2s",
              outline: "none"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "none";
            }}
            aria-label={isCollapsed ? "Expand QR Poster" : "Collapse QR Poster"}
          >
            <svg
              width="20"
              height="20"
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

      {/* Foldable Printable Area */}
      <div
        style={{
          maxHeight: isCollapsed ? "0px" : "1000px",
          opacity: isCollapsed ? 0 : 1,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out",
          width: "100%"
        }}
      >
        <div id="printable-poster" className="printable-poster-card" style={{ marginTop: "0.25rem" }}>
          {socials.profile_photo && (
            <img
              src={socials.profile_photo}
              alt="Profile"
              style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid #f3f4f6" }}
            />
          )}
          <div>
            <h2 style={{ fontSize: "2rem", margin: 0, fontWeight: "bold" }}>{business.name}</h2>
            <p style={{ fontSize: "1.125rem", color: "#4b5563", margin: "0.5rem 0 0 0" }}>Scan the QR code to leave us a review!</p>
          </div>

          <div style={{ padding: "1rem", background: "white", border: "2px solid #e5e7eb", borderRadius: "1rem", marginTop: "0.5rem", maxWidth: "100%" }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`https://myrevlink.in/b/${business.slug}/rate`)}`}
              alt="QR Code"
              style={{ display: "block", margin: "0 auto", maxWidth: "100%", height: "auto" }}
            />
          </div>

          <div style={{ color: "#6b7280", fontSize: "0.875rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Powered by <strong>myrevlink.in</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
