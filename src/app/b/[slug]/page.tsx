import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { ShowcaseTabs } from "@/components/ShowcaseTabs";
import type { Metadata } from "next";

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;

  const { data: business } = await supabase
    .from("businesses")
    .select("name, description, social_links")
    .eq("slug", slug)
    .single();

  if (!business) {
    return {
      title: "Business Profile Not Found | MyRevLink",
    };
  }

  const socials = business.social_links as any || {};
  const description = business.description || `Read reviews, rate, and connect with ${business.name} on MyRevLink.`;

  return {
    title: `${business.name} - Rate & Connect on MyRevLink`,
    description,
    openGraph: {
      title: `${business.name} | Google Reviews & Links`,
      description,
      images: socials.profile_photo ? [{ url: socials.profile_photo }] : [],
    },
  };
}

export default async function BusinessPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!business) {
    notFound();
  }

  // Parse social links if needed. Assuming it's JSON { instagram: '...', website: '...' }
  let socials: any = {};
  try {
    socials = business.social_links || {};
  } catch(e) {}

  const primaryColor = socials.theme_primary || '#3b82f6';
  const secondaryColor = socials.theme_secondary || primaryColor;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description || `Connect with ${business.name} and rate us on Google.`,
    "url": `https://myrevlink.in/b/${slug}`,
    "image": socials.profile_photo || undefined,
    "telephone": socials.phone || undefined,
    "email": socials.email || undefined,
    "address": socials.location ? {
      "@type": "PostalAddress",
      "streetAddress": socials.location,
    } : undefined,
    "sameAs": [
      socials.facebook,
      socials.instagram,
      socials.twitter,
      socials.linkedin,
      socials.youtube,
      business.google_review_url,
    ].filter((link) => link && link.startsWith("http")),
  };

  return (
    <main style={{ 
      minHeight: '100vh', position: 'relative', overflowX: 'hidden',
      '--primary': primaryColor,
      '--accent': secondaryColor
    } as React.CSSProperties}>
      {/* Dynamic JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* Elegant Ambient Full-Page Background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--primary) 15%, transparent) 0%, transparent 50%), radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 50%)',
        backgroundColor: 'var(--background)',
        zIndex: -1
      }} />

      <div className="container flex-col animate-fade-in" style={{ position: 'relative', zIndex: 1, padding: '4rem 1.5rem', display: 'flex', alignItems: 'center' }}>
         <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            
            {/* 1. Profile Avatar */}
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '3.5rem', color: 'white', fontWeight: 'bold', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)', overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.2)'
            }}>
              {socials.profile_photo ? (
                <img src={socials.profile_photo} alt={business.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                business.name.charAt(0).toUpperCase()
              )}
            </div>

            {/* 2. Business Title */}
            <h1 style={{ fontSize: '1.75rem', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textAlign: 'center' }}>
              {business.name}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)" style={{ marginTop: '4px' }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </h1>

            {/* 3. Social Media Horizontal Icons Section */}
            {(socials.youtube || socials.facebook || socials.instagram || socials.linkedin || socials.twitter) && (
              <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', alignItems: 'center', margin: '0' }}>
                {socials.youtube && (
                  <a href={socials.youtube.startsWith('http') ? socials.youtube : `https://${socials.youtube}`} target="_blank" rel="noopener noreferrer" title="YouTube" className="social-icon-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
                {socials.facebook && (
                  <a href={socials.facebook.startsWith('http') ? socials.facebook : `https://${socials.facebook}`} target="_blank" rel="noopener noreferrer" title="Facebook" className="social-icon-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                )}
                {socials.instagram && (
                  <a href={socials.instagram.startsWith('http') ? socials.instagram : `https://${socials.instagram}`} target="_blank" rel="noopener noreferrer" title="Instagram" className="social-icon-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="url(#ig-grad)">
                      <defs>
                        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f09433" />
                          <stop offset="25%" stopColor="#e6683c" />
                          <stop offset="50%" stopColor="#dc2743" />
                          <stop offset="75%" stopColor="#cc2366" />
                          <stop offset="100%" stopColor="#bc1888" />
                        </linearGradient>
                      </defs>
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.049 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.555.556.899 1.113 1.153 1.772.248.639.416 1.363.465 2.428.05 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.049 1.065-.217 1.79-.465 2.428-.254.66-.598 1.216-1.153 1.772-.556.555-1.113.899-1.772 1.153-.639.248-1.363.416-2.428.465-1.066.05-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.049-1.79-.217-2.428-.465-.66-.254-1.216-.598-1.772-1.153-.555-.556-.899-1.113-1.153-1.772-.248-.639-.416-1.363-.465-2.428C2.01 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.049-1.065.217-1.79.465-2.428.254-.66.598-1.216 1.153-1.772.556-.555 1.113-.899 1.772-1.153.639-.248 1.363-.416 2.428-.465C8.944 2.01 9.283 2 12 2zm0 2.16c-2.67 0-2.996.01-4.048.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.052-.058 1.378-.058 4.048 0 2.67.01 2.996.058 4.048.045.975.207 1.504.344 1.857.182.467.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.052.048 1.378.058 4.048.058 2.67 0 2.996-.01 4.048-.058.975-.045 1.504-.207 1.857-.344.467-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.052.058-1.378.058-4.048 0-2.67-.01-2.996-.058-4.048-.045-.975-.207-1.504-.344-1.857-.182-.467-.398-.8-.748-1.15-.35-.35-.566-.683-.748-1.15-.137-.353-.3-.882-.344-1.857C14.996 4.17 14.67 4.16 12 4.16zm0 2.678a5.162 5.162 0 100 10.324 5.162 5.162 0 000-10.324zm0 8.164a3.002 3.002 0 110-6.004 3.002 3.002 0 010 6.004zm3.41-7.422a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                    </svg>
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter.startsWith('http') ? socials.twitter : `https://${socials.twitter}`} target="_blank" rel="noopener noreferrer" title="Twitter (X)" className="social-icon-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin.startsWith('http') ? socials.linkedin : `https://${socials.linkedin}`} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="social-icon-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* 4 & 5. Contact Info Section (Phone, WhatsApp, Email) */}
            <ContactSection phone={socials.phone} whatsapp={socials.whatsapp} email={socials.email} />

            {/* 6. Description */}
            {business.description && (
              <p style={{ color: 'var(--secondary-foreground)', fontSize: '1rem', lineHeight: '1.5', textAlign: 'center', margin: '0.25rem 0', width: '100%' }}>
                {business.description}
              </p>
            )}

            {/* 7. Physical Location Address & Google Maps */}
            {(socials.location || socials.map_url) && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', margin: '0', width: '100%' }}>
                {socials.location && (
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                    📍 {socials.location}
                  </p>
                )}
                {socials.map_url && (
                  <a 
                    href={socials.map_url.startsWith('http') ? socials.map_url : `https://${socials.map_url}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      color: 'var(--primary)', 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      textDecoration: 'none', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.25rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      background: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Open in Google Maps
                  </a>
                )}
              </div>
            )}

            {/* Primary Action Button (Glowing) */}
            {business.google_review_url && !socials.hide_google_rate && (
              <div style={{ width: '100%', marginTop: '1rem' }}>
                 <Link href={`/b/${slug}/rate`} style={{ width: '100%', display: 'block' }}>
                   <div className="glass-card primary-card" style={{ 
                      gap: '0.75rem', padding: '1.5rem', 
                      background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                      boxShadow: '0 10px 25px -5px color-mix(in srgb, var(--primary) 50%, transparent)',
                      border: 'none', transform: 'scale(1)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#fbbf24' }}>
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                      <span style={{ fontSize: '1.125rem' }}>Rate us on Google</span>
                   </div>
                 </Link>
              </div>
            )}

            {/* Book Appointment Action Button */}
            {socials.booking_url && (
              <div style={{ width: '100%', marginTop: '0.5rem' }}>
                 <a href={socials.booking_url.startsWith('http') ? socials.booking_url : `https://${socials.booking_url}`} target="_blank" rel="noopener noreferrer" style={{ width: '100%', display: 'block' }}>
                   <div className="glass-card primary-card" style={{ 
                      gap: '0.75rem', padding: '1.25rem', 
                      background: 'var(--foreground)',
                      color: 'var(--background)',
                      border: 'none', transform: 'scale(1)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>Book Appointment</span>
                   </div>
                 </a>
              </div>
            )}
            
            {/* Showcase Section (Tab View) */}
            {!socials.hide_showcase && (
              <ShowcaseTabs 
                videos={socials.showcase_videos} 
                apps={socials.showcase_apps} 
                products={socials.showcase_products} 
              />
            )}

            <Link href="/" target="_blank" style={{ marginTop: '3rem', fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, transition: 'opacity 0.2s' }} title="MyRevLink - Free Google Review Generator">
               Powered by <strong style={{ color: 'var(--foreground)' }}>MyRevLink</strong> - Free Google Review Generator
            </Link>
         </div>
      </div>
    </main>
  );
}
