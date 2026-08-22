"use client";

import React, { useState, useRef, useEffect } from "react";

export interface QRTemplateConfig {
  templateId: string;
  sizeId?: string;
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
    subtitle: "Reference 1 - Arch header & corner frame",
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
    subtitle: "Reference 3 - Contact details & social card",
    tag: "Business",
    previewBg: "linear-gradient(135deg, #fbbc05, #ea4335)"
  },
  {
    id: "premium_wave",
    name: "Premium Wave & Script",
    subtitle: "Reference 4 - Gold frame, script & wave",
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

export const PRINT_SIZES = [
  {
    id: "a4",
    name: "A4 Poster",
    dimensions: "210 × 297 mm",
    aspectRatio: "3/4",
    tag: "Default Poster",
    widthPx: 1500,
    heightPx: 2000
  },
  {
    id: "counter_standee",
    name: "Counter Standee",
    dimensions: '4" × 6" (10 × 15 cm)',
    aspectRatio: "2/3",
    tag: "Tabletop Display",
    widthPx: 1200,
    heightPx: 1800
  },
  {
    id: "square_desk",
    name: "Square Desk Card",
    dimensions: '4" × 4" (10 × 10 cm)',
    aspectRatio: "1/1",
    tag: "Desk / Table Stand",
    widthPx: 1400,
    heightPx: 1400
  },
  {
    id: "business_card",
    name: "Handout Card",
    dimensions: '3.5" × 2" (8.9 × 5.1 cm)',
    aspectRatio: "3.5/2",
    tag: "Compact Card",
    widthPx: 1400,
    heightPx: 800
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
  // Form State
  const [templateId, setTemplateId] = useState<string>(initialConfig?.templateId || "google_arch");
  const [sizeId, setSizeId] = useState<string>(initialConfig?.sizeId || "a4");
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

  // Get active size details
  const activeSize = PRINT_SIZES.find(s => s.id === sizeId) || PRINT_SIZES[0];

  // Sync state when initialConfig updates
  useEffect(() => {
    if (initialConfig?.templateId) setTemplateId(initialConfig.templateId);
    if (initialConfig?.sizeId) setSizeId(initialConfig.sizeId);
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

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(reviewLink || "https://myrevlink.in")}`;

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
        sizeId,
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
      setSaveMessage("Customization saved successfully.");
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

    // Use dimensions of the selected size
    const W = activeSize.widthPx;
    const H = activeSize.heightPx;
    canvas.width = W;
    canvas.height = H;

    ctx.clearRect(0, 0, W, H);

    // Draw background based on template
    if (templateId === "premium_wave") {
      ctx.fillStyle = "#faf7f2";
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
    }

    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = qrImageUrl;

    const renderCanvasContent = () => {
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

      if (templateId === "google_arch") {
        ctx.fillStyle = "#ea4335"; ctx.fillRect(0, 0, W * 0.25, H * 0.07);
        ctx.fillStyle = "#fbbc05"; ctx.fillRect(W * 0.25, 0, W * 0.25, H * 0.07);
        ctx.fillStyle = "#34a853"; ctx.fillRect(W * 0.5, 0, W * 0.25, H * 0.07);
        ctx.fillStyle = "#4285f4"; ctx.fillRect(W * 0.75, 0, W * 0.25, H * 0.07);

        ctx.fillStyle = "#ffffff";
        ctx.beginPath(); ctx.arc(W / 2, H * 0.07, W * 0.075, 0, Math.PI * 2); ctx.fill();
        ctx.shadowColor = "rgba(0,0,0,0.1)"; ctx.shadowBlur = 15; ctx.lineWidth = 6; ctx.strokeStyle = "#ffffff"; ctx.stroke();
        ctx.shadowColor = "transparent";

        ctx.fillStyle = "#4285f4"; ctx.font = `900 ${Math.round(W * 0.065)}px sans-serif`; ctx.textAlign = "center"; ctx.fillText("G", W / 2, H * 0.088);
        ctx.fillStyle = "#fbbc05"; ctx.font = `${Math.round(W * 0.04)}px sans-serif`; ctx.fillText("★ ★ ★ ★ ★", W / 2, H * 0.155);

        ctx.fillStyle = "#0f172a"; ctx.font = `800 ${Math.round(W * 0.045)}px sans-serif`; ctx.fillText(headline.toUpperCase(), W / 2, H * 0.21);

        drawRoundedRect(W * 0.15, H * 0.24, W * 0.7, H * 0.065, 24, "#f8fafc", "#e2e8f0", 4);
        ctx.fillStyle = accentColor; ctx.font = `800 ${Math.round(W * 0.04)}px sans-serif`; ctx.fillText(businessName, W / 2, H * 0.285);

        const qrBoxSize = Math.min(W * 0.45, H * 0.35);
        const qrBoxX = (W - qrBoxSize) / 2;
        const qrBoxY = H * 0.33;

        drawRoundedRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 32, "#ffffff", "#e2e8f0", 4);
        ctx.drawImage(qrImg, qrBoxX + 25, qrBoxY + 25, qrBoxSize - 50, qrBoxSize - 50);

        // Corner accents
        ctx.lineWidth = 12; ctx.lineCap = "round";
        ctx.strokeStyle = "#ea4335"; ctx.beginPath(); ctx.moveTo(qrBoxX - 15, qrBoxY + 40); ctx.lineTo(qrBoxX - 15, qrBoxY - 15); ctx.lineTo(qrBoxX + 40, qrBoxY - 15); ctx.stroke();
        ctx.strokeStyle = "#4285f4"; ctx.beginPath(); ctx.moveTo(qrBoxX + qrBoxSize - 40, qrBoxY - 15); ctx.lineTo(qrBoxX + qrBoxSize + 15, qrBoxY - 15); ctx.lineTo(qrBoxX + qrBoxSize + 15, qrBoxY + 40); ctx.stroke();
        ctx.strokeStyle = "#fbbc05"; ctx.beginPath(); ctx.moveTo(qrBoxX - 15, qrBoxY + qrBoxSize - 40); ctx.lineTo(qrBoxX - 15, qrBoxY + qrBoxSize + 15); ctx.lineTo(qrBoxX + 40, qrBoxY + qrBoxSize + 15); ctx.stroke();
        ctx.strokeStyle = "#34a853"; ctx.beginPath(); ctx.moveTo(qrBoxX + qrBoxSize - 40, qrBoxY + qrBoxSize + 15); ctx.lineTo(qrBoxX + qrBoxSize + 15, qrBoxY + qrBoxSize + 15); ctx.lineTo(qrBoxX + qrBoxSize + 15, qrBoxY + qrBoxSize - 40); ctx.stroke();

        ctx.fillStyle = "#475569"; ctx.font = `500 ${Math.round(W * 0.024)}px sans-serif`; ctx.fillText(subheadline, W / 2, H * 0.78);
        ctx.fillStyle = "#64748b"; ctx.font = `700 ${Math.round(W * 0.022)}px sans-serif`; ctx.fillText("powered by myrevlink.in", W / 2, H * 0.94);

      } else if (templateId === "google_ring") {
        const ringR = Math.min(W, H) * 0.12;
        ctx.lineWidth = 20;
        ctx.beginPath(); ctx.arc(W / 2, H * 0.15, ringR, 0, Math.PI * 0.5); ctx.strokeStyle = "#fbbc05"; ctx.stroke();
        ctx.beginPath(); ctx.arc(W / 2, H * 0.15, ringR, Math.PI * 0.5, Math.PI); ctx.strokeStyle = "#34a853"; ctx.stroke();
        ctx.beginPath(); ctx.arc(W / 2, H * 0.15, ringR, Math.PI, Math.PI * 1.5); ctx.strokeStyle = "#4285f4"; ctx.stroke();
        ctx.beginPath(); ctx.arc(W / 2, H * 0.15, ringR, Math.PI * 1.5, Math.PI * 2); ctx.strokeStyle = "#ea4335"; ctx.stroke();

        ctx.fillStyle = "#1e293b"; ctx.font = `500 ${Math.round(W * 0.028)}px sans-serif`; ctx.textAlign = "center"; ctx.fillText("Review us on", W / 2, H * 0.135);
        ctx.font = `900 ${Math.round(W * 0.048)}px sans-serif`; ctx.fillStyle = "#4285f4"; ctx.fillText("Google", W / 2, H * 0.175);

        ctx.fillStyle = accentColor; ctx.font = `800 ${Math.round(W * 0.042)}px sans-serif`; ctx.fillText(businessName, W / 2, H * 0.28);

        const qrBoxSize = Math.min(W * 0.45, H * 0.38);
        const qrBoxX = (W - qrBoxSize) / 2;
        const qrBoxY = H * 0.33;

        drawRoundedRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 36, "#ffffff", "#cbd5e1", 4);
        ctx.drawImage(qrImg, qrBoxX + 25, qrBoxY + 25, qrBoxSize - 50, qrBoxSize - 50);

        ctx.fillStyle = "#475569"; ctx.font = `500 ${Math.round(W * 0.024)}px sans-serif`; ctx.fillText(subheadline, W / 2, H * 0.77);

        ctx.fillStyle = "#ea4335"; ctx.fillRect(W * 0.1, H * 0.88, W * 0.2, 16);
        ctx.fillStyle = "#34a853"; ctx.fillRect(W * 0.3, H * 0.88, W * 0.2, 16);
        ctx.fillStyle = "#4285f4"; ctx.fillRect(W * 0.5, H * 0.88, W * 0.2, 16);
        ctx.fillStyle = "#fbbc05"; ctx.fillRect(W * 0.7, H * 0.88, W * 0.2, 16);

        ctx.fillStyle = "#64748b"; ctx.font = `700 ${Math.round(W * 0.022)}px sans-serif`; ctx.fillText("SMART QR by myrevlink.in", W / 2, H * 0.95);

      } else if (templateId === "multi_connect") {
        ctx.fillStyle = accentColor; ctx.font = `900 ${Math.round(W * 0.045)}px sans-serif`; ctx.textAlign = "center"; ctx.fillText(businessName.toUpperCase(), W / 2, H * 0.09);
        ctx.fillStyle = "#ea4335"; ctx.font = `800 ${Math.round(W * 0.03)}px sans-serif`; ctx.fillText("CONNECT WITH US & LEAVE A REVIEW", W / 2, H * 0.135);

        drawRoundedRect(W * 0.1, H * 0.16, W * 0.8, H * 0.74, 40, "#fef3c7", "#fde68a", 4);
        
        const qrBoxSize = Math.min(W * 0.4, H * 0.3);
        const qrBoxX = (W - qrBoxSize) / 2;
        const qrBoxY = H * 0.2;

        drawRoundedRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 32, "#ffffff", "#cbd5e1", 4);
        ctx.drawImage(qrImg, qrBoxX + 20, qrBoxY + 20, qrBoxSize - 40, qrBoxSize - 40);

        const pillY = H * 0.55;
        const pillH = H * 0.07;
        const pillGap = H * 0.085;

        drawRoundedRect(W * 0.15, pillY, W * 0.7, pillH, 20, "#ffffff");
        ctx.fillStyle = "#1e293b"; ctx.font = `600 ${Math.round(W * 0.025)}px sans-serif`; ctx.fillText(`Phone: ${phone}`, W / 2, pillY + pillH * 0.65);

        drawRoundedRect(W * 0.15, pillY + pillGap, W * 0.7, pillH, 20, "#ffffff");
        ctx.fillText(`Email: ${email}`, W / 2, pillY + pillGap + pillH * 0.65);

        drawRoundedRect(W * 0.15, pillY + pillGap * 2, W * 0.7, pillH, 20, "#ffffff");
        ctx.fillText(`Location: ${location}`, W / 2, pillY + pillGap * 2 + pillH * 0.65);

        ctx.fillStyle = "#64748b"; ctx.font = `700 ${Math.round(W * 0.022)}px sans-serif`; ctx.fillText("powered by myrevlink.in", W / 2, H * 0.95);

      } else if (templateId === "premium_wave") {
        ctx.fillStyle = "#0f172a"; ctx.font = `800 ${Math.round(W * 0.038)}px sans-serif`; ctx.textAlign = "center"; ctx.fillText("Scan QR & Leave us a Review on", W / 2, H * 0.1);
        ctx.fillStyle = "#4285f4"; ctx.font = `900 ${Math.round(W * 0.055)}px sans-serif`; ctx.fillText("Google", W / 2, H * 0.155);
        ctx.fillStyle = "#f59e0b"; ctx.font = `${Math.round(W * 0.04)}px sans-serif`; ctx.fillText("★ ★ ★ ★ ★", W / 2, H * 0.2);

        const qrBoxSize = Math.min(W * 0.45, H * 0.35);
        const qrBoxX = (W - qrBoxSize) / 2;
        const qrBoxY = H * 0.24;

        drawRoundedRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 48, "#ffffff", "#f59e0b", 8);
        ctx.drawImage(qrImg, qrBoxX + 25, qrBoxY + 25, qrBoxSize - 50, qrBoxSize - 50);

        drawRoundedRect(W * 0.4, qrBoxY - 25, W * 0.2, 50, 25, "#f59e0b");
        ctx.fillStyle = "#ffffff"; ctx.font = `700 ${Math.round(W * 0.024)}px sans-serif`; ctx.fillText("scan me", W / 2, qrBoxY + 8);

        ctx.fillStyle = "#1d4ed8"; ctx.font = `italic 700 ${Math.round(W * 0.045)}px 'Caveat', cursive, sans-serif`; ctx.fillText(thankyouNote, W / 2, H * 0.65);

        ctx.fillStyle = "#2563eb";
        ctx.beginPath(); ctx.moveTo(0, H * 0.72); ctx.quadraticCurveTo(W / 2, H * 0.66, W, H * 0.72); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();

        ctx.fillStyle = "#ffffff"; ctx.font = `900 ${Math.round(W * 0.042)}px sans-serif`; ctx.fillText(businessName, W / 2, H * 0.84);
        ctx.font = `600 ${Math.round(W * 0.024)}px sans-serif`; ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.fillText("powered by myrevlink.in", W / 2, H * 0.9);

      } else if (templateId === "monochrome_star") {
        ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(W / 2, H * 0.1, W * 0.07, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 4; ctx.strokeStyle = "#0f172a"; ctx.stroke();

        ctx.fillStyle = "#0f172a"; ctx.font = `700 ${Math.round(W * 0.024)}px sans-serif`; ctx.textAlign = "center"; ctx.fillText(businessName, W / 2, H * 0.105);

        ctx.fillStyle = "#0f172a"; ctx.font = `700 ${Math.round(W * 0.045)}px 'Caveat', cursive, sans-serif`; ctx.fillText("thanks for your business!", W / 2, H * 0.2);
        ctx.font = `500 ${Math.round(W * 0.026)}px sans-serif`; ctx.fillStyle = "#475569"; ctx.fillText("Impressed with our products or service?", W / 2, H * 0.24);

        const qrBoxSize = Math.min(W * 0.45, H * 0.35);
        const qrBoxX = (W - qrBoxSize) / 2;
        const qrBoxY = H * 0.28;

        drawRoundedRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 36, "#ffffff", "#0f172a", 6);
        ctx.drawImage(qrImg, qrBoxX + 25, qrBoxY + 25, qrBoxSize - 50, qrBoxSize - 50);

        ctx.fillStyle = "#0f172a"; ctx.font = `700 ${Math.round(W * 0.028)}px sans-serif`; ctx.fillText("Scan code & leave us a 5-star review on", W / 2, H * 0.7);
        ctx.fillStyle = "#4285f4"; ctx.font = `900 ${Math.round(W * 0.05)}px sans-serif`; ctx.fillText("Google", W / 2, H * 0.76);
        ctx.fillStyle = "#fbbc05"; ctx.font = `${Math.round(W * 0.04)}px sans-serif`; ctx.fillText("★ ★ ★ ★ ★", W / 2, H * 0.82);

        ctx.fillStyle = "#64748b"; ctx.font = `700 ${Math.round(W * 0.022)}px sans-serif`; ctx.fillText("powered by myrevlink.in", W / 2, H * 0.94);
      }

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.download = `${businessName.toLowerCase().replace(/\s+/g, "-")}-${sizeId}-review-qr.png`;
      a.href = dataUrl;
      a.click();
    };

    qrImg.onload = renderCanvasContent;
    qrImg.onerror = () => {
      renderCanvasContent();
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
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", width: "100%" }}>
      
      {/* Hidden High-Res Canvas */}
      <canvas ref={hiddenCanvasRef} style={{ display: "none" }} />

      {/* Main Responsive Grid Layout */}
      <div className="qr-customizer-container" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "2.5rem", width: "100%", alignItems: "start" }}>
        
        {/* LEFT COLUMN: CONTROLS & FORM */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          {/* Print / Display Size Selector Card */}
          <div style={{ background: "white", padding: "1.75rem", borderRadius: "1.25rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.15rem", color: "#0f172a", margin: 0, fontWeight: 800 }}>
                Select Print & Display Size
              </h3>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, background: "#eff6ff", color: "#2563eb", padding: "0.25rem 0.65rem", borderRadius: "1rem" }}>
                {activeSize.name}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {PRINT_SIZES.map((sz) => {
                const active = sizeId === sz.id;
                return (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setSizeId(sz.id)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                      padding: "0.85rem",
                      borderRadius: "0.85rem",
                      border: active ? "2px solid #2563eb" : "1px solid #cbd5e1",
                      background: active ? "#f0f6ff" : "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.9rem", color: active ? "#1e40af" : "#0f172a" }}>
                        {sz.name}
                      </span>
                      {active && (
                        <span style={{ color: "#2563eb", fontWeight: "bold", fontSize: "0.9rem" }}>✓</span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
                      {sz.dimensions}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: active ? "#2563eb" : "#94a3b8", fontWeight: 600, marginTop: "0.2rem" }}>
                      {sz.tag}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template Selector Dropdown */}
          <div style={{ background: "white", padding: "1.75rem", borderRadius: "1.25rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.15rem", color: "#0f172a", margin: 0, fontWeight: 800 }}>
                Select Poster Template
              </h3>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, background: "#eff6ff", color: "#2563eb", padding: "0.25rem 0.65rem", borderRadius: "1rem" }}>
                {PREDEFINED_TEMPLATES.length} Templates
              </span>
            </div>

            <div style={{ position: "relative" }}>
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.9rem 2.5rem 0.9rem 1.1rem",
                  borderRadius: "0.85rem",
                  border: "2px solid #2563eb",
                  background: "#f0f6ff",
                  outline: "none",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#1e40af",
                  cursor: "pointer",
                  appearance: "none",
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.1)"
                }}
              >
                {PREDEFINED_TEMPLATES.map((tpl) => (
                  <option key={tpl.id} value={tpl.id} style={{ background: "#ffffff", color: "#0f172a", padding: "0.5rem" }}>
                    {tpl.name} ({tpl.subtitle})
                  </option>
                ))}
              </select>

              {/* Dropdown Chevron Icon */}
              <div style={{ position: "absolute", right: "1.1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#2563eb" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            {/* Active Template Badge Summary */}
            {(() => {
              const activeTpl = PREDEFINED_TEMPLATES.find(t => t.id === templateId) || PREDEFINED_TEMPLATES[0];
              return (
                <div style={{
                  marginTop: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  padding: "0.75rem 1rem",
                  background: "#f8fafc",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0"
                }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "0.5rem",
                    background: activeTpl.previewBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "0.8rem"
                  }}>
                    QR
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f172a" }}>
                      Active: {activeTpl.name}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "#64748b" }}>
                      {activeTpl.subtitle}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Customization Details Form */}
          <div style={{ background: "white", padding: "1.75rem", borderRadius: "1.25rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontSize: "1.15rem", color: "#0f172a", marginBottom: "1.25rem", fontWeight: 800 }}>
              Customize Details
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
                  How to find your Google Business review link?
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

              {/* Accent Color Palette */}
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
                    {saving ? "Saving Changes..." : "Save Changes"}
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

        {/* RIGHT COLUMN: LIVE POSTER PREVIEW */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", position: "sticky", top: "2rem" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: "440px", alignItems: "center" }}>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a" }}>Live Preview</span>
            <span style={{ fontSize: "0.8rem", color: "#2563eb", fontWeight: 700, background: "#eff6ff", padding: "0.2rem 0.5rem", borderRadius: "0.4rem" }}>
              {activeSize.name} ({activeSize.dimensions})
            </span>
          </div>

          {/* PRINTABLE POSTER CONTAINER (Targeted by #printable-poster) */}
          <div
            id="printable-poster"
            style={{
              width: "100%",
              maxWidth: "440px",
              aspectRatio: activeSize.aspectRatio,
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
              padding: templateId === "google_arch" ? "0 0 1.25rem 0" : "1.75rem 1.5rem 1.25rem 1.5rem",
              transition: "aspect-ratio 0.3s ease"
            }}
          >
            {/* TEMPLATE 1: GOOGLE ARCH CLASSIC */}
            {templateId === "google_arch" && (
              <>
                <div style={{ width: "100%", height: "80px", display: "flex", position: "relative" }}>
                  <div style={{ flex: 1, background: "#ea4335" }} />
                  <div style={{ flex: 1, background: "#fbbc05" }} />
                  <div style={{ flex: 1, background: "#34a853" }} />
                  <div style={{ flex: 1, background: "#4285f4" }} />
                  
                  <div style={{
                    position: "absolute",
                    bottom: "-30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "3px solid white"
                  }}>
                    <svg width="36" height="36" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  </div>
                </div>

                <div style={{ textAlign: "center", marginTop: "1.75rem", width: "100%", padding: "0 1.25rem" }}>
                  <div style={{ color: "#fbbc05", fontSize: "1.1rem", letterSpacing: "2px", marginBottom: "0.15rem" }}>
                    ★★★★★
                  </div>
                  <h2 style={{ fontSize: sizeId === "business_card" ? "0.9rem" : "1.1rem", margin: 0, fontWeight: 800, color: "#0f172a", textTransform: "uppercase" }}>
                    {headline}
                  </h2>
                  <div style={{
                    marginTop: "0.4rem",
                    background: "#f8fafc",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "0.6rem",
                    border: "1px solid #e2e8f0",
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    color: accentColor
                  }}>
                    {businessName}
                  </div>
                </div>

                {/* QR Code Container */}
                <div style={{ position: "relative", padding: "0.5rem" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "16px", height: "16px", borderTop: "4px solid #ea4335", borderLeft: "4px solid #ea4335", borderRadius: "4px 0 0 0" }} />
                  <div style={{ position: "absolute", top: 0, right: 0, width: "16px", height: "16px", borderTop: "4px solid #4285f4", borderRight: "4px solid #4285f4", borderRadius: "0 4px 0 0" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, width: "16px", height: "16px", borderBottom: "4px solid #fbbc05", borderLeft: "4px solid #fbbc05", borderRadius: "0 0 0 4px" }} />
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: "16px", height: "16px", borderBottom: "4px solid #34a853", borderRight: "4px solid #34a853", borderRadius: "0 0 4px 0" }} />

                  <div style={{ background: "white", padding: "0.5rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}>
                    <img
                      src={qrImageUrl}
                      alt="Review QR Code"
                      style={{
                        width: sizeId === "business_card" ? "90px" : sizeId === "square_desk" ? "120px" : "150px",
                        height: sizeId === "business_card" ? "90px" : sizeId === "square_desk" ? "120px" : "150px",
                        display: "block",
                        objectFit: "contain"
                      }}
                    />
                  </div>
                </div>

                {sizeId !== "business_card" && (
                  <div style={{ textAlign: "center", padding: "0 1.25rem" }}>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#475569", lineHeight: 1.3 }}>
                      {subheadline}
                    </p>
                  </div>
                )}

                <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span>powered by</span>
                  <span style={{ color: "#2563eb" }}>myrevlink.in</span>
                </div>
              </>
            )}

            {/* TEMPLATE 2: GOOGLE RING MINIMAL */}
            {templateId === "google_ring" && (
              <>
                <div style={{ textAlign: "center", width: "100%" }}>
                  <div style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    border: "5px solid transparent",
                    borderTopColor: "#4285f4",
                    borderRightColor: "#ea4335",
                    borderBottomColor: "#fbbc05",
                    borderLeftColor: "#34a853",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.4rem"
                  }}>
                    <span style={{ fontSize: "0.6rem", color: "#64748b", fontWeight: 600 }}>Review us on</span>
                    <span style={{ fontSize: "0.95rem", color: "#4285f4", fontWeight: 900, marginTop: "-2px" }}>Google</span>
                  </div>

                  <h3 style={{ margin: "0.5rem 0 0 0", fontSize: "1.05rem", color: accentColor, fontWeight: 800 }}>
                    {businessName}
                  </h3>
                </div>

                <div style={{ background: "white", padding: "0.7rem", borderRadius: "1rem", border: "1px solid #cbd5e1", boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
                  <img
                    src={qrImageUrl}
                    alt="Review QR Code"
                    style={{
                      width: sizeId === "business_card" ? "90px" : sizeId === "square_desk" ? "120px" : "150px",
                      height: sizeId === "business_card" ? "90px" : sizeId === "square_desk" ? "120px" : "150px",
                      display: "block",
                      objectFit: "contain"
                    }}
                  />
                </div>

                <div style={{ textAlign: "center", width: "100%" }}>
                  {sizeId !== "business_card" && (
                    <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.75rem", color: "#475569" }}>
                      {subheadline}
                    </p>
                  )}
                  
                  <div style={{ display: "flex", height: "4px", width: "80%", margin: "0 auto", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ flex: 1, background: "#ea4335" }} />
                    <div style={{ flex: 1, background: "#34a853" }} />
                    <div style={{ flex: 1, background: "#4285f4" }} />
                    <div style={{ flex: 1, background: "#fbbc05" }} />
                  </div>
                </div>

                <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>
                  SMART QR by myrevlink.in
                </div>
              </>
            )}

            {/* TEMPLATE 3: MULTI-CONNECT BADGE */}
            {templateId === "multi_connect" && (
              <>
                <div style={{ textAlign: "center", width: "100%" }}>
                  <h2 style={{ fontSize: "1.15rem", margin: 0, fontWeight: 900, color: accentColor }}>
                    {businessName}
                  </h2>
                  <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#ea4335", textTransform: "uppercase", marginTop: "0.2rem" }}>
                    CONNECT WITH US & LEAVE A REVIEW
                  </div>
                </div>

                <div style={{ width: "100%", background: "#fef3c7", padding: "0.85rem", borderRadius: "1rem", border: "1px solid #fde68a", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
                  <div style={{ background: "white", padding: "0.5rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
                    <img
                      src={qrImageUrl}
                      alt="Review QR Code"
                      style={{
                        width: sizeId === "business_card" ? "80px" : "120px",
                        height: sizeId === "business_card" ? "80px" : "120px",
                        display: "block",
                        objectFit: "contain"
                      }}
                    />
                  </div>

                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.3rem", fontSize: "0.68rem", fontWeight: 600, color: "#1e293b" }}>
                    <div style={{ background: "white", padding: "0.35rem 0.5rem", borderRadius: "0.4rem" }}>
                      Phone: {phone}
                    </div>
                    <div style={{ background: "white", padding: "0.35rem 0.5rem", borderRadius: "0.4rem" }}>
                      Email: {email}
                    </div>
                    {sizeId !== "business_card" && (
                      <div style={{ background: "white", padding: "0.35rem 0.5rem", borderRadius: "0.4rem" }}>
                        Location: {location}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>
                  powered by myrevlink.in
                </div>
              </>
            )}

            {/* TEMPLATE 4: PREMIUM WAVE & SCRIPT */}
            {templateId === "premium_wave" && (
              <>
                <div style={{ textAlign: "center", width: "100%" }}>
                  <h3 style={{ fontSize: "0.9rem", margin: 0, fontWeight: 800, color: "#0f172a" }}>
                    Scan QR & Leave us a Review on
                  </h3>
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#4285f4", marginTop: "0.1rem" }}>
                    Google
                  </div>
                  <div style={{ color: "#f59e0b", fontSize: "1rem" }}>★★★★★</div>
                </div>

                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#f59e0b",
                    color: "white",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    padding: "0.15rem 0.7rem",
                    borderRadius: "1rem",
                    zIndex: 2,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                  }}>
                    scan me
                  </div>
                  <div style={{ background: "white", padding: "0.7rem", borderRadius: "1.25rem", border: "4px solid #f59e0b", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}>
                    <img
                      src={qrImageUrl}
                      alt="Review QR Code"
                      style={{
                        width: sizeId === "business_card" ? "85px" : sizeId === "square_desk" ? "110px" : "135px",
                        height: sizeId === "business_card" ? "85px" : sizeId === "square_desk" ? "110px" : "135px",
                        display: "block",
                        objectFit: "contain"
                      }}
                    />
                  </div>
                </div>

                <div style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: "1.3rem", color: "#1d4ed8", fontWeight: 700 }}>
                  {thankyouNote}
                </div>

                <div style={{
                  width: "120%",
                  marginLeft: "-10%",
                  background: "#2563eb",
                  padding: "0.85rem 1.25rem 0.65rem 1.25rem",
                  borderRadius: "50% 50% 0 0 / 20% 20% 0 0",
                  textAlign: "center",
                  color: "white"
                }}>
                  <div style={{ fontWeight: 800, fontSize: "1rem" }}>{businessName}</div>
                  <div style={{ fontSize: "0.65rem", opacity: 0.9, marginTop: "0.15rem" }}>powered by myrevlink.in</div>
                </div>
              </>
            )}

            {/* TEMPLATE 5: MONOCHROME STAR CARD */}
            {templateId === "monochrome_star" && (
              <>
                <div style={{ textAlign: "center", width: "100%" }}>
                  <div style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    border: "2px solid #0f172a",
                    margin: "0 auto 0.3rem auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
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

                  <div style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: "1.25rem", color: "#0f172a", fontWeight: 700 }}>
                    {thankyouNote}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#475569", marginTop: "0.1rem" }}>
                    Impressed with our products or service?
                  </div>
                </div>

                <div style={{ background: "white", padding: "0.7rem", borderRadius: "1rem", border: "2px solid #0f172a", boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}>
                  <img
                    src={qrImageUrl}
                    alt="Review QR Code"
                    style={{
                      width: sizeId === "business_card" ? "85px" : sizeId === "square_desk" ? "110px" : "135px",
                      height: sizeId === "business_card" ? "85px" : sizeId === "square_desk" ? "110px" : "135px",
                      display: "block",
                      objectFit: "contain"
                    }}
                  />
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0f172a" }}>
                    Scan code to leave us a 5-star review on
                  </div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#4285f4", margin: "0.1rem 0" }}>
                    Google
                  </div>
                  <div style={{ color: "#fbbc05", fontSize: "1rem" }}>★★★★★</div>
                </div>

                <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700 }}>
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
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
              }}
            >
              Download PNG Image
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
                cursor: "pointer"
              }}
            >
              Print Poster
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
