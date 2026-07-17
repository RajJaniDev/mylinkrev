import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";

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
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }} className="hidden sm:flex">
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
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.15rem', fontWeight: 400 }}>Printable A4 QR codes for just $5</div>
              </Link>
              <Link href="/tools/digital-business-card" className="nav-dropdown-item">
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)' }}>Digital Business Card</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.15rem', fontWeight: 400 }}>Create & download cards for free</div>
              </Link>
            </div>
          </div>

          <Link href="#pricing">Pricing</Link>
          <Link href="#faq">FAQ</Link>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/demo" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563eb' }}>View Demo</Link>
          <Link href="/sign-in" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Login</Link>
          <Link href="/sign-up">
            <Button variant="primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem', borderRadius: '8px', background: '#1d4ed8' }}>Get Started</Button>
          </Link>
        </div>
      </header>
      
      {/* HERO SECTION */}
      <section style={{ position: 'relative', padding: '12rem 1.5rem 6rem 1.5rem', overflow: 'hidden', background: 'linear-gradient(135deg, #eff4ff 0%, #ffffff 100%)' }}>
        <div className="container hero-grid" style={{ position: 'relative', zIndex: 1 }}>
          
          {/* LEFT COLUMN */}
          <div className="hero-content">
            
            {/* Product Hunt Badge */}
            <div style={{ marginBottom: '1.25rem' }}>
              <a href="https://www.producthunt.com/products/myrevlink?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-myrevlink" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1185494&theme=light&t=1782982543541" 
                  alt="MyRevLink - Turn Happy Customers into 5-Star Reviews, Automatically | Product Hunt" 
                  style={{ width: '250px', height: '54px' }} 
                  width="250" 
                  height="54" 
                />
              </a>
            </div>

            {/* Trust Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e0e7ff', color: '#3730a3', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Trusted by 2,000+ local businesses
            </div>

            {/* Promo Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef3c7', color: '#d97706', padding: '0.6rem 1.25rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.5rem', border: '1px solid #fde68a' }}>
              🔥 Try it for free today! Get 7 review draft credits immediately upon sign up.
            </div>

            <h1 className="hero-title">
              Your Customers Say <span style={{ color: '#2563eb' }}>"Yes, I'll Leave a Review"</span> — Then Never Do.
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#475569', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '95%' }}>
              MyRevLink writes the review for them. They just pick a star rating, tap, and paste. Takes 10 seconds, not 10 minutes.
            </p>

            <div className="hero-grid-buttons" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', width: '100%', marginBottom: '1.5rem' }}>
              <Link href="/sign-up">
                <Button variant="primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1rem', borderRadius: '8px', background: '#3b82f6', border: 'none', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}>Get Started Free</Button>
              </Link>
              <Link href="/demo">
                <Button variant="secondary" style={{ padding: '1.25rem 2.5rem', fontSize: '1rem', borderRadius: '8px', background: 'transparent', border: '2px solid #3b82f6', color: '#3b82f6', fontWeight: 600 }}>
                  View Demo
                </Button>
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', color: '#475569', fontSize: '0.875rem', fontWeight: 500 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                No Credit Card Required
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Start for Free
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <div className="mockup-card">
              <Image 
                src="/revire_with_qr.png" 
                alt="MyRevLink App Mockup" 
                width={800} 
                height={800} 
                style={{ width: '100%', height: 'auto', borderRadius: '12px', objectFit: 'cover' }}
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* TRUST BANNER */}
      <div style={{ width: '100%', padding: '4rem 1.5rem', background: 'transparent', borderBottom: '1px solid #f1f5f9' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '3rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            <span style={{ fontWeight: 700, fontSize: '1.3rem', color: '#6b7280' }}>More 5-Star Reviews</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span style={{ fontWeight: 700, fontSize: '1.3rem', color: '#6b7280' }}>Better Local SEO</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span style={{ fontWeight: 700, fontSize: '1.3rem', color: '#6b7280' }}>100% Google Compliant</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            <span style={{ fontWeight: 700, fontSize: '1.3rem', color: '#6b7280' }}>Instant Setup</span>
          </div>

        </div>
      </div>

      {/* DEMO VIDEO SECTION */}
      <section style={{ padding: '6rem 1.5rem', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
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

      {/* FEATURES SECTION */}
      <section id="features" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', padding: '8rem 0 4rem 0', position: 'relative' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 2.25rem;
            width: 100%;
            max-width: 1100px;
            margin: 0 auto;
          }
          .feature-card {
            background: #ffffff;
            padding: 3rem 2.25rem;
            border-radius: 28px;
            border: 1px solid #f1f5f9;
            box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.04);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            cursor: default;
          }
          .feature-card:hover {
            transform: translateY(-8px);
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
            margin-bottom: 2rem;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .feature-card:hover .feature-icon-wrapper {
            transform: scale(1.1) rotate(3deg);
          }
        `}} />

        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>Key Capabilities</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.25rem', color: '#0f172a', fontWeight: 800 }}>Dominate Local Search</h2>
            <p style={{ color: '#475569', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>Everything you need to automate your reputation management and climb the Google Maps rankings.</p>
          </div>
          
          <div className="features-grid">
            
            {/* Feature 1 */}
            <article className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.85rem', color: '#0f172a', fontWeight: 800 }}>AI-Powered Reviews</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>Our AI writes highly tailored, SEO-optimized reviews based on your specific business description so you rank higher automatically.</p>
            </article>

            {/* Feature 2 */}
            <article className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.85rem', color: '#0f172a', fontWeight: 800 }}>Linktree-Style Profile</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>Get a beautifully designed, mobile-first profile page to showcase your Instagram, Facebook, Maps, WhatsApp, and Booking links.</p>
            </article>

            {/* Feature 3 */}
            <article className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.85rem', color: '#0f172a', fontWeight: 800 }}>Counter-Ready QR Codes</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>Automatically generate a scannable QR code for your counter. Customers scan, tap, and post their review before they even leave your store.</p>
            </article>

            {/* Feature 4 */}
            <article className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#10b981' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.85rem', color: '#0f172a', fontWeight: 800 }}>Leads & Booking CRM</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>Capture customer contact inquiries directly from your profile page. Customize form fields, set validations, and organize leads dynamically in your private CRM dashboard.</p>
            </article>

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
      <section style={{ padding: '6rem 1.5rem', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', borderBottom: '1px solid #f1f5f9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 800 }}>Loved by Local Businesses</h2>
            <p style={{ color: '#475569', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>See how business owners are using MyRevLink to boost their Google reviews and attract more customers.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#f59e0b', marginBottom: '1rem', fontSize: '1.25rem' }}>★★★★★</div>
                <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '1rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "Before MyRevLink, we'd ask patients for reviews and they'd say yes but forget. Now, they scan the counter QR code at checkout, the AI writes the draft, and they post it in 10 seconds. We've gone from 45 reviews to over 180 in just 2 months!"
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>🦷</div>
                <div>
                  <h4 style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>Dr. Amit Patel</h4>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Apex Dental Clinic</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#f59e0b', marginBottom: '1rem', fontSize: '1.25rem' }}>★★★★★</div>
                <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '1rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "The table tents with our review QR code have changed the game. Guests love reading the AI-generated suggestions, and our weekend bookings have tripled because our local maps rank went from #7 to #2."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>🍔</div>
                <div>
                  <h4 style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>Rahul Sharma</h4>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>The Urban Bistro</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#f59e0b', marginBottom: '1rem', fontSize: '1.25rem' }}>★★★★★</div>
                <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '1rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "Paying monthly fees for Podium was eating into our margins. MyRevLink's monthly Pro plan is incredibly affordable and is the best investment we've ever made. The profile page also lets us link our Fresha booking system directly."
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>✂️</div>
                <div>
                  <h4 style={{ margin: 0, color: '#0f172a', fontWeight: 700 }}>Priya Sen</h4>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Glow Salon & Spa</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING SECTION (Positioned after Loved by Local Businesses) */}
      <section id="pricing" style={{ padding: '8rem 0', position: 'relative', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', borderBottom: '1px solid #f1f5f9' }}>
        <div className="container flex-col flex-center" style={{ textAlign: 'center', alignItems: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 800 }}>Simple, Flexible Pricing</h2>
          <p style={{ color: '#475569', fontSize: '1.125rem', marginBottom: '4rem', maxWidth: '600px' }}>
            Choose the plan that fits your business. Start free, upgrade to Pro when you need unlimited scale.
          </p>
          
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2.5rem",
            width: "100%",
            maxWidth: "880px",
            alignItems: "stretch"
          }}>
            {/* Free Plan Card */}
            <div style={{
              background: 'white', 
              borderRadius: '24px', 
              boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.04)', 
              border: '1px solid #e2e8f0', 
              padding: '3rem 2.25rem', 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>Free Plan</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>Perfect to get started.</p>
                
                <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.75rem', marginTop: '0.25rem', fontWeight: 600 }}>{priceSymbol}</span>0<span style={{ fontSize: '1rem', color: '#64748b', alignSelf: 'flex-end', marginBottom: '0.75rem', marginLeft: '0.25rem', fontWeight: 500 }}>/mo</span>
                </div>
                
                <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
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
            <div style={{
              background: 'white', 
              borderRadius: '24px', 
              boxShadow: '0 20px 40px -15px rgba(59, 130, 246, 0.12)', 
              border: '2px solid #3b82f6', 
              padding: '3rem 2.25rem', 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              transform: 'scale(1.02)'
            }}>
              {/* Promo Ribbon */}
              <div style={{ 
                position: 'absolute', 
                top: '0', 
                left: '50%', 
                transform: 'translateX(-50%) translateY(-50%)',
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', 
                color: 'white', 
                padding: '0.35rem 1.25rem', 
                fontSize: '0.75rem', 
                fontWeight: 800, 
                borderRadius: '9999px',
                boxShadow: '0 4px 10px rgba(59,130,246,0.25)',
                textTransform: 'uppercase'
              }}>
                Recommended
              </div>

              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>Pro Plan</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>Scale your review pipeline.</p>
                
                <div style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.75rem', marginTop: '0.25rem', fontWeight: 600 }}>{priceSymbol}</span>{priceAmount}<span style={{ fontSize: '1rem', color: '#64748b', alignSelf: 'flex-end', marginBottom: '0.75rem', marginLeft: '0.25rem', fontWeight: 500 }}>/mo</span>
                </div>
                
                <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: 600 }}>Unlimited AI Review Generations</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: 600 }}>Unlimited Leads & Inquiries</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>Custom Title, Button & Success Message</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#334155', fontSize: '0.95rem' }}>Required Field Choices (Email/Phone)</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#334155', fontSize: '0.95rem' }}>Custom Branding & Color Gradients</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#334155', fontSize: '0.95rem' }}>Showcase Sections (Videos, Apps, Products)</span></li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#334155', fontSize: '0.95rem' }}>AI Draft Auto-Optimization for Positive Ratings</span></li>
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
      <footer style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <div className="container" style={{ padding: '5rem 1.5rem 4rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Image src="/logo.png" alt="MyRevLink Logo" width={28} height={28} style={{ objectFit: 'contain' }} />
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 'bold', margin: 0 }}>MyRevLink</h3>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '280px' }}>Empowering local businesses with AI-driven Google Reviews and beautiful digital profiles.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.25rem', color: '#0f172a', fontSize: '0.95rem', fontWeight: 700 }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="#pricing" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Pricing</Link>
              <Link href="/sign-in" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Login</Link>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.25rem', color: '#0f172a', fontSize: '0.95rem', fontWeight: 700 }}>Industries</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '240px' }}>
              <Link href="/industries/dentists" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Dentists</Link>
              <Link href="/industries/restaurants" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Restaurants</Link>
              <Link href="/industries/real-estate" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Real Estate</Link>
              <Link href="/industries/hair-salons" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Hair Salons</Link>
              <Link href="/industries/plumbers" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Plumbers</Link>
              <Link href="/industries/gyms" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Gyms</Link>
              <Link href="/industries/lawyers" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Lawyers</Link>
              <Link href="/industries/contractors" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Contractors</Link>
              <Link href="/industries/doctors" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Doctors</Link>
              <Link href="/industries/hotels" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Hotels</Link>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.25rem', color: '#0f172a', fontSize: '0.95rem', fontWeight: 700 }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/about-us" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>About Us</Link>
              <Link href="/contact-us" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Contact Us</Link>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.25rem', color: '#0f172a', fontSize: '0.95rem', fontWeight: 700 }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/privacy-policy" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="/terms-and-conditions" style={{ color: '#475569', fontSize: '0.875rem', textDecoration: 'none' }}>Terms & Conditions</Link>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} MyRevLink. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
