"use client";

import React, { useState, useRef, useEffect } from "react";

export interface QRTemplateConfig {
  templateId: string;
  businessName: string;
  businessLogo?: string;
  reviewLink: string;
  headline: string;
  subheadline: string;
  thankyouNote: string;
  accentColor: string;
  phone?: string;
  email?: string;
  location?: string;
}

interface QRPosterCustomizerProps {
  initialConfig?: Partial<QRTemplateConfig>;
  onSave?: (config: QRTemplateConfig) => Promise<void> | void;
  priceSymbol?: string;
  priceAmount?: string;
  isPaid?: boolean;
  onCheckout?: () => void;
  showSaveButton?: boolean;
}

export const PREDEFINED_TEMPLATES = [
  {
    id: "google_arch",
    name: "Google Arch Classic",
    subtitle: "Reference 1 - Colorful arch & corner frame",
    tag: "Popular",
    previewBg: "linear-gradient(135deg, #ea4335, #4285f4)"
  },
  {
    id: "google_ring",
    name: "Google Circle Minimal",
    subtitle: "Reference 2 - 4-color circle ring banner",
    tag: "Minimal",
    previewBg: "linear-gradient(135deg, #4285f4, #34a853)"
  },
  {
    id: "multi_connect",
    name: "Multi-Connect Badge",
    subtitle: "Reference 3 - Contact info & social links",
    tag: "Business",
    previewBg: "linear-gradient(135deg, #fbbc05, #ea4335)"
  },
  {
    id: "premium_wave",
    name: "Premium Wave & Script",
    subtitle: "Reference 4 - Gold frame, script & blue wave",
    tag: "Premium",
    previewBg: "linear-gradient(135deg, #f59e0b, #2563eb)"
  },
  {
    id: "monochrome_star",
    name: "Monochrome Star Card",
    subtitle: "Reference 5 - Elegant script & 5-star callout",
    tag: "Elegant",
    previewBg: "linear-gradient(135deg, #1e293b, #64748b)"
  }
];

export const COLOR_PALETTES = [
  { name: "Google Blue", value: "#1a73e8" },
  { name: "Royal Indigo", value: "#4f46e5" },
  { name: "Emerald", value: "#10b981" },
  { name: "Sunset Gold", value: "#f59e0b" },
  { name: "Coral Red", value: "#ef4444" },
  { name: "Midnight Black", value: "#0f172a" },
];

