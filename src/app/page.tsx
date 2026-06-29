import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      
      {/* 
        HERO SECTION 
        Modernized with a glowing ambient background behind the text.
      */}
      <section style={{ position: 'relative', padding: '8rem 1.5rem', textAlign: 'center', overflow: 'hidden' }}>
        {/* Ambient Glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '80vw', height: '80vw', maxWidth: '800px', maxHeight: '800px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.05) 50%, transparent 70%)',
          zIndex: -1, pointerEvents: 'none'
        }} />

        <div className="container flex-col flex-center" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', 
            padding: '0.5rem 1.25rem', borderRadius: '2rem', marginBottom: '2rem', 
            fontWeight: 600, fontSize: '0.875rem', border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)'
          }}>
            ✨ The #1 Tool for Local Businesses
          </div>
          <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', maxWidth: '900px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Skyrocket Your Google Reviews with <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 2px 4px rgba(139,92,246,0.2))' }}>AI Magic</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--secondary-foreground)', maxWidth: '650px', marginBottom: '3rem', lineHeight: 1.6 }}>
            Stop begging for reviews. Get a beautifully designed, mobile-friendly profile that lets your customers generate perfect, SEO-friendly 5-star reviews in just one tap.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/sign-up">
              <Button variant="primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)' }}>Get Started for $30</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>Login to Dashboard</Button>
            </Link>
          </div>
          <p style={{ marginTop: '1.5rem', color: 'var(--muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            One-time payment. Lifetime access.
          </p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Dominate Local Search</h2>
            <p style={{ color: 'var(--secondary-foreground)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>Everything you need to automate your reputation management and climb the Google Maps rankings.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <article className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '2.5rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <span style={{ fontSize: '2rem' }}>🤖</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>AI-Powered Reviews</h3>
              <p style={{ color: 'var(--secondary-foreground)', lineHeight: 1.6 }}>Our AI writes highly tailored, SEO-optimized reviews based on your specific business description so you rank higher automatically.</p>
            </article>

            <article className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '2.5rem', transition: 'transform 0.3s ease' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <span style={{ fontSize: '2rem' }}>📱</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Linktree-Style Profile</h3>
              <p style={{ color: 'var(--secondary-foreground)', lineHeight: 1.6 }}>Get a beautifully designed, mobile-first profile page to showcase your Instagram, Facebook, Maps, WhatsApp, and Booking links.</p>
            </article>

            <article className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '2.5rem', transition: 'transform 0.3s ease' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '2rem' }}>🖨️</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Counter-Ready QR Codes</h3>
              <p style={{ color: 'var(--secondary-foreground)', lineHeight: 1.6 }}>Automatically generate a scannable QR code for your counter. Customers scan, tap, and post their review before they even leave your store.</p>
            </article>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container" style={{ padding: '8rem 1.5rem' }}>
        <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem' }}>How It Works</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          
          <div className="glass-card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', padding: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 'bold', flexShrink: 0, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>1</div>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create Your Custom Link</h3>
              <p style={{ color: 'var(--secondary-foreground)', margin: 0, fontSize: '1.125rem' }}>Claim your unique URL (e.g., myrevlink.com/b/acme) and add your business details in our simple dashboard.</p>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', padding: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 'bold', flexShrink: 0, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>2</div>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Share with Customers</h3>
              <p style={{ color: 'var(--secondary-foreground)', margin: 0, fontSize: '1.125rem' }}>Put your auto-generated QR code on your counter, or text your link to customers after a successful job.</p>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', padding: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 'bold', flexShrink: 0, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>3</div>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Watch the Reviews Pour In</h3>
              <p style={{ color: 'var(--secondary-foreground)', margin: 0, fontSize: '1.125rem' }}>Customers tap a star, our AI writes a personalized review for them, and they paste it to Google instantly.</p>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ background: 'rgba(59, 130, 246, 0.02)', padding: '8rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--foreground)' }}>Do my customers need an app to use this?</h3>
              <p style={{ color: 'var(--secondary-foreground)', lineHeight: 1.6, margin: 0 }}>No! MyRevLink works entirely in the web browser. When customers scan your QR code or click your link, it opens instantly on their phone without any downloads required.</p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--foreground)' }}>How does the AI know what to write?</h3>
              <p style={{ color: 'var(--secondary-foreground)', lineHeight: 1.6, margin: 0 }}>The AI uses the specific "Business Description" you provide in your dashboard. It combines this context with the star rating the user selects to write a natural, highly relevant review.</p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--foreground)' }}>Is this a monthly subscription?</h3>
              <p style={{ color: 'var(--secondary-foreground)', lineHeight: 1.6, margin: 0 }}>No, we believe in simple pricing. You pay a one-time fee of $30 and gain lifetime access to your custom link, unlimited AI generations, and your dashboard.</p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--foreground)' }}>Can I link my other social media?</h3>
              <p style={{ color: 'var(--secondary-foreground)', lineHeight: 1.6, margin: 0 }}>Absolutely. Your public profile acts as a digital business card. You can add links to your Instagram, Facebook, X (Twitter), YouTube, WhatsApp, and Booking page.</p>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section style={{ padding: '8rem 0', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '60vw', height: '60vw', maxWidth: '600px', maxHeight: '600px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 60%)',
          zIndex: -1, pointerEvents: 'none'
        }} />
        <div className="container flex-col flex-center" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Simple, Honest Pricing</h2>
          <p style={{ color: 'var(--secondary-foreground)', fontSize: '1.125rem', marginBottom: '3rem', maxWidth: '500px' }}>No monthly subscriptions. No hidden fees. Pay once and keep your business link forever.</p>
          
          <div className="glass-card" style={{ maxWidth: '400px', width: '100%', border: '2px solid rgba(59, 130, 246, 0.5)', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(to right, var(--primary), var(--accent))' }} />
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--foreground)' }}>Lifetime License</h3>
            <div style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '2rem', color: 'var(--foreground)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '2rem', marginTop: '0.5rem' }}>$</span>30
            </div>
            <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981' }}>✓</span> <span style={{ color: 'var(--secondary-foreground)' }}>Custom myrevlink.com/b/ URL</span></li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981' }}>✓</span> <span style={{ color: 'var(--secondary-foreground)' }}>Unlimited AI Review Generations</span></li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981' }}>✓</span> <span style={{ color: 'var(--secondary-foreground)' }}>Printable QR Code</span></li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981' }}>✓</span> <span style={{ color: 'var(--secondary-foreground)' }}>Social & WhatsApp Integrations</span></li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><span style={{ color: '#10b981' }}>✓</span> <span style={{ color: 'var(--secondary-foreground)' }}>Forever Access</span></li>
            </ul>
            <Link href="/sign-up" style={{ width: '100%' }}>
              <Button variant="primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem' }}>Get Lifetime Access</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="container" style={{ padding: '4rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 'bold' }}>MyRevLink</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>Empowering local businesses with AI-driven Google Reviews and beautiful digital profiles.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.25rem', color: 'var(--foreground)' }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/sign-up" style={{ color: 'var(--secondary-foreground)', fontSize: '0.875rem', textDecoration: 'none' }}>Pricing</Link>
              <Link href="/sign-in" style={{ color: 'var(--secondary-foreground)', fontSize: '0.875rem', textDecoration: 'none' }}>Login</Link>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.25rem', color: 'var(--foreground)' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/about-us" style={{ color: 'var(--secondary-foreground)', fontSize: '0.875rem', textDecoration: 'none' }}>About Us</Link>
              <Link href="/contact-us" style={{ color: 'var(--secondary-foreground)', fontSize: '0.875rem', textDecoration: 'none' }}>Contact Us</Link>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.25rem', color: 'var(--foreground)' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/privacy-policy" style={{ color: 'var(--secondary-foreground)', fontSize: '0.875rem', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="/terms-and-conditions" style={{ color: 'var(--secondary-foreground)', fontSize: '0.875rem', textDecoration: 'none' }}>Terms & Conditions</Link>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--muted)', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} MyRevLink. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
