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

  return (
    <main className="container flex-col flex-center animate-fade-in" style={{ padding: '4rem 1.5rem', minHeight: '100vh' }}>
       <div className="glass-card" style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2>Rate {business.name}</h2>
          <p style={{ color: 'var(--secondary-foreground)', marginBottom: '2rem', textAlign: 'center' }}>
            Tap a star to let our AI write a perfect review for you!
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <button 
                key={i}
                onClick={() => handleStarClick(i)}
                style={{
                  background: 'none', border: 'none', fontSize: '3rem', cursor: 'pointer',
                  color: (stars >= i) ? '#f59e0b' : 'var(--border)',
                  transition: 'color 0.2s'
                }}
              >
                ★
              </button>
            ))}
          </div>

          {loading && <p style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Generating review with AI...</p>}
          {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

          {review && !loading && (
             <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.5s' }}>
                <textarea 
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)',
                    fontFamily: 'inherit', resize: 'vertical'
                  }}
                />
                
                <Button variant="primary" onClick={handleCopyAndRedirect} style={{ padding: '1rem', fontSize: '1.125rem' }}>
                  {copied ? "Copied! Redirecting..." : "Copy and Go to Google"}
                </Button>
             </div>
          )}
       </div>
    </main>
  );
}
