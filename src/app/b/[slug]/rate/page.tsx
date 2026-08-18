"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import fallbackReviewsData from "@/data/generic-reviews.json";

type StarRatingKey = "1" | "2" | "3" | "4" | "5";

function getClientFallbackReview(stars: number, businessName?: string): string {
  const normalizedStars = Math.min(5, Math.max(1, Math.round(stars || 5)));
  const starKey = String(normalizedStars) as StarRatingKey;
  const reviewsList = fallbackReviewsData[starKey] || fallbackReviewsData["5"];
  
  const randomIndex = Math.floor(Math.random() * reviewsList.length);
  const selectedTemplate = reviewsList[randomIndex];
  const nameToUse = businessName && businessName.trim() ? businessName.trim() : "this business";
  
  return selectedTemplate.replace(/BusinessName/g, nameToUse);
}

function isValidContact(contact: string): boolean {
  const trimmed = contact.trim();
  if (!trimmed) return false;

  // 1. Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmed)) return true;

  // 2. Phone number format check (digits, optional +, spaces, dashes, parens)
  const phoneRegex = /^[+]?[\d\s\-()]{7,18}$/;
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (phoneRegex.test(trimmed) && digitsOnly.length >= 7 && digitsOnly.length <= 15) {
    return true;
  }

  return false;
}

export default function RateBusinessPage() {
  const params = useParams();
  const rawSlug = params.slug as string;
  const slug = rawSlug ? decodeURIComponent(rawSlug) : "";
  const [business, setBusiness] = useState<any>(null);
  const [stars, setStars] = useState<number>(0);
  
  // High Rating (4-5 Stars) state
  const [review, setReview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Low Rating (1-3 Stars) Feedback Form state
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackContact, setFeedbackContact] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("businesses")
      .select("*")
      .ilike("slug", slug)
      .single()
      .then(({ data, error }) => {
        if (data) {
          setBusiness(data);
        } else {
          // Fallback exact match query
          supabase
            .from("businesses")
            .select("*")
            .eq("slug", slug)
            .single()
            .then(({ data: fallbackData }) => setBusiness(fallbackData));
        }
      });
  }, [slug]);

  const handleStarClick = async (rating: number) => {
    setStars(rating);
    setError("");
    setFeedbackError("");
    setFeedbackSubmitted(false);
    setReview("");

    // If rating is 3 stars or lower, show feedback box (do NOT generate AI review)
    if (rating <= 3 && !business?.social_links?.always_positive) {
      return;
    }

    // 4 or 5 stars -> Generate AI Review
    setLoading(true);
    try {
      const targetStars = business?.social_links?.always_positive ? 5 : rating;
      const res = await fetch("/api/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: business?.name,
          businessDescription: business?.description,
          stars: targetStars,
          slug: business?.slug || slug
        })
      });

      const data = await res.json();
      
      if (res.status === 403) {
        setError(data.error || "This business has run out of free AI review credits.");
        return;
      }

      if (data && data.review) {
        setReview(data.review);
      } else {
        setReview(getClientFallbackReview(targetStars, business?.name));
      }
    } catch (err: any) {
      console.error("Generate review request failed:", err);
      const targetStars = business?.social_links?.always_positive ? 5 : rating;
      setReview(getClientFallbackReview(targetStars, business?.name));
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError("");

    // Name validation
    if (!feedbackName.trim() || feedbackName.trim().length < 2) {
      setFeedbackError("Please enter your name.");
      return;
    }

    // Phone / Email validation
    if (!isValidContact(feedbackContact)) {
      setFeedbackError("Please enter a valid phone number or email address (e.g. name@example.com or +1 234 567 8900).");
      return;
    }

    // Message validation
    if (!feedbackMessage.trim() || feedbackMessage.trim().length < 3) {
      setFeedbackError("Please describe your experience or problem.");
      return;
    }

    setSubmittingFeedback(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business?.id,
          slug: business?.slug || slug,
          name: feedbackName,
          contact: feedbackContact,
          message: feedbackMessage,
          stars: stars
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit feedback.");
      }

      setFeedbackSubmitted(true);
    } catch (err: any) {
      console.error("Feedback submit error:", err);
      setFeedbackError(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setSubmittingFeedback(false);
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
  const isLowRating = stars > 0 && stars <= 3 && !socials.always_positive;

  return (
    <main style={{ 
      minHeight: '100vh', position: 'relative', overflowX: 'hidden',
      '--primary': primaryColor,
      '--accent': secondaryColor
    } as React.CSSProperties}>
      
      {/* Ambient Full-Page Background */}
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
              {isLowRating 
                ? "Please share your experience so management can address your concern directly."
                : "Tap a star to let our AI write a perfect review for you!"}
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

            {/* High Rating (4 or 5 stars): AI Review Display */}
            {!isLowRating && review && !loading && (
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

            {/* Low Rating (1, 2, or 3 stars): Feedback Form */}
            {isLowRating && (
              <div style={{ width: '100%', animation: 'fadeIn 0.5s' }}>
                {feedbackSubmitted ? (
                  <div style={{
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '1rem',
                    color: '#10b981'
                  }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Thank You for Your Feedback</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--foreground)', opacity: 0.9 }}>
                      Your comments have been sent directly to management. We appreciate your input and will work to make things right.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.15rem' }}>Send Private Feedback</h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--secondary-foreground)' }}>
                        Tell us what went wrong so we can resolve it for you personally.
                      </p>
                    </div>

                    {feedbackError && (
                      <div style={{ padding: '0.66rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', color: '#ef4444', fontSize: '0.875rem', fontWeight: 500 }}>
                        {feedbackError}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Your Name <span style={{ color: '#ef4444' }}>*</span></label>
                      <input 
                        type="text"
                        value={feedbackName}
                        onChange={(e) => setFeedbackName(e.target.value)}
                        placeholder="John Doe"
                        required
                        style={{
                          width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)', background: 'var(--background)',
                          color: 'var(--foreground)', fontSize: '0.95rem'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Phone Number or Email <span style={{ color: '#ef4444' }}>*</span></label>
                      <input 
                        type="text"
                        value={feedbackContact}
                        onChange={(e) => setFeedbackContact(e.target.value)}
                        placeholder="name@example.com or +1 234 567 8900"
                        required
                        style={{
                          width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)', background: 'var(--background)',
                          color: 'var(--foreground)', fontSize: '0.95rem'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Describe Your Experience / Problem <span style={{ color: '#ef4444' }}>*</span></label>
                      <textarea 
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        placeholder="Please detail what went wrong during your visit..."
                        rows={4}
                        required
                        style={{
                          width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)', background: 'var(--background)',
                          color: 'var(--foreground)', fontSize: '0.95rem', resize: 'vertical'
                        }}
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={submittingFeedback}
                      style={{ 
                        padding: '0.9rem', fontSize: '1rem', background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                        color: 'white', border: 'none', borderRadius: '2rem', fontWeight: 600, cursor: 'pointer',
                        boxShadow: '0 10px 25px -5px color-mix(in srgb, var(--primary) 50%, transparent)',
                        opacity: submittingFeedback ? 0.7 : 1, transition: 'transform 0.2s'
                      }}
                    >
                      {submittingFeedback ? "Submitting Feedback..." : "Submit Private Feedback"}
                    </button>
                  </form>
                )}
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
