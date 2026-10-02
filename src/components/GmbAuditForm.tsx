"use client";

import React, { useState } from "react";

export default function GmbAuditForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    businessName: "",
    locations: "1 location",
    websiteOrMapsUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/audit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (submitted) {
    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    const waText = encodeURIComponent(
      `Hi MyRevLink Team, I just requested a free Google Business Profile audit for ${formData.businessName || formData.name}. Could we connect?`
    );

    return (
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "2.5rem 2rem",
          boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.08)",
          border: "1px solid #e2e8f0",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#dcfce7",
            color: "#16a34a",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 1.5rem auto",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: "0.75rem",
          }}
        >
          Audit Request Received!
        </h3>
        <p
          style={{
            color: "#475569",
            fontSize: "1rem",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
          }}
        >
          Thank you, <strong>{formData.name}</strong>. Our local SEO specialists are
          inspecting your profile health, local 3-pack competitors, and keyword
          opportunities for <strong>{formData.businessName || "your business"}</strong>.
        </p>
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "12px",
            padding: "1rem",
            border: "1px solid #e2e8f0",
            marginBottom: "2rem",
            fontSize: "0.875rem",
            color: "#334155",
            textAlign: "left",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>
            ⏱ What happens next?
          </div>
          <ul style={{ paddingLeft: "1.2rem", margin: 0, lineHeight: 1.6 }}>
            <li>We perform a 7-point audit on your Google Business Profile.</li>
            <li>We prepare a custom 30-day Google 3-Pack ranking strategy.</li>
            <li>We send the complete report to <strong>{formData.email}</strong> within 24 hours.</li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={`https://wa.me/919811380023?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#25D366",
              color: "#ffffff",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              fontWeight: 700,
              fontSize: "0.875rem",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.004.57 2.015.897 3.03.897 3.178 0 5.767-2.587 5.767-5.766.001-3.187-2.575-5.77-5.991-5.77zm1.192 8.35c-.244.685-1.213 1.258-1.745 1.282-.533.023-1.074.14-3.513-1.014-2.827-1.336-3.804-4.52-3.95-4.717-.145-.198-1.129-1.501-1.129-2.862 0-1.362.712-2.032.966-2.308.254-.277.555-.347.74-.347.185 0 .37.003.532.011.173.008.406-.066.634.482.234.561.796 1.944.866 2.086.07.142.116.31.023.497-.093.188-.139.306-.277.471-.139.165-.292.368-.417.494-.14.139-.285.291-.122.571.162.279.721 1.189 1.549 1.927 1.066.95 1.965 1.245 2.243 1.384.279.139.441.116.604-.07.163-.186.697-.812.883-1.091.186-.279.372-.233.628-.139.255.093 1.625.766 1.904.905.279.14.464.209.533.325.07.116.07.674-.174 1.359z" />
            </svg>
            Chat on WhatsApp
          </a>

          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: "",
                phone: "",
                email: "",
                businessName: "",
                locations: "1 location",
                websiteOrMapsUrl: "",
              });
            }}
            style={{
              background: "transparent",
              border: "1px solid #cbd5e1",
              color: "#475569",
              padding: "0.75rem 1.25rem",
              borderRadius: "9999px",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Submit Another Listing
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "2.5rem 2rem",
        boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.08)",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      <div style={{ marginBottom: "0.5rem" }}>
        <span
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 800,
            color: "#2563eb",
          }}
        >
          Free 7-Point Audit
        </span>
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#0f172a",
            marginTop: "0.35rem",
            marginBottom: "0.25rem",
          }}
        >
          Claim Your Free Google Map Pack Audit
        </h3>
        <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.5, margin: 0 }}>
          Receive your personalized profile score, competitor map analysis, and 30-day ranking plan.
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "#fef2f2",
            color: "#dc2626",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            fontSize: "0.875rem",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label htmlFor="audit-name" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#334155" }}>
            Your Name <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            id="audit-name"
            required
            name="name"
            type="text"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "0.9375rem",
              outline: "none",
              background: "#ffffff",
              color: "#0f172a",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label htmlFor="audit-phone" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#334155" }}>
            WhatsApp / Phone <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            id="audit-phone"
            required
            name="phone"
            type="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "0.9375rem",
              outline: "none",
              background: "#ffffff",
              color: "#0f172a",
            }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label htmlFor="audit-email" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#334155" }}>
            Business Email <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            id="audit-email"
            required
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@yourbusiness.com"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "0.9375rem",
              outline: "none",
              background: "#ffffff",
              color: "#0f172a",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label htmlFor="audit-business" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#334155" }}>
            Business Name
          </label>
          <input
            id="audit-business"
            name="businessName"
            type="text"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Apex Dental Clinic"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "0.9375rem",
              outline: "none",
              background: "#ffffff",
              color: "#0f172a",
            }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label htmlFor="audit-locations" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#334155" }}>
            How Many Locations?
          </label>
          <select
            id="audit-locations"
            name="locations"
            value={formData.locations}
            onChange={handleChange}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "0.9375rem",
              outline: "none",
              background: "#ffffff",
              color: "#0f172a",
              cursor: "pointer",
            }}
          >
            <option value="1 location">1 Storefront Location</option>
            <option value="2–5 locations">2–5 Locations</option>
            <option value="6–20 locations">6–20 Locations</option>
            <option value="20+ locations">20+ Franchise Locations</option>
            <option value="Service-area business (no storefront)">Service-Area Business (No Storefront)</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label htmlFor="audit-url" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#334155" }}>
            Google Maps Link / Website
          </label>
          <input
            id="audit-url"
            name="websiteOrMapsUrl"
            type="text"
            value={formData.websiteOrMapsUrl}
            onChange={handleChange}
            placeholder="maps.app.goo.gl/... or website.com"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "0.9375rem",
              outline: "none",
              background: "#ffffff",
              color: "#0f172a",
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: "0.75rem",
          padding: "1rem 2rem",
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
          color: "#ffffff",
          border: "none",
          borderRadius: "9999px",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.6rem",
          boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
          transition: "transform 0.2s, box-shadow 0.2s",
          opacity: loading ? 0.8 : 1,
        }}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
            </svg>
            Analyzing Listing...
          </>
        ) : (
          <>
            <span>Get Free 7-Point GMB Audit</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </>
        )}
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          color: "#64748b",
          fontSize: "0.75rem",
          textAlign: "center",
          flexWrap: "wrap",
        }}
      >
        <span>🔒 Zero Spam Guarantee</span>
        <span>•</span>
        <span>⚡ Report in 24 Hours</span>
        <span>•</span>
        <span>📞 Free 30-min Ranking Strategy</span>
      </div>
    </form>
  );
}
