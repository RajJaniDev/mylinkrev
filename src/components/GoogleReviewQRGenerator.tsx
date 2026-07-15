"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const COLOR_PRESETS = [
  { name: "Google Blue", value: "#1a73e8" },
  { name: "Emerald Green", value: "#10b981" },
  { name: "Royal Purple", value: "#8b5cf6" },
  { name: "Sunset Amber", value: "#f59e0b" },
  { name: "Crimson Red", value: "#ef4444" },
  { name: "Sleek Dark", value: "#1f2937" },
];

const TEMPLATE_STYLES = [
  { id: "modern", name: "Modern Minimalist" },
  { id: "star_badge", name: "Star Badge Classic" },
  { id: "compact", name: "Compact Table Tent" },
];

interface GoogleReviewQRGeneratorProps {
  priceSymbol?: string;
  priceAmount?: string;
}

export function GoogleReviewQRGenerator({ priceSymbol = "$", priceAmount = "5" }: GoogleReviewQRGeneratorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Form State
  const [businessName, setBusinessName] = useState("Acme Bakery");
  const [reviewLink, setReviewLink] = useState("https://g.page/r/example-link/review");
  const [accentColor, setAccentColor] = useState("#1a73e8");
  const [templateStyle, setTemplateStyle] = useState("modern");
  const [headline, setHeadline] = useState("Love our service?");
  const [subheadline, setSubheadline] = useState("Scan to write a quick Google Review & get AI assistance!");
  
  // Payment Modal State
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  // Form payment inputs
  const [email, setEmail] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Clean local storage logic for paid businesses (client side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const paidState = localStorage.getItem(`mylinkrev_qr_paid_${businessName}`);
      if (paidState === "true") {
        setIsPaid(true);
      } else {
        setIsPaid(false);
      }
    }
  }, [businessName]);

  // Capture successful checkout redirect callback from Dodo Payments
  useEffect(() => {
    const success = searchParams.get("success");
    const paidBusiness = searchParams.get("businessName");

    if (success === "true" && paidBusiness) {
      setIsPaid(true);
      if (typeof window !== "undefined") {
        localStorage.setItem(`mylinkrev_qr_paid_${paidBusiness}`, "true");
      }
      // Clear URL query parameters silently
      router.replace("/tools/google-review-qr");
    }
  }, [searchParams, router]);

  const handlePasteLink = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setReviewLink(text);
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoadingPayment(true);
    setPaymentError("");

    try {
      const response = await fetch("/api/checkout-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          email,
          reviewLink,
        }),
      });

      const data = await response.json();
      if (response.ok && data.checkoutUrl) {
        // Redirect to Dodo hosted secure checkout
        window.location.href = data.checkoutUrl;
      } else {
        setPaymentError(data.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      setPaymentError(err.message || "An error occurred");
    } finally {
      setLoadingPayment(false);
    }
  };

  // Function to generate the printable canvas and trigger download
  const handleDownload = (type: "png" | "pdf") => {
    if (!isPaid) {
      setShowCheckout(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Draw high res poster (A4 aspect ratio: 1200 x 1600 px)
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 1200, 1600);

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1200, 1600);

    // Background patterns / border based on color
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 24;
    ctx.strokeRect(12, 12, 1176, 1576);

    // Headline Group
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";

    // Draw google review icon/text
    ctx.font = "800 68px system-ui, sans-serif";
    ctx.fillText(headline.toUpperCase(), 600, 180);

    ctx.fillStyle = "#475569";
    ctx.font = "500 32px system-ui, sans-serif";
    
    // Wrap subheadline text
    const words = subheadline.split(" ");
    let line = "";
    let y = 240;
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + " ";
      let metrics = ctx.measureText(testLine);
      if (metrics.width > 900 && n > 0) {
        ctx.fillText(line, 600, y);
        line = words[n] + " ";
        y += 45;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 600, y);

    // Drawing template accents
    if (templateStyle === "star_badge") {
      // Draw 5 stars
      ctx.fillStyle = "#f59e0b";
      ctx.font = "60px Arial";
      ctx.fillText("★ ★ ★ ★ ★", 600, y + 100);
      y += 120;
    } else {
      y += 40;
    }

    // Business Card Box
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(200, y + 20, 800, 140);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.strokeRect(200, y + 20, 800, 140);

    ctx.fillStyle = accentColor;
    ctx.font = "800 48px system-ui, sans-serif";
    ctx.fillText(businessName, 600, y + 105);

    // Generate/Draw QR Code
    const qrImage = new Image();
    qrImage.crossOrigin = "anonymous";
    // QR Server API
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(reviewLink)}`;
    
    qrImage.onload = () => {
      // Draw QR code background
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 30;
      ctx.fillRect(350, y + 220, 500, 500);
      ctx.shadowColor = "transparent"; // Reset shadow

      ctx.drawImage(qrImage, 380, y + 250, 440, 440);

      // Bottom Instructions
      ctx.fillStyle = "#0f172a";
      ctx.font = "700 36px system-ui, sans-serif";
      ctx.fillText("How to leave a review:", 600, y + 800);

      ctx.fillStyle = "#475569";
      ctx.font = "500 28px system-ui, sans-serif";
      ctx.fillText("1. Scan the QR code using your phone camera", 600, y + 860);
      ctx.fillText("2. Tap the star rating & write your thoughts", 600, y + 910);
      ctx.fillText("3. Use the AI generator on page to copy review drafts", 600, y + 960);

      // Footer
      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 24px system-ui, sans-serif";
      ctx.fillText("Powered by MyRevLink.in", 600, 1510);

      // Download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${businessName.toLowerCase().replace(/\s+/g, "-")}-google-review-qr.png`;
      link.href = dataUrl;
      link.click();
    };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", width: "100%" }}>
      {/* Hidden high-res canvas */}
      <canvas ref={canvasRef} width={1200} height={1600} style={{ display: "none" }} />

      <div className="qr-generator-grid">
        
        {/* Left Side Form Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "1.25rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "1.25rem", color: "#0f172a", marginBottom: "1.5rem", fontWeight: 800 }}>Business Details</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Acme Bakery"
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Google Review Link</label>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <input
                    type="url"
                    value={reviewLink}
                    onChange={(e) => setReviewLink(e.target.value)}
                    placeholder="e.g. https://g.page/r/..."
                    style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                  <button
                    type="button"
                    onClick={handlePasteLink}
                    style={{ padding: "0.75rem 1.25rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "0.5rem", color: "#475569", fontWeight: 600, transition: "background 0.2s" }}
                  >
                    Paste
                  </button>
                </div>
                
                {/* How to get link helper */}
                <button
                  type="button"
                  onClick={() => setShowInstructions(!showInstructions)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3b82f6",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: "0.25rem 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    textDecoration: "underline"
                  }}
                >
                  ❓ How to get your Google Business review link?
                </button>

                {showInstructions && (
                  <div style={{
                    marginTop: "0.75rem",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    fontSize: "0.8rem",
                    color: "#475569",
                    lineHeight: 1.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem"
                  }}>
                    <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>Follow these steps to find your link:</p>
                    <ol style={{ paddingLeft: "1.2rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <li>Go to Google Search or Google Maps and search for your exact business name.</li>
                      <li>Make sure you are logged into the Google Account that manages your Google Business Profile.</li>
                      <li>In your Business Profile menu, find and click the button labeled <strong>"Ask for reviews"</strong> (or "Get more reviews").</li>
                      <li>A popup will appear showing your short review link (e.g. <code>https://g.page/r/YOUR_ID/review</code>).</li>
                      <li>Copy that link and click the <strong>"Paste"</strong> button above to place it here.</li>
                    </ol>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Headline Text</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Subheadline Instructions</label>
                <textarea
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  rows={2}
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem", resize: "none" }}
                />
              </div>

              {/* Template Style */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Template Style</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                  {TEMPLATE_STYLES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setTemplateStyle(tpl.id)}
                      style={{
                        padding: "0.5rem",
                        fontSize: "0.8rem",
                        borderRadius: "0.5rem",
                        border: templateStyle === tpl.id ? `2px solid ${accentColor}` : "1px solid #cbd5e1",
                        background: templateStyle === tpl.id ? `${accentColor}10` : "white",
                        color: templateStyle === tpl.id ? accentColor : "#475569",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Poster Accent Color</label>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      title={color.name}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: color.value,
                        border: accentColor === color.value ? "3px solid #0f172a" : "1px solid rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        outline: "none"
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{ width: "32px", height: "32px", border: "none", background: "none", cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Info Card */}
          <div style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #bfdbfe", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ fontSize: "1.5rem" }}>💡</div>
            <div>
              <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#1e3a8a", fontWeight: 700 }}>One-Time Payment, Lifetime Use</h4>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#1e40af", lineHeight: 1.5 }}>
                Generate your QR code and test the design for free. Unlock the download of the A4-printable high-resolution vector PDF & PNG for only **{priceSymbol}{priceAmount}**.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Visual Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
          
          {/* Printable poster preview mockup */}
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              aspectRatio: "3/4",
              background: "white",
              borderRadius: "1.5rem",
              border: `12px solid ${accentColor}`,
              boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Poster Header */}
            <div style={{ textAlign: "center", width: "100%" }}>
              <h2 style={{ fontSize: "1.75rem", margin: 0, fontWeight: 900, color: "#0f172a", textTransform: "uppercase" }}>
                {headline}
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0.25rem 0 0 0", lineHeight: 1.4 }}>
                {subheadline}
              </p>
            </div>

            {/* Template specific accent */}
            {templateStyle === "star_badge" && (
              <div style={{ display: "flex", gap: "0.25rem", color: "#f59e0b", fontSize: "1.5rem" }}>
                ★★★★★
              </div>
            )}

            {/* Business Block */}
            <div style={{
              width: "100%",
              background: "#f8fafc",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid #e2e8f0",
              textAlign: "center"
            }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", color: accentColor, fontWeight: 800 }}>{businessName}</h3>
            </div>

            {/* QR Code Container */}
            <div 
              style={{
                background: "white",
                padding: "1rem",
                borderRadius: "1rem",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 20px -5px rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                cursor: isPaid ? "default" : "pointer"
              }}
              onClick={() => { if (!isPaid) setShowCheckout(true); }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(reviewLink)}`}
                alt="Google Review QR"
                style={{ 
                  width: "180px", 
                  height: "180px", 
                  display: "block",
                  filter: isPaid ? "none" : "blur(12px) grayscale(40%)",
                  transition: "filter 0.3s ease"
                }}
              />
              {!isPaid && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(255, 255, 255, 0.45)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.25rem"
                }}>
                  <span style={{ fontSize: "1.5rem" }}>🔒</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1e293b", background: "white", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                    Unlock QR Code
                  </span>
                </div>
              )}
            </div>

            {/* Steps Instruction */}
            <div style={{ width: "100%", textAlign: "left" }}>
              <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>How to review:</p>
              <ol style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.75rem", color: "#475569", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <li>Scan this QR using your phone camera</li>
                <li>Tap stars & write review</li>
                <li>Use AI assistance on page to copy review draft</li>
              </ol>
            </div>

            {/* Footer */}
            <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600 }}>
              Powered by MyRevLink.in
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", width: "100%", maxWidth: "420px" }}>
            <button
              onClick={() => handleDownload("png")}
              style={{
                flex: 1,
                background: isPaid ? accentColor : "#e2e8f0",
                color: isPaid ? "white" : "#475569",
                border: "none",
                padding: "1rem",
                borderRadius: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s"
              }}
            >
              <span>{isPaid ? "Download PNG Poster" : `Unlock Printable Poster (${priceSymbol}${priceAmount})`}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Sleek checkout popup modal */}
      {showCheckout && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "1rem"
        }}>
          <div style={{
            background: "white",
            width: "100%",
            maxWidth: "460px",
            borderRadius: "1.5rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            animation: "fade-in 0.2s ease-out"
          }}>
            {/* Header */}
            <div style={{ background: accentColor, color: "white", padding: "1.5rem", position: "relative" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>Unlock Review QR Poster</h3>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", opacity: 0.9 }}>One-time payment of {priceSymbol}{priceAmount}. No subscription.</p>
              <button
                onClick={() => setShowCheckout(false)}
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.25rem",
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: "1.75rem" }}>
              <form onSubmit={handleCheckoutSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#64748b", marginBottom: "0.25rem" }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.9rem" }}
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginTop: "0.25rem" }}>
                    We'll email you the receipt and link to access your A4 downloads.
                  </span>
                </div>

                {paymentError && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", padding: "0.75rem", borderRadius: "0.5rem", color: "#b91c1c", fontSize: "0.8rem" }}>
                    ⚠️ {paymentError}
                  </div>
                )}

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", background: "#f8fafc", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", fontSize: "0.8rem", color: "#64748b" }}>
                  <span>🛡️</span>
                  <span>Secure Checkout powered by Dodo Payments</span>
                </div>

                <button
                  type="submit"
                  disabled={loadingPayment}
                  style={{
                    background: accentColor,
                    color: "white",
                    border: "none",
                    padding: "0.8rem",
                    borderRadius: "0.5rem",
                    fontWeight: 700,
                    cursor: loadingPayment ? "not-allowed" : "pointer",
                    marginTop: "0.5rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    opacity: loadingPayment ? 0.7 : 1
                  }}
                >
                  {loadingPayment ? "Redirecting to Checkout..." : `Pay ${priceSymbol}${priceAmount} & Unlock`}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
