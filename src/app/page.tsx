import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      
      {/* HEADER / NAVBAR */}
      <header className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="MyRevLink Logo" width={28} height={28} style={{ objectFit: 'contain' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#172554' }}>MyRevLink</span>
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }} className="hidden sm:flex">
          <Link href="#features">Features</Link>
          <Link href="#how-it-works">How it Works</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#faq">FAQ</Link>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/sign-in" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Login</Link>
          <Link href="/sign-up">
            <Button variant="primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem', borderRadius: '8px', background: '#1d4ed8' }}>Get Started</Button>
          </Link>
        </div>
      </header>
      
      {/* 
        HERO SECTION 
        Modernized with a split-screen design matching Mockup #2
      */}
      <section style={{ position: 'relative', padding: '12rem 1.5rem 6rem 1.5rem', overflow: 'hidden', background: 'linear-gradient(135deg, #eff4ff 0%, #ffffff 100%)' }}>
        <div className="container hero-grid" style={{ position: 'relative', zIndex: 1 }}>
          
          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            
            {/* Trust Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e0e7ff', color: '#3730a3', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Trusted by 2,000+ local businesses
            </div>

            {/* Promo Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef3c7', color: '#d97706', padding: '0.6rem 1.25rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.5rem', border: '1px solid #fde68a' }}>
              🔥 Launch Offer: First 15 customers get lifetime access for just $20! (Save 33%)
            </div>

            <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0f172a', fontWeight: 800 }}>
              Turn Happy Customers into <span style={{ color: '#2563eb' }}>5-Star Reviews</span>, Automatically.
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#475569', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '95%' }}>
              MyRevLink helps businesses collect more genuine Google reviews with smart review pages, AI-generated response drafts, and counter-ready QR codes.
            </p>

            <div className="hero-grid-buttons" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', width: '100%', marginBottom: '1.5rem' }}>
              <Link href="/sign-up">
                <Button variant="primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1rem', borderRadius: '8px', background: '#3b82f6', border: 'none', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}>Get Started for $20</Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="secondary" style={{ padding: '1.25rem 2rem', fontSize: '1rem', borderRadius: '8px', background: 'transparent', border: '2px solid #3b82f6', color: '#3b82f6', fontWeight: 600 }}>
                  See How it Works
                </Button>
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', color: '#475569', fontSize: '0.875rem', fontWeight: 500 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                One-time payment
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Lifetime access
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '24px', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
              width: '100%',
              maxWidth: '650px',
              border: '1px solid #f8fafc'
            }}>
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

      {/* FEATURES SECTION */}
      <section id="features" style={{ background: '#f8fafc', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 800 }}>Dominate Local Search</h2>
            <p style={{ color: '#475569', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>Everything you need to automate your reputation management and climb the Google Maps rankings without monthly fees.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            
            <article style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: '1.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 800 }}>AI-Powered<br/>Reviews</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>Our AI writes highly tailored, SEO-optimized reviews based on your specific business description so you rank higher automatically.</p>
            </article>

            <article style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', background: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333ea', marginBottom: '1.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 800 }}>Linktree-Style<br/>Profile</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>Get a beautifully designed, mobile-first profile page to showcase your Instagram, Facebook, Maps, WhatsApp, and Booking links.</p>
            </article>

            <article style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: '1.5rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 800 }}>Counter-Ready<br/>QR Codes</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>Automatically generate a scannable QR code for your counter. Customers scan, tap, and post their review before they even leave your store.</p>
            </article>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '8rem 1.5rem', background: '#ffffff' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem', color: '#0f172a', fontWeight: 800 }}>How It Works</h2>
          <p style={{ color: '#475569', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 4rem auto', textAlign: 'center' }}>Set up your profile in minutes and start converting customers into reviews immediately.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '2.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
              <div style={{ background: '#3b82f6', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>1</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>Create Your Link</h3>
              <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>Claim your unique URL (e.g., myrevlink.com/b/acme) and add your business details in our simple dashboard.</p>
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

      {/* FAQ SECTION */}
      <section id="faq" style={{ background: '#f8fafc', padding: '8rem 0', borderTop: '1px solid #f1f5f9' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem', color: '#0f172a', fontWeight: 800 }}>Frequently Asked Questions</h2>
          <p style={{ color: '#475569', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 4rem auto', textAlign: 'center' }}>Everything you need to know about MyRevLink.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            
            <div style={{ padding: '2rem', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>Do my customers need an app to use this?</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>No! MyRevLink works entirely in the web browser. When customers scan your QR code or click your link, it opens instantly on their phone without any downloads required.</p>
            </div>

            <div style={{ padding: '2rem', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>How does the AI know what to write?</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>The AI uses the specific "Business Description" you provide in your dashboard. It combines this context with the star rating the user selects to write a natural, highly relevant review.</p>
            </div>

            <div style={{ padding: '2rem', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>Is this a monthly subscription?</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>No, we believe in simple pricing. You pay a one-time fee of $20 (launch promo) and gain lifetime access to your custom link, unlimited AI generations, and your dashboard.</p>
            </div>

            <div style={{ padding: '2rem', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700 }}>Can I link my other social media?</h3>
              <p style={{ color: '#475569', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>Absolutely. Your public profile acts as a digital business card. You can add links to your Instagram, Facebook, X (Twitter), YouTube, WhatsApp, and Booking page.</p>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" style={{ padding: '8rem 0', position: 'relative', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        <div className="container flex-col flex-center" style={{ textAlign: 'center', alignItems: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a', fontWeight: 800 }}>Simple, Honest Pricing</h2>
          <p style={{ color: '#475569', fontSize: '1.125rem', marginBottom: '4rem', maxWidth: '500px' }}>No monthly subscriptions. No hidden fees. Pay once and keep your business link forever.</p>
          
          <div style={{ 
            maxWidth: '440px', 
            width: '100%', 
            background: 'white', 
            borderRadius: '28px', 
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08)', 
            border: '1px solid #e2e8f0', 
            padding: '3rem', 
            position: 'relative', 
            overflow: 'hidden' 
          }}>
            {/* Promo Ribbon */}
            <div style={{ 
              position: 'absolute', 
              top: '20px', 
              right: '-40px', 
              background: '#e11d48', 
              color: 'white', 
              padding: '0.5rem 3rem', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              transform: 'rotate(45deg)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              $20 ONLY
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: '#3b82f6' }} />
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700 }}>Lifetime License</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>Every feature included, forever.</p>
            
            <div style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '2rem', marginTop: '0.5rem', fontWeight: 600 }}>$</span>20
            </div>
            <p style={{ color: '#e11d48', fontSize: '0.875rem', fontWeight: 700, marginBottom: '2rem' }}>*Promo price for first 15 customers</p>
            
            <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>Custom myrevlink.com/b/ URL</span></li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>Unlimited AI Review Generations</span></li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>Printable QR Code</span></li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>Social & WhatsApp Integrations</span></li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> <span style={{ color: '#334155', fontSize: '0.95rem' }}>Forever Access</span></li>
            </ul>
            <Link href="/sign-up" style={{ width: '100%', display: 'block' }}>
              <Button variant="primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1rem', borderRadius: '12px', background: '#3b82f6', border: 'none', fontWeight: 700, boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>Get Lifetime Access</Button>
            </Link>
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
