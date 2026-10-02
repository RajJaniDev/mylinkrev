import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import GmbAuditForm from "@/components/GmbAuditForm";
import GmbFaqAccordion from "@/components/GmbFaqAccordion";
import GmbPricingSection from "@/components/GmbPricingSection";
import GmbHeroShowcase from "@/components/GmbHeroShowcase";

export const metadata: Metadata = {
  title: "Google Business Management Agency & Local SEO Optimization | MyRevLink",
  description:
    "End-to-end Google Business Profile setup, optimization, weekly posts, 5-star review acceleration & local citation building that ranks your business in the Google Map Pack 3-Pack.",
  keywords: [
    "google business management",
    "google my business optimization agency",
    "gmb services india",
    "local seo agency",
    "google business profile management",
    "google 3 pack ranking",
    "google map ranking service",
    "local search optimization",
  ],
  openGraph: {
    title: "Google Business Management Agency | Dominate Google 3-Pack | MyRevLink",
    description:
      "GMB profile setup, weekly posts, geotagged media, citation cleanup & automated reviews that multiply local customer calls in 90 days.",
    url: "https://myrevlink.in/services/google-business-management",
    siteName: "MyRevLink",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Business Management & Local SEO Agency | MyRevLink",
    description:
      "Put your business at the top of Google Maps. Claim your free 7-point GMB profile audit.",
  },
};

