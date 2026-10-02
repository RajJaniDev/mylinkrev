import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";
import Footer from "@/components/Footer";
import GmbHeroShowcase from "@/components/GmbHeroShowcase";

export default async function Home() {
  const reqHeaders = await headers();
  let isIndia = false;
  
  // Detect region
  const country = reqHeaders.get("cf-ipcountry");
  if (country === "IN") {
    isIndia = true;
  } else {
    const acceptLang = reqHeaders.get("accept-language") || "";
    if (acceptLang.includes("en-IN") || acceptLang.includes("hi-IN")) {
      isIndia = true;
    }
  }

  // Fetch pricing from settings table
  const { data: settingsData } = await supabase
    .from("settings")
    .select("key, value");

  const settings = settingsData?.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {}) || {};

  const usdPrice = settings.price_usd_amount || "10";
  const inrPrice = settings.price_inr_amount || "199";

  const priceSymbol = isIndia ? "₹" : "$";
  const priceAmount = isIndia ? inrPrice : usdPrice;

  return (
    <main className="animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      
      {/* HEADER / NAVBAR */}
      <header className="container header-nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="MyRevLink Logo" width={28} height={28} style={{ objectFit: 'contain' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#172554' }}>MyRevLink</span>
        </Link>
        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }} className="hidden sm:flex">
          {/* Services Link with Core Flag */}
          <div className="nav-dropdown-trigger" style={{ cursor: 'pointer', padding: '0.5rem 0' }}>
            <Link 
              href="/services/google-business-management" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1d4ed8', fontWeight: 700, textDecoration: 'none' }}
            >
              <span>Services</span>
              <span style={{ fontSize: '0.65rem', background: '#dbeafe', color: '#1d4ed8', padding: '2px 6px', borderRadius: '9999px', textTransform: 'uppercase', fontWeight: 800 }}>Core</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </Link>
            <div className="nav-dropdown-menu" style={{ width: '310px' }}>
              <Link href="/services/google-business-management" className="nav-dropdown-item" style={{ borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#1d4ed8' }}>Google Business Management</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.2rem', fontWeight: 400 }}>Flagship GMB setup, weekly posts, 3-pack SEO & reviews</div>
              </Link>
              <Link href="/services/google-business-management#audit-form" className="nav-dropdown-item" style={{ borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Free 7-Point GMB Audit</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.15rem', fontWeight: 400 }}>Custom profile score & 30-day ranking roadmap</div>
              </Link>
              <Link href="/services/google-business-management#pricing" className="nav-dropdown-item">
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Service Pricing Tiers</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.15rem', fontWeight: 400 }}>Setup, Monthly Growth & Multi-Location plans</div>
              </Link>
            </div>
          </div>

          <Link href="#features">Features</Link>
          <Link href="#how-it-works">How it Works</Link>
          
          {/* Tools Dropdown */}
          <div className="nav-dropdown-trigger" style={{ cursor: 'pointer', padding: '0.5rem 0' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Tools
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
            <div className="nav-dropdown-menu">
              <Link href="/tools/google-review-qr" className="nav-dropdown-item" style={{ borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Generate AI Google Review QR</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.15rem', fontWeight: 400 }}>Printable A4 QR codes for counter displays</div>
              </Link>
              <Link href="/tools/digital-business-card" className="nav-dropdown-item">
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Digital Business Card</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.15rem', fontWeight: 400 }}>Create & download digital profile cards</div>
              </Link>
            </div>
          </div>

          <Link href="/services/google-business-management#pricing">Pricing</Link>
          <Link href="/services/google-business-management#faq">FAQ</Link>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <Link href="/demo" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563eb' }}>View Demo</Link>
          <Link href="/sign-in" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Login</Link>
          <Link href="/services/google-business-management#audit-form">
            <Button variant="primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem', borderRadius: '8px', background: '#1d4ed8' }}>Free GMB Audit</Button>
          </Link>
        </div>
      </header>
      
      {/* REDESIGNED HERO SECTION: GOOGLE BUSINESS MANAGEMENT AS CORE SERVICE */}
      <section style={{ position: 'relative', padding: '11rem 1.5rem 5rem 1.5rem', overflow: 'hidden', background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f0fdf4 100%)' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .hero-mockup-wrapper {
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .hero-mockup-wrapper:hover {
            transform: translateY(-8px) scale(1.01) !important;
            filter: drop-shadow(0 30px 45px rgba(15, 23, 42, 0.16)) !important;
          }
        `}} />
        <div className="container hero-grid" style={{ position: 'relative', zIndex: 1 }}>
          
          {/* LEFT COLUMN */}
          <div className="hero-content">
            
            {/* Badges Container */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#dbeafe', color: '#1e40af', padding: '0.45rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }}></span>
                Core Service: Google Business Management
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef3c7', color: '#d97706', padding: '0.45rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #fde68a' }}>
                🏆 #1 Google Map Pack Agency
              </div>
            </div>

            <h1 className="hero-title" style={{ color: '#0f172a' }}>
              Dominate Google Maps. Turn Nearby Searches Into <span style={{ color: '#2563eb' }}>Paying Customers</span>.
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#475569', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '95%' }}>
              We manage your Google Business Profile end-to-end: verified setup, category optimization, weekly geo-targeted posts, citation cleanup, and automated 5-star review collection. Gain 3–5x more customer calls, direction requests, and walk-ins in 90 days.
            </p>

            <div className="hero-grid-buttons" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', width: '100%', marginBottom: '1.75rem' }}>
              <Link href="/services/google-business-management#audit-form">
                <Button variant="primary" style={{ padding: '1.25rem 2.25rem', fontSize: '1rem', borderRadius: '9999px', background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)', border: 'none', boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)', fontWeight: 800 }}>
                  Get Free GMB Audit &rarr;
                </Button>
              </Link>
              <Link href="/services/google-business-management">
                <Button variant="secondary" style={{ padding: '1.25rem 2rem', fontSize: '1rem', borderRadius: '9999px', background: '#ffffff', border: '2px solid #2563eb', color: '#1d4ed8', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  Explore Service Plans
                </Button>
              </Link>
              <Link href="/demo" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', textDecoration: 'underline', paddingLeft: '0.5rem' }}>
                View Live Demo
              </Link>
            </div>

            {/* Benefit Checkpoints */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem', width: '100%', color: '#334155', fontSize: '0.875rem', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'grid', placeItems: 'center', flexShrink: 0 }}>✓</span>
                Fully Optimized in 7 Days
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'grid', placeItems: 'center', flexShrink: 0 }}>✓</span>
                Avg. 3–5x Call & Direction Growth
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'grid', placeItems: 'center', flexShrink: 0 }}>✓</span>
                Weekly Posts & Geotagged Media
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'grid', placeItems: 'center', flexShrink: 0 }}>✓</span>
                AI Review QR Stand Kit Included
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE GOOGLE 3-PACK & GMB SHOWCASE */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <div className="hero-mockup-wrapper" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '680px' }}>
              <GmbHeroShowcase />
            </div>
          </div>

        </div>
      </section>

      {/* TRUST BANNER: LOCAL SEO KEY PERFORMANCE PROMISES */}
      <div style={{ width: '100%', padding: '3.5rem 1.5rem', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '3rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'grid', placeItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Google 3-Pack Rankings</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Top 3 Local Placement</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'grid', placeItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>3–5x Inbound Calls</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Measurable Lead Growth</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'grid', placeItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Automated 5-Star Reviews</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Proprietary QR Generator</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ede9fe', color: '#7c3aed', display: 'grid', placeItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>100% Policy Compliant</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Suspension Defense</div>
            </div>
          </div>

        </div>
      </div>

      {/* FEATURES SECTION */}
      <section id="features" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', padding: '8rem 0 4rem 0', position: 'relative' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
            gap: 3rem;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
          }
          @media (max-width: 768px) {
            .features-grid {
              grid-template-columns: 1fr;
            }
          }
          .feature-card {
            background: #ffffff;
            padding: 3rem;
            border-radius: 28px;
            border: 1px solid #f1f5f9;
            box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.04);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            cursor: default;
            overflow: hidden;
          }
          .feature-card:hover {
            transform: translateY(-6px);
            border-color: rgba(59, 130, 246, 0.3);
            box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.08);
          }
          .feature-icon-wrapper {
            width: 52px;
            height: 52px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .feature-card:hover .feature-icon-wrapper {
            transform: scale(1.1) rotate(3deg);
          }
          .feature-list {
            margin-top: 1.5rem;
            margin-bottom: 2rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            padding: 0;
            list-style: none;
          }
          .feature-list-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: #475569;
            font-size: 0.925rem;
          }
          .feature-list-icon {
            color: #10b981;
            flex-shrink: 0;
          }
          .mockup-visual {
            width: 100%;
            height: 180px;
            background: #f8fafc;
            border-radius: 16px;
            border: 1px dashed #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            margin-top: auto;
          }
          /* Custom CSS-based mockups */
          .profile-mockup {
            width: 80%;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px -10px rgba(0,0,0,0.08);
            border: 1px solid #e2e8f0;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .profile-banner {
            height: 40px;
            background: linear-gradient(90deg, #3b82f6, #60a5fa);
            border-radius: 6px;
          }
          .profile-avatar {
            width: 32px;
            height: 32px;
            background: #cbd5e1;
            border-radius: 50%;
            border: 2px solid white;
            margin-top: -20px;
            margin-left: 10px;
          }
          .profile-bar {
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
          }
          .linktree-mockup {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 70%;
          }
          .linktree-btn {
            background: #3b82f6;
            color: white;
            padding: 0.5rem;
            border-radius: 8px;
            font-size: 0.75rem;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
          }
          .linktree-btn.sec {
            background: #10b981;
            box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
          }
          .qr-mockup {
            position: relative;
            width: 60px;
            height: 80px;
            background: white;
            border: 2px solid #0f172a;
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0.25rem;
            box-shadow: 0 8px 16px -4px rgba(0,0,0,0.1);
          }
          .qr-mockup::after {
            content: '';
            position: absolute;
            bottom: -8px;
            width: 80px;
            height: 8px;
            background: #0f172a;
            border-radius: 2px;
          }
          .qr-stars {
            display: flex;
            gap: 2px;
            color: #fbbf24;
            font-size: 8px;
            margin-bottom: 4px;
          }
          .crm-mockup {
            width: 85%;
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            padding: 0.75rem;
            box-shadow: 0 8px 20px -8px rgba(0,0,0,0.08);
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .crm-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #f1f5f9;
          }
          .crm-badge {
            background: #ecfdf5;
            color: #047857;
            padding: 2px 6px;
            border-radius: 9999px;
            font-size: 0.65rem;
            font-weight: 600;
          }
        `}} />

        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>Everything You Get</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.25rem', color: '#0f172a', fontWeight: 800 }}>Dominate Local Search & Convert Traffic</h2>
            <p style={{ color: '#475569', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>Everything you need to automate your reputation management, display your links, and collect new booking inquiries.</p>
          </div>
          
          <div className="features-grid">
            
            {/* Spotlight Flagship Card: Google Business Management */}
            <div style={{
              gridColumn: '1 / -1',
              background: 'linear-gradient(135deg, #0b1528 0%, #0f172a 100%)',
              color: '#ffffff',
              borderRadius: '28px',
              padding: '3rem',
              boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.2)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37, 99, 235, 0.25)', color: '#93c5fd', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                  ★ Main Service Offering
                </div>
                <h3 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', color: '#ffffff' }}>
                  Done-For-You Google Business Management
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Too busy running your operations? Hand over your Google Business Profile to our local SEO team. We handle setup, weekly geo-targeted posts, citation cleanup, review responses, and continuous 3-pack optimization so local customers find and call you first.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link href="/services/google-business-management">
                    <Button variant="primary" style={{ padding: '0.85rem 1.75rem', borderRadius: '9999px', background: '#2563eb', fontWeight: 700, fontSize: '0.9375rem' }}>
                      Explore GMB Management &rarr;
                    </Button>
                  </Link>
                  <Link href="/services/google-business-management#audit-form">
                    <Button variant="secondary" style={{ padding: '0.85rem 1.75rem', borderRadius: '9999px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', fontWeight: 700, fontSize: '0.9375rem' }}>
                      Claim Free GMB Audit
                    </Button>
                  </Link>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '20px', padding: '1.75rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#60a5fa', marginBottom: '1rem' }}>
                  What Our Team Delivers Every Month:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ color: '#4ade80' }}>✓</span> 4 Weekly High-Converting Google Posts & Offers
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ color: '#4ade80' }}>✓</span> EXIF Geotagged Photos & Interior/Exterior Visuals
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ color: '#4ade80' }}>✓</span> 100% Review Responses Within 24 Hours
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ color: '#4ade80' }}>✓</span> Local Citation Building & NAP Consistency Across 50+ Directories
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ color: '#4ade80' }}>✓</span> Monthly Google Map Pack Rankings & Call Reports
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pillar 1: Business Profile */}
            <article className="feature-card">
              <div>
                <div className="feature-icon-wrapper" style={{ background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path></svg>
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.85rem', color: '#0f172a', fontWeight: 800 }}>Premium Business Profile</h3>
                <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>Establish trust instantly with a polished landing page styled to match your unique brand identity.</p>
                
                <ul className="feature-list">
                  <li className="feature-list-item">
                    <span className="feature-list-icon">✓</span> Custom cover banner, company logo, & business bio
                  </li>
                  <li className="feature-list-item">
                    <span className="feature-list-icon">✓</span> Showcase tabs for products, services, & video features
                  </li>
                  <li className="feature-list-item">
                    <span className="feature-list-icon">✓</span> Integrated location map & active business hours
                  </li>
                </ul>
              </div>

              <div className="mockup-visual">
                <div className="profile-mockup animate-fade-in">
                  <div className="profile-banner"></div>
                  <div className="profile-avatar"></div>
                  <div className="profile-bar" style={{ width: '40%', marginLeft: '10px' }}></div>
                  <div className="profile-bar" style={{ width: '70%', marginLeft: '10px', height: '6px' }}></div>
                  <div style={{ display: 'flex', gap: '0.25rem', padding: '0.5rem 10px 0 10px' }}>
                    <div style={{ width: '30%', height: '24px', background: '#f1f5f9', borderRadius: '4px' }}></div>
                    <div style={{ width: '30%', height: '24px', background: '#f1f5f9', borderRadius: '4px' }}></div>
                    <div style={{ width: '30%', height: '24px', background: '#f1f5f9', borderRadius: '4px' }}></div>
                  </div>
                </div>
              </div>
            </article>

            {/* Pillar 2: Linktree-type URL */}
            <article className="feature-card">
              <div>
                <div className="feature-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.85rem', color: '#0f172a', fontWeight: 800 }}>Linktree-Type URL Routing</h3>
                <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>Route your customers anywhere using a single, short, and highly memorable mobile bio URL.</p>
                
                <ul className="feature-list">
                  <li className="feature-list-item">
                    <span className="feature-list-icon">✓</span> Dynamic links to Instagram, Facebook, & TikTok profiles
                  </li>
                  <li className="feature-list-item">
                    <span className="feature-list-icon">✓</span> Quick-connect buttons for WhatsApp chats & phone calls
                  </li>
                  <li className="feature-list-item">
                    <span className="feature-list-icon">✓</span> Custom redirection links for appointments & menus
                  </li>
                </ul>
              </div>

              <div className="mockup-visual">
                <div className="linktree-mockup">
                  <div className="linktree-btn">👉 Visit Booking Page</div>
                  <div className="linktree-btn sec">💬 WhatsApp Chat Support</div>
                  <div className="linktree-btn" style={{ background: '#475569' }}>📸 Follow Us on Instagram</div>
                </div>
              </div>
            </article>

            {/* Pillar 3: Google AI review QR code */}
            <article className="feature-card">
              <div>
                <div className="feature-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.85rem', color: '#0f172a', fontWeight: 800 }}>Google AI Review QR Code</h3>
                <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>Automate your local review acquisition. Let customers scan, tap, and post a review in seconds.</p>
                
                <ul className="feature-list">
                  <li className="feature-list-item">
                    <span className="feature-list-icon">✓</span> Auto-generated printable tabletop QR code stand posters
                  </li>
                  <li className="feature-list-item">
                    <span className="feature-list-icon">✓</span> Smart AI review generator drafts positive reviews in 1 tap
                  </li>
                  <li className="feature-list-item">
                    <span className="feature-list-icon">✓</span> Direct routing to your official Google Maps business listing
                  </li>
                </ul>
              </div>

              <div className="mockup-visual" style={{ gap: '1.5rem' }}>
                <div className="qr-mockup">
                  <div className="qr-stars">★★★★★</div>
                  <div style={{ width: '32px', height: '32px', border: '2px solid #0f172a', padding: '2px', display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#0f172a' }}></div>
                    <div style={{ width: '12px', height: '12px', background: '#0f172a' }}></div>
                    <div style={{ width: '12px', height: '12px', background: '#0f172a' }}></div>
                    <div style={{ width: '12px', height: '12px', background: '#e2e8f0' }}></div>
                  </div>
                </div>
                <div style={{ width: '100px', height: '60px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.55rem', fontWeight: 'bold' }}>AI Draft:</div>
                  <div style={{ fontSize: '0.45rem', color: '#64748b' }}>"Amazing experience, excellent team!"</div>
                  <div style={{ fontSize: '0.5rem', color: '#3b82f6', alignSelf: 'flex-end', fontWeight: 600 }}>Tap to Copy</div>
                </div>
              </div>
            </article>

            {/* Pillar 4: Lead Form and CRM */}
            <article className="feature-card">
              <div>
                <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#10b981' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.85rem', color: '#0f172a', fontWeight: 800 }}>Lead Form & CRM Dashboard</h3>
                <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>Capture customer inquiries, customize form fields, and track hot leads in a private dashboard.</p>
                
                <ul className="feature-list">
                  <li className="feature-list-item">
                    <span className="feature-list-icon">✓</span> Fully customizable capture fields (name, email, phone, details)
                  </li>
                  <li className="feature-list-item">
                    <span className="feature-list-icon">✓</span> Real-time email and dashboard alerts for new customer submissions
                  </li>
                  <li className="feature-list-item">
                    <span className="feature-list-icon">✓</span> Private CRM leads panel to tag, organize, and export contacts
                  </li>
                </ul>
              </div>

              <div className="mockup-visual">
                <div className="crm-mockup">
                  <div className="crm-row">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>John Doe</span>
                      <span style={{ fontSize: '0.55rem', color: '#64748b' }}>Dental Booking Request</span>
                    </div>
                    <span className="crm-badge">New Lead</span>
                  </div>
                  <div className="crm-row" style={{ border: 'none', paddingBottom: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Jane Smith</span>
                      <span style={{ fontSize: '0.55rem', color: '#64748b' }}>Inquiry about pricing</span>
                    </div>
                    <span className="crm-badge" style={{ background: '#fef3c7', color: '#d97706' }}>Contacted</span>
                  </div>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* DEMO VIDEO SECTION */}
      <section style={{ padding: '6rem 1.5rem', background: '#ffffff', borderBottom: '1px solid #f1f5f9', borderTop: '1px solid #f1f5f9' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 800 }}>See How It Works</h2>
            <p style={{ color: '#475569', fontSize: '1.125rem', maxWidth: '650px', margin: '0 auto' }}>Watch this quick video to see a walkthrough of our dashboard and how to get started in minutes.</p>
          </div>

          <div style={{ 
            width: '100%', 
            maxWidth: '800px', 
            aspectRatio: '16/9', 
            borderRadius: '24px', 
            overflow: 'hidden', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            border: '8px solid #f8fafc',
            background: '#000'
          }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/XQyWw0pn85U"
              title="MyRevLink Product Walkthrough & Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '4rem 1.5rem 8rem 1.5rem', background: '#ffffff' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem', color: '#0f172a', fontWeight: 800 }}>How It Works</h2>
          <p style={{ color: '#475569', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 4rem auto', textAlign: 'center' }}>Set up your profile in minutes and start converting customers into reviews immediately.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '2.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
              <div style={{ background: '#3b82f6', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>1</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>Create Your Link</h3>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>Claim your unique URL (e.g., myrevlink.in/b/acme) and add your business details in our simple dashboard.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '2.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
              <div style={{ background: '#3b82f6', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>2</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>Share with Customers</h3>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>Put your auto-generated QR code on your counter, or text your link to customers after a successful job.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '2.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
              <div style={{ background: '#3b82f6', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>3</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>Reviews Pour In</h3>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>Customers tap a star, our AI writes a personalized review for them, and they paste it to Google instantly.</p>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section style={{ padding: '8rem 1.5rem', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', borderBottom: '1px solid #f1f5f9', position: 'relative' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .testimonial-card {
            background: #ffffff;
            padding: 3rem 2.25rem;
            border-radius: 28px;
            box-shadow: 0 10px 30px -15px rgba(0,0,0,0.04);
            border: 1px solid #f1f5f9;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .testimonial-card:hover {
            transform: translateY(-8px);
            border-color: rgba(59, 130, 246, 0.25);
            box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.08);
          }
          .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 3rem;
            width: 100%;
            max-width: 900px;
            align-items: stretch;
            margin-top: 4rem;
          }
          .pricing-card {
            background: white;
            border-radius: 28px;
            box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.04);
            border: 1px solid #e2e8f0;
            padding: 3.5rem 2.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .pricing-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
          }
          .pricing-card.popular {
            border: 2.5px solid #3b82f6;
            box-shadow: 0 20px 40px -15px rgba(59, 130, 246, 0.15);
          }
          .pricing-card.popular:hover {
            box-shadow: 0 30px 60px -15px rgba(59, 130, 246, 0.22);
          }
          .avatar-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            font-weight: bold;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }
        `}} />
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>Success Stories</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.25rem', color: '#0f172a', fontWeight: 800 }}>Loved by Local Businesses</h2>
            <p style={{ color: '#475569', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>See how business owners are using MyRevLink to automate reviews and rank higher in local search.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            
            {/* Testimonial 1 */}
            <div className="testimonial-card">
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#fbbf24', marginBottom: '1.25rem', fontSize: '1.15rem' }}>★★★★★</div>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '1rem', fontStyle: 'italic', marginBottom: '2rem' }}>
                  "Before MyRevLink, we'd ask patients for reviews and they'd say yes but forget. Now, they scan the counter QR code at checkout, the AI writes the draft, and they post it in 10 seconds. We've gone from 45 reviews to over 180 in just 2 months!"
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                <div className="avatar-circle" style={{ background: '#eff6ff', color: '#3b82f6' }}>🦷</div>
                <div>
                  <h4 style={{ margin: 0, color: '#0f172a', fontWeight: 800, fontSize: '1rem' }}>Dr. Amit Patel</h4>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Apex Dental Clinic</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card">
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#fbbf24', marginBottom: '1.25rem', fontSize: '1.15rem' }}>★★★★★</div>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '1rem', fontStyle: 'italic', marginBottom: '2rem' }}>
                  "The table tents with our review QR code have changed the game. Guests love reading the AI-generated suggestions, and our weekend bookings have tripled because our local maps rank went from #7 to #2."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                <div className="avatar-circle" style={{ background: '#fef3c7', color: '#d97706' }}>🍔</div>
                <div>
                  <h4 style={{ margin: 0, color: '#0f172a', fontWeight: 800, fontSize: '1rem' }}>Rahul Sharma</h4>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>The Urban Bistro</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card">
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#fbbf24', marginBottom: '1.25rem', fontSize: '1.15rem' }}>★★★★★</div>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '1rem', fontStyle: 'italic', marginBottom: '2rem' }}>
                  "Paying monthly fees for Podium was eating into our margins. MyRevLink's monthly Pro plan is incredibly affordable and is the best investment we've ever made. The profile page also lets us link our Fresha booking system directly."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                <div className="avatar-circle" style={{ background: '#f3e8ff', color: '#8b5cf6' }}>✂️</div>
                <div>
                  <h4 style={{ margin: 0, color: '#0f172a', fontWeight: 800, fontSize: '1rem' }}>Priya Sen</h4>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Glow Salon & Spa</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" style={{ padding: '8rem 1.5rem', position: 'relative', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', borderBottom: '1px solid #f1f5f9' }}>
        <div className="container flex-col flex-center" style={{ textAlign: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>Plans & Pricing</span>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.25rem', color: '#0f172a', fontWeight: 800 }}>Simple, Flexible Pricing</h2>
          <p style={{ color: '#475569', fontSize: '1.125rem', maxWidth: '600px', lineHeight: 1.6 }}>
            Choose the plan that fits your business. Start free, upgrade to Pro when you need unlimited scale.
          </p>
          
          <div className="pricing-grid">
            {/* Free Plan Card */}
            <div className="pricing-card">
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 800 }}>Free Plan</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2.5rem' }}>Perfect to get started.</p>
                
                <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '2.5rem', color: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.75rem', marginTop: '0.25rem', fontWeight: 600 }}>{priceSymbol}</span>0<span style={{ fontSize: '1rem', color: '#64748b', alignSelf: 'flex-end', marginBottom: '0.75rem', marginLeft: '0.25rem', fontWeight: 500 }}>/mo</span>
                </div>
                
                <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: '0 0 3rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>Custom myrevlink.in/b/ URL</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>7 AI Review Generations</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>7 Leads & Inquiries Inbox</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>Basic Contact Form Integration</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>Printable QR Code Poster</span></li>
                </ul>
              </div>
              
              <Link href="/sign-up" style={{ width: '100%', display: 'block' }}>
                <Button variant="secondary" style={{ width: '100%', padding: '1.1rem', fontSize: '0.95rem', borderRadius: '12px', fontWeight: 700, border: '1px solid #cbd5e1' }}>Get Started Free</Button>
              </Link>
            </div>

            {/* Pro Plan Card */}
            <div className="pricing-card popular">
              {/* Promo Ribbon */}
              <div style={{ 
                position: 'absolute', 
                top: '0', 
                left: '50%', 
                transform: 'translateX(-50%) translateY(-50%)',
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', 
                color: 'white', 
                padding: '0.45rem 1.5rem', 
                fontSize: '0.75rem', 
                fontWeight: 800, 
                borderRadius: '9999px',
                boxShadow: '0 4px 10px rgba(59,130,246,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Recommended
              </div>

              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 800 }}>Pro Plan</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2.5rem' }}>Scale your review pipeline.</p>
                
                <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '2.5rem', color: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.75rem', marginTop: '0.25rem', fontWeight: 600 }}>{priceSymbol}</span>{priceAmount}<span style={{ fontSize: '1rem', color: '#64748b', alignSelf: 'flex-end', marginBottom: '0.75rem', marginLeft: '0.25rem', fontWeight: 500 }}>/mo</span>
                </div>
                
                <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: '0 0 3rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: 700 }}>Unlimited AI Review Generations</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: 700 }}>Unlimited Leads & Inquiries</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>Custom Title, Button & Success Message</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>Required Field Choices (Email/Phone)</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>Custom Branding & Color Gradients</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>Showcase Sections (Videos, Apps, Products)</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>AI Draft Auto-Optimization</span></li>
                </ul>
              </div>
              
              <Link href="/sign-up" style={{ width: '100%', display: 'block' }}>
                <Button variant="primary" style={{ width: '100%', padding: '1.1rem', fontSize: '0.95rem', borderRadius: '12px', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', border: 'none', fontWeight: 700, boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>Upgrade to Pro</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" style={{ background: '#f8fafc', padding: '8rem 0', borderTop: '1px solid #f1f5f9' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .faq-accordion {
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }
          .faq-item {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.02);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .faq-item[open] {
            border-color: #3b82f6;
            box-shadow: 0 15px 30px -10px rgba(59, 130, 246, 0.1);
          }
          .faq-summary {
            padding: 1.5rem 2rem;
            font-weight: 700;
            color: #0f172a;
            cursor: pointer;
            list-style: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            font-size: 1.1rem;
            transition: color 0.2s ease;
          }
          .faq-summary::-webkit-details-marker {
            display: none;
          }
          .faq-summary:hover {
            color: #2563eb;
          }
          .faq-summary::after {
            content: '+';
            font-size: 1.5rem;
            font-weight: 500;
            color: #64748b;
            transition: transform 0.3s ease;
          }
          .faq-item[open] .faq-summary::after {
            content: '−';
            color: #3b82f6;
          }
          .faq-content {
            padding: 0 2rem 1.75rem 2rem;
            color: #475569;
            line-height: 1.6;
            font-size: 0.975rem;
            border-top: 1px solid #f1f5f9;
            padding-top: 1.25rem;
          }
        `}} />

        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 800 }}>Frequently Asked Questions</h2>
            <p style={{ color: '#475569', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>Everything you need to know about MyRevLink.</p>
          </div>
          
          <div className="faq-accordion">
            
            {/* FAQ 1 */}
            <details className="faq-item">
              <summary className="faq-summary">Do my customers need an app to use this?</summary>
              <div className="faq-content">
                No! MyRevLink works entirely in the web browser. When customers scan your QR code or click your link, it opens instantly on their phone without any downloads required.
              </div>
            </details>

            {/* FAQ 2 */}
            <details className="faq-item">
              <summary className="faq-summary">How does the AI know what to write?</summary>
              <div className="faq-content">
                The AI uses the specific "Business Description" you provide in your dashboard. It combines this context with the star rating the user selects to write a natural, highly relevant review that matches your business offerings.
              </div>
            </details>

            {/* FAQ 3 */}
            <details className="faq-item">
              <summary className="faq-summary">How does the Customer Leads & Booking CRM work?</summary>
              <div className="faq-content">
                Business owners can display a clean, glassmorphic contact form on their public profile page to collect inquiries. You can customize the form titles, button text, success messages, and choose required fields (Email, Phone, or both). All submissions are saved directly to your private Leads dashboard where you can customize pipeline stages (e.g. New, Contacted, Accepted, Rejected) and change lead statuses.
              </div>
            </details>

            {/* FAQ 4 */}
            <details className="faq-item">
              <summary className="faq-summary">How do I generate a printable Google Review QR code poster?</summary>
              <div className="faq-content">
                Use our Free Google Review QR Poster Generator in the top "Tools" menu. Input your business name, customize the theme color to match your storefront, and generate a printable A4 counter poster. Customers can scan the QR code to write reviews instantly.
              </div>
            </details>

            {/* FAQ 5 */}
            <details className="faq-item">
              <summary className="faq-summary">Can I create a free digital business card?</summary>
              <div className="faq-content">
                Yes! We offer a Free Digital Business Card creator. You can choose from 5 beautiful layouts (Classic, Creator, Elegant, Minimalist, Neon), enter your phone, email, and social links, and download/share the card for free to start sharing your profile contact details instantly.
              </div>
            </details>

            {/* FAQ 6 */}
            <details className="faq-item">
              <summary className="faq-summary">Is this a monthly subscription?</summary>
              <div className="faq-content">
                We offer a Free Plan with basic features (including 7 initial AI review credits and 7 customer leads capture) and a premium Pro Plan with monthly subscription recurring options of {priceSymbol}{priceAmount}/mo for unlimited reviews, leads, advanced customizations, branding colors, and showcase sliders.
              </div>
            </details>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
