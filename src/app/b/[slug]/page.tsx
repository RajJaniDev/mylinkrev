import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CopyPhoneNumber } from "@/components/CopyPhoneNumber";
import { CopyEmail } from "@/components/CopyEmail";
import { VideoEmbed } from "@/components/VideoEmbed";

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

  return (
    <main style={{ 
      minHeight: '100vh', position: 'relative', overflowX: 'hidden',
      '--primary': primaryColor,
      '--accent': secondaryColor
    } as React.CSSProperties}>
      {/* Elegant Ambient Full-Page Background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--primary) 15%, transparent) 0%, transparent 50%), radial-gradient(circle at 100% 100%, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 50%)',
        backgroundColor: 'var(--background)',
        zIndex: -1
      }} />

      <div className="container flex-col animate-fade-in" style={{ position: 'relative', zIndex: 1, padding: '4rem 1.5rem', display: 'flex', alignItems: 'center' }}>
         <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            
            {/* Profile Avatar */}
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

            {/* Social Media Horizontal Icons Section */}
            {(socials.youtube || socials.facebook || socials.instagram || socials.linkedin) && (
              <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', alignItems: 'center', margin: '0.25rem 0' }}>
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
                {socials.linkedin && (
                  <a href={socials.linkedin.startsWith('http') ? socials.linkedin : `https://${socials.linkedin}`} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="social-icon-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
            
            {/* Business Details */}
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.75rem', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {business.name}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)" style={{ marginTop: '4px' }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </h1>
              {socials.location && (
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '0.25rem', marginBottom: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                  📍 {socials.location}
                </p>
              )}
              {socials.phone && (
                <CopyPhoneNumber phone={socials.phone} />
              )}
              {business.description && <p style={{ color: 'var(--secondary-foreground)', fontSize: '1rem', marginTop: '1rem', lineHeight: '1.5' }}>{business.description}</p>}
              {socials.email && (
                <CopyEmail email={socials.email} />
              )}
            </div>

            {/* Primary Action Button (Glowing) */}
            {business.google_review_url && (
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
            
            {/* Showcase Videos (Horizontal Scroll) */}
            {socials.showcase_videos && socials.showcase_videos.length > 0 && (
              <div style={{ width: '100%', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--foreground)', fontWeight: 600 }}>Showcase</h3>
                <div style={{ 
                  display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem',
                  scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
                  marginLeft: '-1.5rem', marginRight: '-1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem'
                }} className="hide-scrollbar">
                  {socials.showcase_videos.map((url: string, index: number) => (
                    <div key={index} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
                      <VideoEmbed url={url} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links List */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
               
               {socials.instagram && (
                  <a href={socials.instagram.startsWith('http') ? socials.instagram : `https://${socials.instagram}`} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                    <div className="glass-card social-card" style={{ gap: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="url(#ig-grad)">
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
                      Instagram
                    </div>
                  </a>
               )}

               {socials.whatsapp && (
                  <a href={`https://wa.me/${socials.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                    <div className="glass-card social-card" style={{ gap: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Chat on WhatsApp
                    </div>
                  </a>
               )}



               {socials.facebook && (
                  <a href={socials.facebook.startsWith('http') ? socials.facebook : `https://${socials.facebook}`} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                    <div className="glass-card social-card" style={{ gap: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                      Facebook
                    </div>
                  </a>
               )}

               {/* YouTube Card */}
               {socials.youtube && (
                  <a href={socials.youtube.startsWith('http') ? socials.youtube : `https://${socials.youtube}`} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                    <div className="glass-card social-card" style={{ gap: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      YouTube
                    </div>
                  </a>
               )}

               {/* LinkedIn Card */}
               {socials.linkedin && (
                  <a href={socials.linkedin.startsWith('http') ? socials.linkedin : `https://${socials.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                    <div className="glass-card social-card" style={{ gap: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                      LinkedIn
                    </div>
                  </a>
               )}

               {/* Twitter Card */}
               {socials.twitter && (
                  <a href={socials.twitter.startsWith('http') ? socials.twitter : `https://${socials.twitter}`} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                    <div className="glass-card social-card" style={{ gap: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      X (Twitter)
                    </div>
                  </a>
               )}

               {/* Map Card */}
               {socials.map_url && (
                  <a href={socials.map_url.startsWith('http') ? socials.map_url : `https://${socials.map_url}`} target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
                    <div className="glass-card social-card" style={{ gap: '0.75rem', background: 'var(--background)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      Open in Google Maps
                    </div>
                  </a>
               )}
            </div>

            <Link href="/" target="_blank" style={{ marginTop: '3rem', fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8, transition: 'opacity 0.2s' }}>
               Powered by <strong style={{ color: 'var(--foreground)' }}>MyRevLink</strong>
            </Link>
         </div>
      </div>
    </main>
  );
}
