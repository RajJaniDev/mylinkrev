"use client";

import React, { useState } from "react";

export default function GmbHeroShowcase() {
  const [activeTab, setActiveTab] = useState<"dentist" | "restaurant" | "plumber">("dentist");

  const businessProfiles = {
    dentist: {
      search: "dentist near me",
      name: "Apex Family Dental & Orthodontics",
      category: "Dentist · Cosmetic Dentistry",
      reviews: "428",
      rating: "5.0",
      status: "Open · Closes 7:30 PM",
      phone: "+91 98113 80023",
      callsGrowth: "+380%",
      directionsGrowth: "+420%",
      rankPill: "#1 in Google 3-Pack",
      recentReview: "Gentle cleaning and friendly staff! Reviewed via QR stand.",
    },
    restaurant: {
      search: "best italian restaurant",
      name: "Bella Vista Bistro & Cafe",
      category: "Italian Restaurant · Rooftop Dining",
      reviews: "612",
      rating: "4.9",
      status: "Open · Closes 11:00 PM",
      phone: "+91 98113 80023",
      callsGrowth: "+310%",
      directionsGrowth: "+480%",
      rankPill: "#1 in Local Food Pack",
      recentReview: "Incredible woodfired pizza! 5-star experience all the way.",
    },
    plumber: {
      search: "emergency plumber near me",
      name: "Metro Emergency Plumbing Solutions",
      category: "Plumbing Service · 24/7 Available",
      reviews: "318",
      rating: "5.0",
      status: "Open 24 Hours",
      phone: "+91 98113 80023",
      callsGrowth: "+440%",
      directionsGrowth: "+260%",
      rankPill: "#1 Emergency Service Pack",
      recentReview: "Arrived in 25 mins and fixed the pipe leak instantly!",
    },
  };

  const current = businessProfiles[activeTab];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto",
      }}
    >
      {/* Background Soft Glow */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "120%",
          height: "120%",
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Main Showcase Card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "#ffffff",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.8)",
          overflow: "hidden",
        }}
      >
        {/* Industry Switcher Tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            padding: "0.5rem 1rem",
            fontSize: "0.8125rem",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontWeight: 700, color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }}></span>
            Live Google 3-Pack Demo:
          </span>

          <div style={{ display: "flex", gap: "0.35rem" }}>
            {(["dentist", "restaurant", "plumber"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                style={{
                  padding: "0.3rem 0.75rem",
                  borderRadius: "9999px",
                  border: "none",
                  background: activeTab === key ? "#2563eb" : "#ffffff",
                  color: activeTab === key ? "#ffffff" : "#475569",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  boxShadow: activeTab === key ? "0 2px 6px rgba(37, 99, 235, 0.3)" : "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                  textTransform: "capitalize",
                }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Google Maps Search Bar Mockup */}
        <div style={{ padding: "1.25rem 1.5rem 0.75rem 1.5rem" }}>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "9999px",
              padding: "0.6rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 5px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#1e293b" }}>
                {current.search}
              </span>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                background: "#fef3c7",
                color: "#b45309",
                padding: "0.25rem 0.65rem",
                borderRadius: "9999px",
                fontSize: "0.7rem",
                fontWeight: 800,
              }}
            >
              <span>📍 {current.rankPill}</span>
            </div>
          </div>
        </div>

        {/* Profile Card Body */}
        <div style={{ padding: "0.75rem 1.5rem 1.5rem 1.5rem" }}>
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                <h4 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  {current.name}
                </h4>
                <span
                  title="Google Verified Profile"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.2rem",
                    background: "#e0f2fe",
                    color: "#0369a1",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Verified Listing
                </span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>
                {current.category}
              </div>
            </div>

            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                padding: "0.35rem 0.75rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: 700,
                textAlign: "right",
              }}
            >
              Top Ranked Result
            </div>
          </div>

          {/* Rating Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem" }}>{current.rating}</span>
            <div style={{ display: "flex", gap: "2px", color: "#f59e0b" }}>
              {"★★★★★".split("").map((star, sIdx) => (
                <span key={sIdx} style={{ fontSize: "1.1rem" }}>{star}</span>
              ))}
            </div>
            <span style={{ color: "#2563eb", fontWeight: 600, fontSize: "0.875rem" }}>
              ({current.reviews} Google reviews)
            </span>
            <span style={{ color: "#cbd5e1" }}>•</span>
            <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "0.85rem" }}>
              {current.status}
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.6rem 0.5rem",
                borderRadius: "10px",
                background: "#eff6ff",
                color: "#1d4ed8",
                fontWeight: 700,
                fontSize: "0.8125rem",
                border: "1px solid #bfdbfe",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>Call Business</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.6rem 0.5rem",
                borderRadius: "10px",
                background: "#f8fafc",
                color: "#334155",
                fontWeight: 700,
                fontSize: "0.8125rem",
                border: "1px solid #e2e8f0",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
              </svg>
              <span>Directions</span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.6rem 0.5rem",
                borderRadius: "10px",
                background: "#f8fafc",
                color: "#334155",
                fontWeight: 700,
                fontSize: "0.8125rem",
                border: "1px solid #e2e8f0",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>Website</span>
            </div>
          </div>

          {/* Growth Metrics Highlight Box */}
          <div
            style={{
              background: "#0f172a",
              borderRadius: "16px",
              padding: "1rem 1.25rem",
              color: "#ffffff",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", fontWeight: 700 }}>
                Inbound Phone Calls
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", marginTop: "0.2rem" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#4ade80" }}>
                  {current.callsGrowth}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>last 90 days</span>
              </div>
            </div>

            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.15)", paddingLeft: "1rem" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", fontWeight: 700 }}>
                Direction Requests
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", marginTop: "0.2rem" }}>
                <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#38bdf8" }}>
                  {current.directionsGrowth}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>local customers</span>
              </div>
            </div>
          </div>

          {/* Recent Automated Review Snippet */}
          <div
            style={{
              marginTop: "1rem",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.8125rem",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#fef3c7",
                color: "#d97706",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                fontWeight: 800,
                fontSize: "0.75rem",
              }}
            >
              ★
            </div>
            <div style={{ color: "#334155", fontStyle: "italic", flex: 1 }}>
              &ldquo;{current.recentReview}&rdquo;
            </div>
            <span
              style={{
                fontSize: "0.7rem",
                color: "#16a34a",
                fontWeight: 700,
                background: "#dcfce7",
                padding: "2px 6px",
                borderRadius: "4px",
                whiteSpace: "nowrap",
              }}
            >
              ✓ Verified Review
            </span>
          </div>

        </div>
      </div>

      {/* Floating Pill Badges */}
      <div
        style={{
          position: "absolute",
          top: "-15px",
          right: "-15px",
          background: "#1d4ed8",
          color: "#ffffff",
          padding: "0.45rem 1rem",
          borderRadius: "9999px",
          fontSize: "0.75rem",
          fontWeight: 800,
          boxShadow: "0 8px 20px rgba(29, 78, 216, 0.35)",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          zIndex: 2,
        }}
      >
        <span>⚡ 7-Day Optimization Guarantee</span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "-15px",
          left: "-10px",
          background: "#ffffff",
          color: "#0f172a",
          padding: "0.45rem 1rem",
          borderRadius: "9999px",
          fontSize: "0.75rem",
          fontWeight: 700,
          border: "1px solid #cbd5e1",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          zIndex: 2,
        }}
      >
        <span style={{ color: "#22c55e" }}>●</span>
        <span>Weekly Google Posts Active</span>
      </div>
    </div>
  );
}
