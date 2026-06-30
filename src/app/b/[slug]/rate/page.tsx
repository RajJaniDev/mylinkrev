"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RateBusinessPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [business, setBusiness] = useState<any>(null);
  const [stars, setStars] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("businesses")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data }) => setBusiness(data));
  }, [slug]);

  const handleStarClick = async (rating: number) => {
    setStars(rating);
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: business.name,
          businessDescription: business.description,
          stars: business.social_links?.always_positive ? 5 : rating
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setReview(data.review);
    } catch (err: any) {
      setError("Failed to generate review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAndRedirect = () => {
    navigator.clipboard.writeText(review);
    setCopied(true);
    setTimeout(() => {
      if (business?.google_review_url) {
        window.location.href = business.google_review_url;
      } else {
        alert("Business has not set a Google Review URL yet.");
      }
    }, 1000);
  };

  if (!business) return <div className="flex-center" style={{ minHeight: '100vh' }}>Loading...</div>;

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

      <div className="container flex-col animate-fade-in" style={{ position: 'relative', zIndex: 1, padding: '4rem 1.5rem', display: 'flex', alignItems: 'center', minHeight: '100vh', justifyContent: 'center' }}>
         <div className="glass-card" style={{ 
           width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center',
           padding: '3rem 2rem', borderRadius: '1.5rem', 
           border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)', 
           boxShadow: '0 20px 40px -10px color-mix(in srgb, var(--primary) 15%, transparent)'
         }}>
            {socials.profile_photo && (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', marginBottom: '1rem', border: '2px solid color-mix(in srgb, var(--primary) 20%, transparent)' }}>
                <img src={socials.profile_photo} alt={business.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            
            <h2 style={{ margin: '0 0 0.5rem 0', textAlign: 'center' }}>Rate {business.name}</h2>
            <p style={{ color: 'var(--secondary-foreground)', marginBottom: '2rem', textAlign: 'center' }}>
              Tap a star to let our AI write a perfect review for you!
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <button 
                  key={i}
                  onClick={() => handleStarClick(i)}
                  style={{
                    background: 'none', border: 'none', fontSize: '3.5rem', cursor: 'pointer',
                    color: (stars >= i) ? '#f59e0b' : 'var(--border)',
                    transition: 'color 0.2s, transform 0.1s',
                    padding: 0, margin: 0, lineHeight: 1
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ★
                </button>
              ))}
            </div>

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                <div style={{ width: '20px', height: '20px', border: '3px solid', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span>Generating review with AI...</span>
              </div>
            )}
            
            {error && <p style={{ color: '#ef4444', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>{error}</p>}

            {review && !loading && (
               <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.5s' }}>
                  <textarea 
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={5}
                    style={{
                      width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', 
                      border: '1px solid color-mix(in srgb, var(--primary) 30%, transparent)', 
                      background: 'color-mix(in srgb, var(--background) 50%, transparent)', color: 'var(--foreground)',
                      fontFamily: 'inherit', resize: 'vertical', fontSize: '1rem', lineHeight: 1.5
                    }}
                  />
                  
                  <button 
                    onClick={handleCopyAndRedirect} 
                    style={{ 
                      padding: '1rem', fontSize: '1.125rem', background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                      color: 'white', border: 'none', borderRadius: '2rem', fontWeight: 600, cursor: 'pointer',
                      boxShadow: '0 10px 25px -5px color-mix(in srgb, var(--primary) 50%, transparent)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {copied ? "✓ Copied! Redirecting..." : "Copy and Go to Google"}
                  </button>
               </div>
            )}
         </div>

         {/* Branding & CTA */}
         <div style={{ marginTop: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
           <a href="/" target="_blank" style={{ fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.8, transition: 'opacity 0.2s' }}>
              Powered by <strong style={{ color: 'var(--foreground)' }}>MyRevLink</strong>
           </a>
           <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--secondary-foreground)' }}>
             Want a page like this for your business? <a href="/" target="_blank" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Get yours now</a>
           </p>
         </div>
      </div>
    </main>
  );
}