export function QRPosterCustomizer({
  initialConfig,
  onSave,
  priceSymbol = "$",
  priceAmount = "5",
  isPaid = true,
  onCheckout,
  showSaveButton = true
}: QRPosterCustomizerProps) {
  // State
  const [templateId, setTemplateId] = useState<string>(initialConfig?.templateId || "google_arch");
  const [businessName, setBusinessName] = useState<string>(initialConfig?.businessName || "Galaxy Salon");
  const [businessLogo, setBusinessLogo] = useState<string>(initialConfig?.businessLogo || "");
  const [reviewLink, setReviewLink] = useState<string>(initialConfig?.reviewLink || "https://g.page/r/example-review");
  const [headline, setHeadline] = useState<string>(initialConfig?.headline || "Scan to Rate Us on Google");
  const [subheadline, setSubheadline] = useState<string>(initialConfig?.subheadline || "Scan this code to leave us a 5-star review & help our local business grow!");
  const [thankyouNote, setThankyouNote] = useState<string>(initialConfig?.thankyouNote || "Thank you for your visit!");
  const [accentColor, setAccentColor] = useState<string>(initialConfig?.accentColor || "#1a73e8");
  const [phone, setPhone] = useState<string>(initialConfig?.phone || "+1 234 567 8900");
  const [email, setEmail] = useState<string>(initialConfig?.email || "contact@business.com");
  const [location, setLocation] = useState<string>(initialConfig?.location || "Main Street Branch");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);

  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync state when initialConfig updates
  useEffect(() => {
    if (initialConfig?.templateId) setTemplateId(initialConfig.templateId);
    if (initialConfig?.businessName) setBusinessName(initialConfig.businessName);
    if (initialConfig?.businessLogo !== undefined) setBusinessLogo(initialConfig.businessLogo);
    if (initialConfig?.reviewLink) setReviewLink(initialConfig.reviewLink);
    if (initialConfig?.headline) setHeadline(initialConfig.headline);
    if (initialConfig?.subheadline) setSubheadline(initialConfig.subheadline);
    if (initialConfig?.thankyouNote) setThankyouNote(initialConfig.thankyouNote);
    if (initialConfig?.accentColor) setAccentColor(initialConfig.accentColor);
    if (initialConfig?.phone) setPhone(initialConfig.phone);
    if (initialConfig?.email) setEmail(initialConfig.email);
    if (initialConfig?.location) setLocation(initialConfig.location);
  }, [initialConfig]);

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Image file size should be less than 3MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBusinessLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasteLink = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setReviewLink(text);
    } catch (err) {
      console.error("Clipboard error:", err);
    }
  };

  // Save changes handler
  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    setSaveMessage("");
    try {
      await onSave({
        templateId,
        businessName,
        businessLogo,
        reviewLink,
        headline,
        subheadline,
        thankyouNote,
        accentColor,
        phone,
        email,
        location,
      });
      setSaveMessage("Customization saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setSaveMessage("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  // High-Resolution PNG Poster Download Generator
  const handleDownloadPNG = () => {
    if (!isPaid && onCheckout) {
      onCheckout();
      return;
    }

    const canvas = hiddenCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High resolution A4 aspect canvas (1500 x 2000 px)
    const W = 1500;
    const H = 2000;
    canvas.width = W;
    canvas.height = H;

    ctx.clearRect(0, 0, W, H);

    // Draw background based on template
    if (templateId === "premium_wave") {
      ctx.fillStyle = "#faf7f2"; // Cream linen
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
    }

    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(reviewLink)}`;

    qrImg.onload = () => {
      // Helper function to draw rounded rect
      const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string, strokeW = 2) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        if (fill) {
          ctx.fillStyle = fill;
          ctx.fill();
        }
        if (stroke) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeW;
          ctx.stroke();
        }
      };

      // Template Specific Canvas Drawing
      if (templateId === "google_arch") {
        // TOP 4-COLOR ARCH BANNER
        ctx.fillStyle = "#ea4335";
        ctx.fillRect(0, 0, 375, 140);
        ctx.fillStyle = "#fbbc05";
        ctx.fillRect(375, 0, 375, 140);
        ctx.fillStyle = "#34a853";
        ctx.fillRect(750, 0, 375, 140);
        ctx.fillStyle = "#4285f4";
        ctx.fillRect(1125, 0, 375, 140);

        // White circle with G Logo & Stars
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(750, 140, 110, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = "rgba(0,0,0,0.1)";
        ctx.shadowBlur = 15;
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        ctx.shadowColor = "transparent";

        // G text in circle
        ctx.fillStyle = "#4285f4";
        ctx.font = "900 100px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("G", 750, 175);

        // 5 Stars below arch
        ctx.fillStyle = "#fbbc05";
        ctx.font = "60px sans-serif";
        ctx.fillText("★ ★ ★ ★ ★", 750, 310);

        // Headline
        ctx.fillStyle = "#0f172a";
        ctx.font = "800 68px sans-serif";
        ctx.fillText(headline.toUpperCase(), 750, 420);

        // Business Name Box
        drawRoundedRect(250, 480, 1000, 130, 24, "#f8fafc", "#e2e8f0", 4);
        ctx.fillStyle = accentColor;
        ctx.font = "800 58px sans-serif";
        ctx.fillText(businessName, 750, 565);

        // QR Code box with Google corner accents
        drawRoundedRect(425, 660, 650, 650, 32, "#ffffff", "#e2e8f0", 4);
        ctx.drawImage(qrImg, 475, 710, 550, 550);

        // Corner accents
        ctx.lineWidth = 14;
        ctx.lineCap = "round";
        // Top Left Red
        ctx.strokeStyle = "#ea4335";
        ctx.beginPath();
        ctx.moveTo(400, 710); ctx.lineTo(400, 660); ctx.lineTo(450, 660);
        ctx.stroke();
        // Top Right Blue
        ctx.strokeStyle = "#4285f4";
        ctx.beginPath();
        ctx.moveTo(1050, 660); ctx.lineTo(1100, 660); ctx.lineTo(1100, 710);
        ctx.stroke();
        // Bottom Left Yellow
        ctx.strokeStyle = "#fbbc05";
        ctx.beginPath();
        ctx.moveTo(400, 1260); ctx.lineTo(400, 1310); ctx.lineTo(450, 1310);
        ctx.stroke();
        // Bottom Right Green
        ctx.strokeStyle = "#34a853";
        ctx.beginPath();
        ctx.moveTo(1050, 1310); ctx.lineTo(1100, 1310); ctx.lineTo(1100, 1260);
        ctx.stroke();

        // Subheadline
        ctx.fillStyle = "#475569";
        ctx.font = "500 36px sans-serif";
        ctx.fillText(subheadline, 750, 1420);

        // Watermark Footer
        ctx.fillStyle = "#64748b";
        ctx.font = "700 32px sans-serif";
        ctx.fillText("powered by myrevlink.in", 750, 1880);

      } else if (templateId === "google_ring") {
        // 4 Color Ring Header
        ctx.lineWidth = 24;
        ctx.beginPath(); ctx.arc(750, 260, 180, 0, Math.PI * 0.5); ctx.strokeStyle = "#fbbc05"; ctx.stroke();
        ctx.beginPath(); ctx.arc(750, 260, 180, Math.PI * 0.5, Math.PI); ctx.strokeStyle = "#34a853"; ctx.stroke();
        ctx.beginPath(); ctx.arc(750, 260, 180, Math.PI, Math.PI * 1.5); ctx.strokeStyle = "#4285f4"; ctx.stroke();
        ctx.beginPath(); ctx.arc(750, 260, 180, Math.PI * 1.5, Math.PI * 2); ctx.strokeStyle = "#ea4335"; ctx.stroke();

        ctx.fillStyle = "#1e293b";
        ctx.font = "500 42px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Review us on", 750, 240);
        ctx.font = "900 76px sans-serif";
        ctx.fillStyle = "#4285f4";
        ctx.fillText("Google", 750, 310);

        // Business Name
        ctx.fillStyle = accentColor;
        ctx.font = "800 64px sans-serif";
        ctx.fillText(businessName, 750, 520);

        // QR Code Container
        drawRoundedRect(425, 600, 650, 650, 36, "#ffffff", "#cbd5e1", 4);
        ctx.drawImage(qrImg, 475, 650, 550, 550);

        // Subheadline
        ctx.fillStyle = "#475569";
        ctx.font = "500 34px sans-serif";
        ctx.fillText(subheadline, 750, 1400);

        // Bottom 4-color strip
        ctx.fillStyle = "#ea4335"; ctx.fillRect(150, 1750, 300, 20);
        ctx.fillStyle = "#34a853"; ctx.fillRect(450, 1750, 300, 20);
        ctx.fillStyle = "#4285f4"; ctx.fillRect(750, 1750, 300, 20);
        ctx.fillStyle = "#fbbc05"; ctx.fillRect(1050, 1750, 300, 20);

        // Footer
        ctx.fillStyle = "#64748b";
        ctx.font = "700 32px sans-serif";
        ctx.fillText("SMART QR by myrevlink.in", 750, 1880);

      } else if (templateId === "multi_connect") {
        // Business Header
        ctx.fillStyle = accentColor;
        ctx.font = "900 72px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(businessName.toUpperCase(), 750, 180);

        ctx.fillStyle = "#ea4335";
        ctx.font = "800 48px sans-serif";
        ctx.fillText("CONNECT WITH US & LEAVE A REVIEW", 750, 260);

        // Center Outer Card
        drawRoundedRect(200, 320, 1100, 1380, 40, "#fef3c7", "#fde68a", 4);

        // QR Code Inside Card
        drawRoundedRect(450, 400, 600, 600, 32, "#ffffff", "#cbd5e1", 4);
        ctx.drawImage(qrImg, 490, 440, 520, 520);

        // Contact Pills Grid
        drawRoundedRect(280, 1060, 940, 120, 20, "#ffffff");
        ctx.fillStyle = "#1e293b"; ctx.font = "600 38px sans-serif";
        ctx.fillText(`📞  ${phone}`, 750, 1135);

        drawRoundedRect(280, 1220, 940, 120, 20, "#ffffff");
        ctx.fillText(`✉️  ${email}`, 750, 1295);

        drawRoundedRect(280, 1380, 940, 120, 20, "#ffffff");
        ctx.fillText(`📍  ${location}`, 750, 1455);

        // Footer
        ctx.fillStyle = "#64748b";
        ctx.font = "700 32px sans-serif";
        ctx.fillText("powered by myrevlink.in", 750, 1880);

      } else if (templateId === "premium_wave") {
        // Cream canvas header
        ctx.fillStyle = "#0f172a";
        ctx.font = "800 58px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Scan QR & Leave us a Review on", 750, 200);

        ctx.fillStyle = "#4285f4";
        ctx.font = "900 84px sans-serif";
        ctx.fillText("Google", 750, 300);

        ctx.fillStyle = "#f59e0b";
        ctx.font = "64px sans-serif";
        ctx.fillText("★ ★ ★ ★ ★", 750, 390);

        // QR Container with yellow border and scan me tag
        drawRoundedRect(425, 470, 650, 650, 48, "#ffffff", "#f59e0b", 8);
        ctx.drawImage(qrImg, 475, 520, 550, 550);

        // Script Tag
        drawRoundedRect(600, 440, 300, 70, 35, "#f59e0b");
        ctx.fillStyle = "#ffffff";
        ctx.font = "700 36px sans-serif";
        ctx.fillText("scan me", 750, 488);

        // Handwriting Thank You Script
        ctx.fillStyle = "#1d4ed8";
        ctx.font = "italic 700 68px sans-serif";
        ctx.fillText(thankyouNote, 750, 1220);

        // Bottom Wave Footer
        ctx.fillStyle = "#2563eb";
        ctx.beginPath();
        ctx.moveTo(0, 1400);
        ctx.quadraticCurveTo(750, 1300, 1500, 1400);
        ctx.lineTo(1500, 2000);
        ctx.lineTo(0, 2000);
        ctx.closePath();
        ctx.fill();

        // Footer Content inside Wave
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 64px sans-serif";
        ctx.fillText(businessName, 750, 1650);

        ctx.font = "600 36px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fillText("powered by myrevlink.in", 750, 1740);

      } else if (templateId === "monochrome_star") {
        // Top Business Logo Placeholder / Circle
        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(750, 200, 110, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 4; ctx.strokeStyle = "#0f172a"; ctx.stroke();

        ctx.fillStyle = "#0f172a"; ctx.font = "700 32px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(businessName, 750, 210);

        // Script Header
        ctx.fillStyle = "#0f172a";
        ctx.font = "700 64px sans-serif";
        ctx.fillText("thanks for your business!", 750, 380);

        ctx.font = "500 38px sans-serif";
        ctx.fillStyle = "#475569";
        ctx.fillText("Impressed with our products or service?", 750, 450);

        // QR Code
        drawRoundedRect(425, 520, 650, 650, 36, "#ffffff", "#0f172a", 6);
        ctx.drawImage(qrImg, 475, 570, 550, 550);

        // Subheadline callout
        ctx.fillStyle = "#0f172a";
        ctx.font = "700 42px sans-serif";
        ctx.fillText("Scan code & leave us a 5-star review on", 750, 1280);

        ctx.fillStyle = "#4285f4";
        ctx.font = "900 76px sans-serif";
        ctx.fillText("Google", 750, 1370);

        ctx.fillStyle = "#fbbc05";
        ctx.font = "60px sans-serif";
        ctx.fillText("★ ★ ★ ★ ★", 750, 1460);

        // Footer
        ctx.fillStyle = "#64748b";
        ctx.font = "700 32px sans-serif";
        ctx.fillText("powered by myrevlink.in", 750, 1880);
      }

      // Export Canvas as High-Res PNG File
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = `${businessName.toLowerCase().replace(/\s+/g, "-")}-review-qr.png`;
      a.href = dataUrl;
      a.click();
    };
  };

  // Browser Print Handler
  const handlePrint = () => {
    if (!isPaid && onCheckout) {
      onCheckout();
      return;
    }
    window.print();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", width: "100%" }}>
      
      {/* Hidden High-Res Canvas */}
      <canvas ref={hiddenCanvasRef} style={{ display: "none" }} />

      {/* Main Grid: Left Controls & Right Live Preview */}
      <div className="qr-generator-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
        
        {/* LEFT COLUMN: CUSTOMIZATION CONTROLS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          {/* Template Selector */}
          <div style={{ background: "white", padding: "1.75rem", borderRadius: "1.25rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.15rem", color: "#0f172a", margin: 0, fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>🎨 Select QR Poster Template</span>
              </h3>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, background: "#eff6ff", color: "#2563eb", padding: "0.25rem 0.6rem", borderRadius: "1rem" }}>
                5 Designs
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {PREDEFINED_TEMPLATES.map((tpl) => {
                const active = templateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateId(tpl.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.85rem 1rem",
                      borderRadius: "0.85rem",
                      border: active ? "2px solid #2563eb" : "1px solid #cbd5e1",
                      background: active ? "#f0f6ff" : "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "0.5rem",
                      background: tpl.previewBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                    }}>
                      QR
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: active ? "#1e40af" : "#0f172a" }}>
                        {tpl.name}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.15rem" }}>
                        {tpl.subtitle}
                      </div>
                    </div>
                    {active && (
                      <span style={{ color: "#2563eb", fontSize: "1.25rem", fontWeight: "bold" }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Inputs */}
          <div style={{ background: "white", padding: "1.75rem", borderRadius: "1.25rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontSize: "1.15rem", color: "#0f172a", marginBottom: "1.25rem", fontWeight: 800 }}>
              ⚙️ Customize Details
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* Business Name */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Galaxy Unisex Salon"
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>
                  Business Logo (Optional)
                </label>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ fontSize: "0.85rem", cursor: "pointer" }}
                  />
                  {businessLogo && (
                    <button
                      type="button"
                      onClick={() => setBusinessLogo("")}
                      style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", padding: "0.3rem 0.6rem", borderRadius: "0.4rem", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }}
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>

              {/* Review Link */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>
                  Google Review Link
                </label>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <input
                    type="url"
                    value={reviewLink}
                    onChange={(e) => setReviewLink(e.target.value)}
                    placeholder="https://g.page/r/..."
                    style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                  <button
                    type="button"
                    onClick={handlePasteLink}
                    style={{ padding: "0.75rem 1.25rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "0.6rem", color: "#475569", fontWeight: 600, cursor: "pointer" }}
                  >
                    Paste
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowInstructions(!showInstructions)}
                  style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", padding: "0.2rem 0", textDecoration: "underline" }}
                >
                  ❓ How to find your Google Business review link?
                </button>

                {showInstructions && (
                  <div style={{ marginTop: "0.75rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.6rem", padding: "1rem", fontSize: "0.8rem", color: "#475569", lineHeight: 1.5 }}>
                    <p style={{ margin: "0 0 0.5rem 0", fontWeight: 700, color: "#0f172a" }}>Follow these steps:</p>
                    <ol style={{ paddingLeft: "1.2rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <li>Search for your business on Google Search or Maps.</li>
                      <li>Logged into your Google Business account, click <strong>"Ask for reviews"</strong>.</li>
                      <li>Copy the short review link and paste it here.</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Headline & Subheadline */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>
                  Headline Banner
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>
                  Subheadline / Instructions
                </label>
                <textarea
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  rows={2}
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem", resize: "none" }}
                />
              </div>

              {/* Script Note for Premium & Monochrome templates */}
              {(templateId === "premium_wave" || templateId === "monochrome_star") && (
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>
                    Cursive Handwriting Script Note
                  </label>
                  <input
                    type="text"
                    value={thankyouNote}
                    onChange={(e) => setThankyouNote(e.target.value)}
                    placeholder="e.g. Thank you for your visit!"
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.6rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                </div>
              )}

              {/* Accent Palette */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem" }}>
                  Accent Theme Color
                </label>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                  {COLOR_PALETTES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setAccentColor(c.value)}
                      title={c.name}
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        background: c.value,
                        border: accentColor === c.value ? "3px solid #0f172a" : "1px solid rgba(0,0,0,0.15)",
                        cursor: "pointer",
                        outline: "none"
                      }}
                    />
                  ))}
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    style={{ width: "34px", height: "34px", border: "none", background: "none", cursor: "pointer" }}
                  />
                </div>
              </div>

              {/* Extra details for Multi-Connect */}
              {templateId === "multi_connect" && (
                <>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Phone Number</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.9rem" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Email Address</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.9rem" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Location Tag</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.9rem" }} />
                  </div>
                </>
              )}

              {/* Save Settings Button */}
              {showSaveButton && onSave && (
                <div style={{ marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      width: "100%",
                      background: "#0f172a",
                      color: "white",
                      padding: "0.85rem",
                      borderRadius: "0.6rem",
                      fontWeight: 700,
                      cursor: saving ? "wait" : "pointer",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transition: "background 0.2s"
                    }}
                  >
                    {saving ? "Saving Customization..." : "💾 Save QR Customization"}
                  </button>
                  {saveMessage && (
                    <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: saveMessage.includes("Failed") ? "#ef4444" : "#10b981", fontWeight: 600, textAlign: "center" }}>
                      {saveMessage}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE VISUAL POSTER PREVIEW */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "440px", alignItems: "center" }}>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a" }}>👁️ Live Print Preview</span>
            <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>A4 Aspect Ratio</span>
          </div>

          {/* PRINTABLE POSTER CONTAINER (Targeted by #printable-poster) */}
          <div
            id="printable-poster"
            style={{
              width: "100%",
              maxWidth: "440px",
              aspectRatio: "3/4",
              background: templateId === "premium_wave" ? "#faf7f2" : "#ffffff",
              borderRadius: "1.5rem",
              border: `1px solid #e2e8f0`,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
              boxSizing: "border-box",
              padding: templateId === "google_arch" ? "0 0 1.25rem 0" : "1.75rem 1.5rem 1.25rem 1.5rem"
            }}
          >
            {/* TEMPLATE 1: GOOGLE ARCH CLASSIC */}
            {templateId === "google_arch" && (
              <>
                {/* Colorful top arch header */}
                <div style={{ width: "100%", height: "90px", display: "flex", position: "relative" }}>
                  <div style={{ flex: 1, background: "#ea4335" }} />
                  <div style={{ flex: 1, background: "#fbbc05" }} />
                  <div style={{ flex: 1, background: "#34a853" }} />
                  <div style={{ flex: 1, background: "#4285f4" }} />
                  
                  {/* Google G logo circle */}
                  <div style={{
                    position: "absolute",
                    bottom: "-35px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: "white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "3px solid white"
                  }}>
                    <svg width="42" height="42" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>
                </div>

                <div style={{ textAlign: "center", marginTop: "2rem", width: "100%", padding: "0 1.5rem" }}>
                  <div style={{ color: "#fbbc05", fontSize: "1.2rem", letterSpacing: "2px", marginBottom: "0.2rem" }}>
                    ★★★★★
                  </div>
                  <h2 style={{ fontSize: "1.15rem", margin: 0, fontWeight: 800, color: "#0f172a", textTransform: "uppercase" }}>
                    {headline}
                  </h2>
                  <div style={{
                    marginTop: "0.6rem",
                    background: "#f8fafc",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.6rem",
                    border: "1px solid #e2e8f0",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: accentColor
                  }}>
                    {businessName}
                  </div>
                </div>

                {/* QR Code Container with Google color frame corners */}
                <div style={{ position: "relative", padding: "0.6rem" }}>
                  {/* Corner Accents */}
                  <div style={{ position: "absolute", top: 0, left: 0, width: "18px", height: "18px", borderTop: "4px solid #ea4335", borderLeft: "4px solid #ea4335", borderRadius: "4px 0 0 0" }} />
                  <div style={{ position: "absolute", top: 0, right: 0, width: "18px", height: "18px", borderTop: "4px solid #4285f4", borderRight: "4px solid #4285f4", borderRadius: "0 4px 0 0" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, width: "18px", height: "18px", borderBottom: "4px solid #fbbc05", borderLeft: "4px solid #fbbc05", borderRadius: "0 0 0 4px" }} />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: "18px", height: "18px", borderBottom: "4px solid #34a853", borderRight: "4px solid #34a853", borderRadius: "0 0 4px 0" }} />

                  <div style={{ background: "white", padding: "0.6rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(reviewLink)}`}
                      alt="Review QR Code"
                      style={{ width: "160px", height: "160px", display: "block" }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: "center", padding: "0 1.5rem" }}>
                  <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.3 }}>
                    {subheadline}
                  </p>
                </div>

                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span>powered by</span>
                  <span style={{ color: "#2563eb" }}>myrevlink.in</span>
                </div>
              </>
            )}

            {/* TEMPLATE 2: GOOGLE RING MINIMAL */}
            {templateId === "google_ring" && (
              <>
                <div style={{ textAlign: "center", width: "100%" }}>
                  {/* Google Ring Badge */}
                  <div style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "6px solid transparent",
                    borderTopColor: "#4285f4",
                    borderRightColor: "#ea4335",
                    borderBottomColor: "#fbbc05",
                    borderLeftColor: "#34a853",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.5rem"
                  }}>
                    <span style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 600 }}>Review us on</span>
                    <span style={{ fontSize: "1rem", color: "#4285f4", fontWeight: 900, marginTop: "-2px" }}>Google</span>
                  </div>

                  <h3 style={{ margin: "0.75rem 0 0 0", fontSize: "1.1rem", color: accentColor, fontWeight: 800 }}>
                    {businessName}
                  </h3>
                </div>

                <div style={{ background: "white", padding: "0.8rem", borderRadius: "1rem", border: "1px solid #cbd5e1", boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(reviewLink)}`}
                    alt="Review QR Code"
                    style={{ width: "160px", height: "160px", display: "block" }}
                  />
                </div>

                <div style={{ textAlign: "center", width: "100%" }}>
                  <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.78rem", color: "#475569" }}>
                    {subheadline}
                  </p>
                  
                  {/* Bottom 4-color strip */}
                  <div style={{ display: "flex", height: "4px", width: "80%", margin: "0 auto", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ flex: 1, background: "#ea4335" }} />
                    <div style={{ flex: 1, background: "#34a853" }} />
                    <div style={{ flex: 1, background: "#4285f4" }} />
                    <div style={{ flex: 1, background: "#fbbc05" }} />
                  </div>
                </div>

                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>
                  SMART QR by myrevlink.in
                </div>
              </>
            )}

            {/* TEMPLATE 3: MULTI-CONNECT BADGE */}
            {templateId === "multi_connect" && (
              <>
                <div style={{ textAlign: "center", width: "100%" }}>
                  <h2 style={{ fontSize: "1.2rem", margin: 0, fontWeight: 900, color: accentColor }}>
                    {businessName}
                  </h2>
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#ea4335", textTransform: "uppercase", marginTop: "0.25rem" }}>
                    CONNECT WITH US & LEAVE A REVIEW
                  </div>
                </div>

                <div style={{ width: "100%", background: "#fef3c7", padding: "1rem", borderRadius: "1rem", border: "1px solid #fde68a", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ background: "white", padding: "0.6rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(reviewLink)}`}
                      alt="Review QR Code"
                      style={{ width: "130px", height: "130px", display: "block" }}
                    />
                  </div>

                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.72rem", fontWeight: 600, color: "#1e293b" }}>
                    <div style={{ background: "white", padding: "0.4rem 0.6rem", borderRadius: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span>📞</span> <span>{phone}</span>
                    </div>
                    <div style={{ background: "white", padding: "0.4rem 0.6rem", borderRadius: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span>✉️</span> <span>{email}</span>
                    </div>
                    <div style={{ background: "white", padding: "0.4rem 0.6rem", borderRadius: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span>📍</span> <span>{location}</span>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>
                  powered by myrevlink.in
                </div>
              </>
            )}

            {/* TEMPLATE 4: PREMIUM WAVE & SCRIPT */}
            {templateId === "premium_wave" && (
              <>
                <div style={{ textAlign: "center", width: "100%" }}>
                  <h3 style={{ fontSize: "0.95rem", margin: 0, fontWeight: 800, color: "#0f172a" }}>
                    Scan QR & Leave us a Review on
                  </h3>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#4285f4", marginTop: "0.1rem" }}>
                    Google
                  </div>
                  <div style={{ color: "#f59e0b", fontSize: "1.1rem" }}>★★★★★</div>
                </div>

                {/* QR with script tag */}
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#f59e0b",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    padding: "0.2rem 0.8rem",
                    borderRadius: "1rem",
                    zIndex: 2,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                  }}>
                    scan me
                  </div>
                  <div style={{ background: "white", padding: "0.8rem", borderRadius: "1.25rem", border: "4px solid #f59e0b", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(reviewLink)}`}
                      alt="Review QR Code"
                      style={{ width: "140px", height: "140px", display: "block" }}
                    />
                  </div>
                </div>

                {/* Handwriting Cursive Note */}
                <div style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: "1.4rem", color: "#1d4ed8", fontWeight: 700 }}>
                  {thankyouNote}
                </div>

                {/* Blue Wave Footer */}
                <div style={{
                  width: "120%",
                  marginLeft: "-10%",
                  background: "#2563eb",
                  padding: "1rem 1.5rem 0.75rem 1.5rem",
                  borderRadius: "50% 50% 0 0 / 20% 20% 0 0",
                  textAlign: "center",
                  color: "white"
                }}>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>{businessName}</div>
                  <div style={{ fontSize: "0.68rem", opacity: 0.9, marginTop: "0.2rem" }}>powered by myrevlink.in</div>
                </div>
              </>
            )}

            {/* TEMPLATE 5: MONOCHROME STAR CARD */}
            {templateId === "monochrome_star" && (
              <>
                <div style={{ textAlign: "center", width: "100%" }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    border: "2px solid #0f172a",
                    margin: "0 auto 0.4rem auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    overflow: "hidden"
                  }}>
                    {businessLogo ? (
                      <img src={businessLogo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      "LOGO"
                    )}
                  </div>

                  <div style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: "1.35rem", color: "#0f172a", fontWeight: 700 }}>
                    {thankyouNote}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.1rem" }}>
                    Impressed with our products or service?
                  </div>
                </div>

                <div style={{ background: "white", padding: "0.8rem", borderRadius: "1rem", border: "2px solid #0f172a", boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(reviewLink)}`}
                    alt="Review QR Code"
                    style={{ width: "140px", height: "140px", display: "block" }}
                  />
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a" }}>
                    Scan code to leave us a 5-star review on
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#4285f4", margin: "0.1rem 0" }}>
                    Google
                  </div>
                  <div style={{ color: "#fbbc05", fontSize: "1.1rem" }}>★★★★★</div>
                </div>

                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>
                  powered by myrevlink.in
                </div>
              </>
            )}

          </div>

          {/* Action Download & Print Buttons */}
          <div style={{ display: "flex", gap: "1rem", width: "100%", maxWidth: "440px" }}>
            <button
              type="button"
              onClick={handleDownloadPNG}
              style={{
                flex: 1,
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "0.9rem 1rem",
                borderRadius: "0.75rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
              }}
            >
              <span>🖼️ Download PNG Image</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                background: "#ffffff",
                color: "#0f172a",
                border: "1px solid #cbd5e1",
                padding: "0.9rem 1.25rem",
                borderRadius: "0.75rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <span>🖨️ Print</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
