"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function GmbPricingSection({ defaultIsIndia = true }: { defaultIsIndia?: boolean }) {
  const [currency, setCurrency] = useState<"INR" | "USD">(defaultIsIndia ? "INR" : "USD");

  const isINR = currency === "INR";
  const symbol = isINR ? "₹" : "$";

  const tiers = [
    {
      name: "Setup & Optimization",
      badge: "One-Time Quickstart",
      price: isINR ? "14,999" : "199",
      billingText: "one-time investment",
      description: "Complete overhaul, claiming, verification, and technical SEO optimization for your Google Business Profile.",
      features: [
        "Full 7-Point GMB Profile Audit & Health Score",
        "Verification & Address Alignment Assistance",
        "Primary & Secondary Category Optimization",
        "Keyword-Rich Business Bio & Service Menus",
        "15 Geotagged Photos with EXIF Coordinates",
        "Products & Custom Service Catalogs Built",
        "First 4 Weekly Google Posts Pre-Scheduled",
        "Free MyRevLink AI Review QR Stand Kit",
        "30-Day Initial Performance Report",
      ],
      isPopular: false,
      ctaText: "Get Started with Setup",
      ctaLink: "#audit-form",
    },
    {
      name: "Growth & Management",
      badge: "Most Popular • Recommended",
      price: isINR ? "11,999" : "149",
      billingText: "per month • cancel anytime",
      description: "Hands-free, end-to-end management to dominate local searches, climb the Google 3-Pack, and multiply calls.",
      features: [
        "Everything in Setup & Optimization",
        "4 Weekly High-Impact Google Posts with Visuals",
        "Continuous Review Generation System & QR Kit",
        "100% Review Responses Handled in 24 Hours",
        "10 High-Authority Local Citations Built Monthly",
        "Google Q&A Seeding & FAQ Management",
        "5 New Geotagged Photos Uploaded Monthly",
        "Proactive Google Policy & Suspension Defense",
        "Monthly Map Pack Rankings, Calls & Direction Reports",
        "Dedicated Local SEO Account Manager",
      ],
      isPopular: true,
      ctaText: "Claim Growth Management",
      ctaLink: "#audit-form",
    },
    {
      name: "Multi-Location & Franchise",
      badge: "For Brands & Chains",
      price: isINR ? "34,999" : "399",
      billingText: "per month • up to 10 locations",
      description: "Scale local visibility across multiple clinic branches, restaurants, retail stores, or franchise operations.",
      features: [
        "Complete Management for Up to 10 Locations",
        "Centralized Campaign Scheduling & Localized Posts",
        "Multi-Location Review Aggregation & Sentiment CRM",
        "NAP Consistency Sync Across 50+ Directories",
        "Local Store Landing Page Alignment",
        "Priority Suspension & Reinstatement Hotline",
        "Bi-Weekly Strategy & ROI Progress Calls",
        "Custom volume pricing available for 10+ outlets",
      ],
      isPopular: false,
      ctaText: "Talk to Us (Multi-Location)",
      ctaLink: "#audit-form",
    },
  ];

  return (
    <section id="pricing" style={{ padding: "6rem 1.5rem", background: "#f8fafc" }}>
      <div className="container" style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "750px", margin: "0 auto 3rem auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#dbeafe",
              color: "#1d4ed8",
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              fontSize: "0.8125rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "1rem",
            }}
          >
            Transparent Local SEO Pricing
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            Invest in Guaranteed Local Map Pack Visibility
          </h2>
          <p style={{ color: "#64748b", fontSize: "1.125rem", lineHeight: 1.6 }}>
            No hidden setup fees. No long-term lock-in. Choose the right plan to drive high-intent local calls, directions, and reviews every single month.
          </p>

          {/* Currency Switcher */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#ffffff",
              padding: "4px",
              borderRadius: "9999px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              marginTop: "1.5rem",
            }}
          >
            <button
              type="button"
              onClick={() => setCurrency("INR")}
              style={{
                padding: "0.45rem 1.25rem",
                borderRadius: "9999px",
                border: "none",
                background: isINR ? "#2563eb" : "transparent",
                color: isINR ? "#ffffff" : "#64748b",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              India (INR ₹)
            </button>
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              style={{
                padding: "0.45rem 1.25rem",
                borderRadius: "9999px",
                border: "none",
                background: !isINR ? "#2563eb" : "transparent",
                color: !isINR ? "#ffffff" : "#64748b",
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              International (USD $)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
            alignItems: "stretch",
          }}
        >
          {tiers.map((tier, idx) => {
            return (
              <div
                key={idx}
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  border: tier.isPopular ? "2px solid #2563eb" : "1px solid #e2e8f0",
                  padding: "2.5rem 2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: tier.isPopular
                    ? "0 20px 40px -10px rgba(37, 99, 235, 0.18)"
                    : "0 10px 25px -5px rgba(15, 23, 42, 0.04)",
                  position: "relative",
                  transform: tier.isPopular ? "scale(1.02)" : "scale(1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {tier.isPopular && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                      color: "#ffffff",
                      padding: "0.35rem 1rem",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)",
                    }}
                  >
                    ★ Most Popular Choice
                  </div>
                )}

                <div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: tier.isPopular ? "#2563eb" : "#64748b",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {tier.badge}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "#0f172a",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {tier.name}
                  </h3>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "0.9375rem",
                      lineHeight: 1.5,
                      minHeight: "44px",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {tier.description}
                  </p>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" }}>{symbol}</span>
                    <span style={{ fontSize: "3rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{tier.price}</span>
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: "2rem" }}>
                    {tier.billingText}
                  </div>

                  <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", marginBottom: "1.75rem" }} />

                  <div style={{ fontSize: "0.8125rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#334155", marginBottom: "1rem" }}>
                    What&apos;s Included:
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {tier.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.75rem",
                          fontSize: "0.9rem",
                          color: "#334155",
                          lineHeight: 1.45,
                        }}
                      >
                        <span
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            background: tier.isPopular ? "#dbeafe" : "#f1f5f9",
                            color: tier.isPopular ? "#2563eb" : "#16a34a",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                            marginTop: "2px",
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={tier.ctaLink}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "0.95rem 1.5rem",
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    textDecoration: "none",
                    background: tier.isPopular
                      ? "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)"
                      : "#0f172a",
                    color: "#ffffff",
                    boxShadow: tier.isPopular
                      ? "0 8px 20px rgba(37, 99, 235, 0.3)"
                      : "0 4px 12px rgba(15, 23, 42, 0.1)",
                    transition: "opacity 0.2s, transform 0.2s",
                  }}
                >
                  {tier.ctaText} &rarr;
                </Link>
              </div>
            );
          })}
        </div>

        {/* Free Audit Banner Reminder */}
        <div
          style={{
            marginTop: "4rem",
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            borderRadius: "16px",
            padding: "2rem 2.5rem",
            border: "1px solid #bfdbfe",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <h4 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e3a8a", marginBottom: "0.35rem" }}>
              Unsure which plan fits your business?
            </h4>
            <p style={{ color: "#3b82f6", fontSize: "0.95rem", margin: 0 }}>
              Claim your free 7-point profile audit. We will evaluate your local competition and recommend the ideal package.
            </p>
          </div>
          <Link
            href="#audit-form"
            style={{
              background: "#1d4ed8",
              color: "#ffffff",
              padding: "0.85rem 1.75rem",
              borderRadius: "9999px",
              fontWeight: 700,
              fontSize: "0.875rem",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(29, 78, 216, 0.3)",
              whiteSpace: "nowrap",
            }}
          >
            Claim Free GMB Audit &rarr;
          </Link>
        </div>

      </div>
    </section>
  );
}