export default async function GoogleBusinessManagementPage() {
  const reqHeaders = await headers();
  let isIndia = false;

  const country = reqHeaders.get("cf-ipcountry");
  if (country === "IN") {
    isIndia = true;
  } else {
    const acceptLang = reqHeaders.get("accept-language") || "";
    if (acceptLang.includes("en-IN") || acceptLang.includes("hi-IN")) {
      isIndia = true;
    }
  }

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://myrevlink.in/services/google-business-management#service",
        name: "Google Business Management & Local SEO Optimization",
        description:
          "End-to-end Google Business Profile setup, optimization, weekly posts, reviews, and local SEO that puts your business in the Google Map Pack 3-Pack.",
        url: "https://myrevlink.in/services/google-business-management",
        serviceType: "Google Business Profile Optimization & Local SEO",
        provider: {
          "@type": "Organization",
          name: "MyRevLink",
          url: "https://myrevlink.in",
          logo: "https://myrevlink.in/logo.png",
        },
        areaServed: ["India", "United States", "United Kingdom", "Canada", "Australia", "Global"],
        audience: {
          "@type": "BusinessAudience",
          audienceType: "Local SMEs, Clinics, Restaurants, Contractors, Retailers, and Multi-Location Brands",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Google Business Management Packages",
          itemListElement: [
            {
              "@type": "Offer",
              name: "Setup & Optimization",
              price: isIndia ? "14999" : "199",
              priceCurrency: isIndia ? "INR" : "USD",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Growth & Monthly Management",
              price: isIndia ? "11999" : "149",
              priceCurrency: isIndia ? "INR" : "USD",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Multi-Location / Franchise",
              price: isIndia ? "34999" : "399",
              priceCurrency: isIndia ? "INR" : "USD",
              availability: "https://schema.org/InStock",
            },
          ],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://myrevlink.in/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: "https://myrevlink.in/services/google-business-management",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Google Business Management",
          },
        ],
      },
      {
        "@type": "HowTo",
        name: "How MyRevLink Ranks Your Google Business Profile in the Local 3-Pack",
        description: "Our proven 4-step framework for dominating Google Map Pack rankings.",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Audit & Analysis",
            text: "Deep-dive 7-point profile health scan, category alignment, citation audit, and competitor map pack review.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Full Profile Optimization",
            text: "Rewrite keyword-optimized bio, fix primary/secondary categories, configure product catalogs, and upload geotagged media.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Activate & Deploy",
            text: "Schedule weekly Google Posts, deploy MyRevLink AI review QR stands, seed high-intent Q&As, and sync 50+ local citations.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Rank, Track & Multiply",
            text: "Track keyword positions across your city, measure inbound calls and direction requests, and scale local market share monthly.",
          },
        ],
      },
    ],
  };

  const deliverables = [
    {
      title: "GMB Profile Setup & Verification",
      icon: "🏢",
      desc: "We claim, verify, and resolve ownership disputes or duplicate listings. Pinpoint map pin alignment ensures customers navigate directly to your front door.",
    },
    {
      title: "Category & Service Menu Optimization",
      icon: "🎯",
      desc: "Selecting precise primary and secondary Google categories, configuring detailed service catalogs with local pricing, and activating custom call-to-action buttons.",
    },
    {
      title: "Geo-Tagged Photos & Local Visuals",
      icon: "📸",
      desc: "High-resolution photos tagged with exact EXIF GPS coordinates, interior/exterior shots, and team media to boost Google's local proximity relevance score.",
    },
    {
      title: "Weekly Google Posts & Offers",
      icon: "📢",
      desc: "Engaging weekly updates, seasonal discounts, product spotlights, and event posts designed to signal constant freshness to Google's ranking algorithm.",
    },
    {
      title: "Automated Review Acceleration & QR Kit",
      icon: "⭐",
      desc: "Includes MyRevLink's proprietary AI review generator and printable counter QR stands. Customers tap 5 stars and post authentic reviews in under 15 seconds.",
    },
    {
      title: "100% Review Response Management",
      icon: "💬",
      desc: "Rapid, professional responses to every positive and negative review within 24 hours, incorporating natural local SEO keywords to strengthen rankings.",
    },
    {
      title: "Local Citations & NAP Consistency",
      icon: "🌐",
      desc: "Audit, clean, and sync your Name, Address, and Phone (NAP) across 50+ tier-1 business directories like Apple Maps, Bing Places, Yelp, and Justdial.",
    },
    {
      title: "Suspension Defense & Policy Recovery",
      icon: "🛡️",
      desc: "Proactive compliance auditing to prevent sudden algorithmic suspensions, plus expedited preparation of reinstatement appeal packages if suspended.",
    },
  ];

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fbfbfb" }}>
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* TOP NAVIGATION / HEADER */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <Image src="/logo.png" alt="MyRevLink Logo" width={30} height={30} style={{ objectFit: "contain" }} />
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#172554" }}>
              MyRevLink<span style={{ color: "#2563eb" }}>.</span>
            </span>
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="hidden sm:flex">
            <Link
              href="/services/google-business-management"
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              Google Business Management
              <span
                style={{
                  fontSize: "0.65rem",
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  padding: "2px 6px",
                  borderRadius: "9999px",
                }}
              >
                CORE
              </span>
            </Link>
            <Link href="#deliverables" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#475569" }}>
              Deliverables
            </Link>
            <Link href="#process" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#475569" }}>
              Our Process
            </Link>
            <Link href="#pricing" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#475569" }}>
              Pricing
            </Link>
            <Link href="#faq" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#475569" }}>
              FAQ
            </Link>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              href="#audit-form"
              style={{
                background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                color: "#ffffff",
                padding: "0.6rem 1.25rem",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span>Get Free Audit</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #f1f5f9" }}>
        <div className="container" style={{ padding: "0.85rem 1.5rem" }}>
          <ol
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            <li>
              <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <span style={{ color: "#64748b" }}>Services</span>
            </li>
            <li>/</li>
            <li style={{ color: "#1d4ed8", fontWeight: 700 }}>Google Business Management</li>
          </ol>
        </div>
      </div>

      {/* HERO SECTION */}
      <section
        style={{
          position: "relative",
          padding: "5rem 1.5rem 6rem 1.5rem",
          background: "linear-gradient(135deg, #0b1528 0%, #0f172a 50%, #1e1b4b 100%)",
          color: "#ffffff",
          overflow: "hidden",
        }}
      >
        {/* Decorative Blur Orbs */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "rgba(37, 99, 235, 0.25)",
            filter: "blur(140px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(139, 92, 246, 0.18)",
            filter: "blur(120px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: "1280px", margin: "0 auto" }}>
          {/* Eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#93c5fd",
              padding: "0.4rem 1rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: "2rem",
            }}
          >
            <span>[01] Local SEO & Profile Optimization</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "3.5rem",
              alignItems: "center",
            }}
          >
            {/* Left Content Column */}
            <div>
              <h1
                style={{
                  fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  marginBottom: "1.5rem",
                }}
              >
                Google Business Management Agency
              </h1>

              <p
                style={{
                  fontSize: "1.25rem",
                  color: "#cbd5e1",
                  lineHeight: 1.6,
                  marginBottom: "2.5rem",
                  maxWidth: "580px",
                }}
              >
                Complete GMB profile setup, weekly posts, geo-tagged photo uploads, local citation building & 5-star review acceleration that puts your business at the top of the Google Map Pack.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "2rem" }}>
                <Link
                  href="#audit-form"
                  style={{
                    background: "#ffffff",
                    color: "#0f172a",
                    padding: "1.1rem 2.25rem",
                    borderRadius: "9999px",
                    fontWeight: 800,
                    fontSize: "1rem",
                    textDecoration: "none",
                    boxShadow: "0 10px 25px rgba(255, 255, 255, 0.2)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <span>Claim Free GMB Audit</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>

                <Link
                  href="#pricing"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    color: "#ffffff",
                    padding: "1.1rem 2rem",
                    borderRadius: "9999px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    textDecoration: "none",
                  }}
                >
                  View Pricing Plans
                </Link>
              </div>

              {/* Trust Indicators */}
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", color: "#94a3b8", fontSize: "0.875rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ color: "#4ade80" }}>✓</span> Fully optimized in 7 days
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ color: "#4ade80" }}>✓</span> Avg. 3–5x call growth in 90 days
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ color: "#4ade80" }}>✓</span> 100% Google policy safe
                </div>
              </div>
            </div>

            {/* Right Interactive Showcase Column */}
            <div>
              <GmbHeroShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* KEY TAKEAWAYS BOX (Preevee style highlighted callout) */}
      <section style={{ padding: "3rem 1.5rem", background: "#ffffff", borderBottom: "1px solid #e2e8f0" }}>
        <div className="container" style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              background: "#eff6ff",
              borderLeft: "6px solid #2563eb",
              borderRadius: "0 16px 16px 0",
              padding: "2rem 2.5rem",
              boxShadow: "0 4px 20px rgba(37, 99, 235, 0.06)",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#1d4ed8",
                marginBottom: "1rem",
              }}
            >
              Key Takeaways · At A Glance
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    color: "#ffffff",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1e3a8a", lineHeight: 1.45 }}>
                  GMB profiles fully claimed, verified & optimized in 7 days
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    color: "#ffffff",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1e3a8a", lineHeight: 1.45 }}>
                  Avg. 3–5x increase in customer calls & direction requests in 90 days
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    color: "#ffffff",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1e3a8a", lineHeight: 1.45 }}>
                  Weekly Google Posts, Q&A seeding & automated review acceleration
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    color: "#ffffff",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1e3a8a", lineHeight: 1.45 }}>
                  Built for single-location SMEs and multi-location brands
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DELIVERABLES SECTION */}
      <section id="deliverables" style={{ padding: "6rem 1.5rem", background: "#f8fafc" }}>
        <div className="container" style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div style={{ maxWidth: "720px", marginBottom: "3.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 800,
                color: "#2563eb",
              }}
            >
              What&apos;s Included
            </span>
            <h2
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.15,
                marginTop: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              Every Deliverable, Defined.
            </h2>
            <p style={{ color: "#64748b", fontSize: "1.125rem", lineHeight: 1.6 }}>
              Local SEO is not guesswork. We execute a comprehensive, battle-tested checklist of 8 core pillars that signal trust and authority to Google&apos;s Map Pack algorithm.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {deliverables.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "2rem",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 15px rgba(15, 23, 42, 0.03)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#eff6ff",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "1.5rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "1.1875rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem" }}>
                  {item.title}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section id="process" style={{ padding: "6rem 1.5rem", background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
        <div className="container" style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "4rem",
              alignItems: "flex-start",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontWeight: 800,
                  color: "#2563eb",
                }}
              >
                Our 4-Step Process
              </span>
              <h2
                style={{
                  fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1.15,
                  marginTop: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                A Repeatable, Transparent System.
              </h2>
              <p style={{ color: "#64748b", fontSize: "1.125rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                We don&apos;t lock you into mysterious agency retainers with zero visibility. Every step of our workflow is structured to show measurable improvements in calls, directions, and rankings.
              </p>

              <Link
                href="#audit-form"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#0f172a",
                  color: "#ffffff",
                  padding: "0.85rem 1.75rem",
                  borderRadius: "9999px",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                }}
              >
                <span>Get Started with Step 01</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                {
                  step: "01",
                  title: "Comprehensive Audit",
                  desc: "We analyze your profile completeness, primary/secondary category alignment, citation inconsistencies, duplicate listings, and competitor local 3-pack gaps.",
                },
                {
                  step: "02",
                  title: "Complete Profile Optimization",
                  desc: "We rewrite your bio with localized keywords, upload EXIF geotagged photos, configure your full product/service menu, and verify exact map coordinates.",
                },
                {
                  step: "03",
                  title: "Activate Posts & Review Flywheel",
                  desc: "We deploy weekly Google Posts with compelling offers, set up your MyRevLink AI review QR kits, seed local Q&As, and clean up duplicate citations across 50+ directories.",
                },
                {
                  step: "04",
                  title: "Rank, Track & Dominate",
                  desc: "We track keyword rankings across your city, measure increases in phone calls and direction requests, and deliver transparent monthly ROI reports.",
                },
              ].map((stepItem, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "1.5rem",
                    paddingBottom: "1.5rem",
                    borderBottom: idx === 3 ? "none" : "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "1.125rem",
                      fontWeight: 800,
                      color: "#2563eb",
                      background: "#eff6ff",
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {stepItem.step}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.35rem" }}>
                      {stepItem.title}
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }}>
                      {stepItem.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <GmbPricingSection defaultIsIndia={isIndia} />

      {/* EDITORIAL AUTHORITY / DEEP DIVE SECTION */}
      <section style={{ padding: "6rem 1.5rem", background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
        <div className="container" style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "3rem" }}>
          <div>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>
              What does a Google Business Profile optimization agency do?
            </h2>
            <p style={{ color: "#475569", fontSize: "1.0625rem", lineHeight: 1.7 }}>
              A Google Business Profile (formerly Google My Business) agency claims, verifies, and optimizes your local listing so it ranks in the coveted <strong>Google 3-Pack</strong> when nearby customers search for your services. MyRevLink handles category selection, service listings, geotagged media, weekly Google Posts, review acceleration, Q&A seeding, and citation synchronization — the levers that actually drive map pack rankings and turn search impressions into phone calls and visits.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>
              Why is ranking in the Google 3-Pack so critical for local businesses?
            </h2>
            <p style={{ color: "#475569", fontSize: "1.0625rem", lineHeight: 1.7 }}>
              Over <strong>70% of clicks for local searches</strong> go directly to the top 3 results in the Google Map Pack, bypassing standard organic search results completely. When a patient searches for &quot;dentist near me&quot; or a homeowner searches for &quot;emergency plumber&quot;, they don&apos;t read 10 blog posts — they tap the first listing with high ratings and click <em>Call</em> or <em>Directions</em>. Ranking #1 in the map pack is the most cost-effective lead generation channel in existence.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem" }}>
              How does MyRevLink combine Google Reviews with Profile Management?
            </h2>
            <p style={{ color: "#475569", fontSize: "1.0625rem", lineHeight: 1.7 }}>
              Google’s local ranking algorithm weighs <strong>review recency, frequency, and sentiment</strong> as primary ranking signals. Most businesses struggle to get customers to write reviews. With MyRevLink, you get our proprietary AI review generator and printable QR stands. When customers scan, our AI crafts context-aware, keyword-rich reviews that they can publish in one tap. This creates an unfair local advantage that competitors cannot match.
            </p>
          </div>
        </div>
      </section>

      {/* AUDIT FORM SECTION (High-converting CTA) */}
      <section
        id="audit-form"
        style={{
          padding: "6rem 1.5rem",
          background: "linear-gradient(135deg, #0b1528 0%, #0f172a 100%)",
          color: "#ffffff",
        }}
      >
        <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "3.5rem",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontWeight: 800,
                  color: "#60a5fa",
                  fontFamily: "monospace",
                }}
              >
                Free 7-Point Audit
              </span>

              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.25rem)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  marginTop: "0.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                Rank #1 in Your Local Map Pack — Get a Free GMB Audit
              </h2>

              <p style={{ color: "#cbd5e1", fontSize: "1.125rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                Tell us about your business and we will send a comprehensive 7-point Google Business Profile audit + custom 30-day ranking roadmap within 24 hours.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  "Avg. 3.2x–5x more calls & directions within 90 days",
                  "Deep-dive scan of categories, citations, and reviews",
                  "Competitor local 3-pack gap analysis included",
                  "Suspension defense & Google policy compliance check",
                ].map((point, pIdx) => (
                  <div key={pIdx} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "#2563eb",
                        color: "#ffffff",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "0.75rem",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </div>
                    <span style={{ fontSize: "0.9375rem", color: "#e2e8f0" }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <GmbAuditForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section id="faq" style={{ padding: "6rem 1.5rem", background: "#f8fafc" }}>
        <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 3rem auto" }}>
            <span
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 800,
                color: "#2563eb",
              }}
            >
              Frequently Asked Questions
            </span>
            <h2
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.15,
                marginTop: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              Google Business Management — FAQs
            </h2>
            <p style={{ color: "#64748b", fontSize: "1.125rem", lineHeight: 1.6 }}>
              Everything you need to know about our local SEO optimization service, ranking timelines, and deliverables.
            </p>
          </div>

          <GmbFaqAccordion />
        </div>
      </section>

      {/* POPULAR INDUSTRIES SECTION */}
      <section style={{ padding: "5rem 1.5rem", background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
        <div className="container" style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 800,
                color: "#2563eb",
              }}
            >
              Specialized Solutions
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
              Google Business Optimization by Industry
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { name: "Dentists & Clinics", slug: "dentists", emoji: "🦷" },
              { name: "Restaurants & Cafes", slug: "restaurants", emoji: "🍔" },
              { name: "Real Estate Agents", slug: "real-estate", emoji: "🏡" },
              { name: "Hair Salons & Spas", slug: "hair-salons", emoji: "✂️" },
              { name: "Plumbers & HVAC", slug: "plumbers", emoji: "🔧" },
              { name: "Gyms & Fitness Centers", slug: "gyms", emoji: "💪" },
              { name: "Lawyers & Legal Firms", slug: "lawyers", emoji: "⚖️" },
              { name: "Contractors & Builders", slug: "contractors", emoji: "🔨" },
              { name: "Doctors & Specialists", slug: "doctors", emoji: "🩺" },
              { name: "Hotels & Resorts", slug: "hotels", emoji: "🏨" },
            ].map((ind, idx) => (
              <Link
                key={idx}
                href={`/industries/${ind.slug}`}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "1.25rem",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "border-color 0.2s, background 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>{ind.emoji}</span>
                  <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#1e293b" }}>{ind.name}</span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7"></path>
                  <path d="M7 7h10v10"></path>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
