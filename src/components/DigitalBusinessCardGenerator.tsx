"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const TEMPLATE_PRESETS = [
  { id: "classic", name: "Classic Corporate", bg: "#1e293b", text: "#f8fafc", accent: "#f59e0b", font: "serif" },
  { id: "modern", name: "Modern Creator", bg: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", text: "#ffffff", accent: "#f472b6", font: "sans-serif" },
  { id: "elegant", name: "Elegant Luxury", bg: "#fafaf9", text: "#1c1917", accent: "#78350f", font: "serif" },
  { id: "minimalist", name: "Minimalist Light", bg: "#f8fafc", text: "#0f172a", accent: "#3b82f6", font: "sans-serif" },
  { id: "neon", name: "Neon Vibe", bg: "#09090b", text: "#f4f4f5", accent: "#06b6d4", font: "monospace" },
];

export function DigitalBusinessCardGenerator() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Input states
  const [fullName, setFullName] = useState("John Doe");
  const [jobTitle, setJobTitle] = useState("Marketing Director");
  const [companyName, setCompanyName] = useState("Acme Corp");
  const [email, setEmail] = useState("john@acme.com");
  const [phone, setPhone] = useState("+1 (555) 019-2834");
  const [website, setWebsite] = useState("www.acme.com");
  const [address, setAddress] = useState("123 Business St, New York");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/johndoe");
  const [instagram, setInstagram] = useState("instagram.com/johndoe");

  // Logo & Destination states
  const [logoBase64, setLogoBase64] = useState<string>("");
  const [qrDestination, setQrDestination] = useState<"website" | "map">("website");
  const [mapUrl, setMapUrl] = useState("https://maps.google.com/?q=Acme+Corp");
  const [isFlipped, setIsFlipped] = useState(false);

  // Edit Security states
  const [editPin, setEditPin] = useState("");
  const [token, setToken] = useState("");
  const [loadedSlug, setLoadedSlug] = useState("");

  // Selection & UI states
  const [templateId, setTemplateId] = useState("classic");
  const [customAccent, setCustomAccent] = useState("");
  const [copied, setCopied] = useState(false);

  // Save Card States
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState("");
  const [publishedToken, setPublishedToken] = useState("");
  
  // Link copied states inside success modal
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [magicLinkCopied, setMagicLinkCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentTemplate = TEMPLATE_PRESETS.find(t => t.id === templateId) || TEMPLATE_PRESETS[0];
  const accentColor = customAccent || currentTemplate.accent;

  const qrDataValue = qrDestination === "website" ? website : mapUrl;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrDataValue.startsWith("http") ? qrDataValue : "https://" + qrDataValue)}`;

  // Load existing card if token is present
  useEffect(() => {
    const queryToken = searchParams.get("token");
    if (queryToken) {
      const fetchCard = async () => {
        const { data, error } = await supabase
          .from("digital_cards")
          .select("*")
          .eq("edit_token", queryToken)
          .single();

        if (data && !error) {
          setFullName(data.full_name || "");
          setJobTitle(data.job_title || "");
          setCompanyName(data.company_name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setWebsite(data.website || "");
          setAddress(data.address || "");
          setLinkedin(data.linkedin || "");
          setInstagram(data.instagram || "");
          setLogoBase64(data.logo_base64 || "");
          setQrDestination(data.qr_destination || "website");
          setMapUrl(data.map_url || "");
          setTemplateId(data.template_id || "classic");
          setCustomAccent(data.custom_accent || "");
          setEditPin(data.edit_pin || "");
          setToken(queryToken);
          setLoadedSlug(data.slug || "");
        }
      };
      fetchCard();
    } else {
      // Generate a random 4-digit PIN on initial page load if not in edit mode
      const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
      setEditPin(randomPin);
    }
  }, [searchParams]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = () => {
    const text = `Name: ${fullName}\nTitle: ${jobTitle} at ${companyName}\nPhone: ${phone}\nEmail: ${email}\nWeb: ${website}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");

    try {
      const response = await fetch("/api/digital-card/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          jobTitle,
          companyName,
          email,
          phone,
          website,
          address,
          linkedin,
          instagram,
          logoBase64,
          qrDestination,
          mapUrl,
          templateId,
          customAccent,
          editPin,
          token,
          slug: loadedSlug
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setPublishedSlug(data.slug);
        setPublishedToken(data.token);
        setToken(data.token);
        setLoadedSlug(data.slug);
        setPublishSuccess(true);
      } else {
        setSaveError(data.error || "Failed to save card profile");
      }
    } catch (err: any) {
      setSaveError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadFront = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 1050, 600);

    // Background
    if (templateId === "modern") {
      const grad = ctx.createLinearGradient(0, 0, 1050, 600);
      grad.addColorStop(0, "#6366f1");
      grad.addColorStop(1, "#a855f7");
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = currentTemplate.bg;
    }
    ctx.fillRect(0, 0, 1050, 600);

    // Border highlights
    if (templateId === "neon") {
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(10, 10, 1030, 580);
    } else if (templateId === "classic") {
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 1010, 560);
    }

    const getFont = (size: number, weight: string = "normal") => {
      const family = currentTemplate.font === "serif" ? "Georgia, serif" : currentTemplate.font === "monospace" ? "Courier New, monospace" : "system-ui, sans-serif";
      return `${weight} ${size}px ${family}`;
    };

    ctx.fillStyle = currentTemplate.text;

    // Left Column: Business & Name
    ctx.textAlign = "left";
    ctx.font = getFont(48, "bold");
    ctx.fillText(fullName, 80, 180);

    ctx.fillStyle = accentColor;
    ctx.font = getFont(24, "600");
    ctx.fillText(jobTitle.toUpperCase(), 80, 225);

    ctx.fillStyle = currentTemplate.text;
    ctx.font = getFont(32, "500");
    ctx.fillText(companyName, 80, 275);

    // Divider
    ctx.strokeStyle = templateId === "minimalist" ? "#e2e8f0" : "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 320);
    ctx.lineTo(970, 320);
    ctx.stroke();

    ctx.fillStyle = currentTemplate.text;
    ctx.font = getFont(20);

    ctx.fillText(`📞  ${phone}`, 80, 390);
    ctx.fillText(`📧  ${email}`, 80, 440);
    ctx.fillText(`🌐  ${website}`, 80, 490);

    ctx.fillText(`📍  ${address}`, 550, 390);
    if (linkedin) ctx.fillText(`🔗  LinkedIn: ${linkedin}`, 550, 440);
    if (instagram) ctx.fillText(`📸  Instagram: ${instagram}`, 550, 490);

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${fullName.toLowerCase().replace(/\s+/g, "-")}-card-front.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleDownloadBack = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 1050, 600);

    // Background
    if (templateId === "modern") {
      const grad = ctx.createLinearGradient(0, 0, 1050, 600);
      grad.addColorStop(0, "#6366f1");
      grad.addColorStop(1, "#a855f7");
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = currentTemplate.bg;
    }
    ctx.fillRect(0, 0, 1050, 600);

    // Border highlights
    if (templateId === "neon") {
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 8;
      ctx.strokeRect(10, 10, 1030, 580);
    } else if (templateId === "classic") {
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 1010, 560);
    }

    const getFont = (size: number, weight: string = "normal") => {
      const family = currentTemplate.font === "serif" ? "Georgia, serif" : currentTemplate.font === "monospace" ? "Courier New, monospace" : "system-ui, sans-serif";
      return `${weight} ${size}px ${family}`;
    };

    const triggerDownload = () => {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${fullName.toLowerCase().replace(/\s+/g, "-")}-card-back.png`;
      link.href = dataUrl;
      link.click();
    };

    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = qrImageUrl;

    qrImg.onload = () => {
      // Draw QR Code
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(600, 130, 340, 340);
      ctx.drawImage(qrImg, 630, 160, 280, 280);

      // Label below QR
      ctx.fillStyle = currentTemplate.text;
      ctx.font = getFont(18, "500");
      ctx.textAlign = "center";
      ctx.fillText(`Scan to visit ${qrDestination === "website" ? "website" : "location"}`, 770, 500);

      // Left Block Content
      ctx.textAlign = "center";
      if (logoBase64) {
        const logoImg = new Image();
        logoImg.src = logoBase64;
        logoImg.onload = () => {
          ctx.drawImage(logoImg, 220, 130, 200, 200);
          ctx.fillStyle = currentTemplate.text;
          ctx.font = getFont(38, "bold");
          ctx.fillText(companyName, 320, 390);
          triggerDownload();
        };
      } else {
        ctx.fillStyle = currentTemplate.text;
        ctx.font = getFont(48, "bold");
        ctx.fillText(companyName, 320, 300);
        triggerDownload();
      }
    };
  };

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/c/${publishedSlug}` : "";
  const magicLinkUrl = typeof window !== "undefined" ? `${window.location.origin}/tools/digital-business-card?token=${publishedToken}` : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", width: "100%" }}>
      {/* Hidden high-res drawing canvas */}
      <canvas ref={canvasRef} width={1050} height={600} style={{ display: "none" }} />

      <div className="qr-generator-grid">
        
        {/* Left Side Inputs Form */}
        <form onSubmit={handleSaveCard} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "1.25rem", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "1.25rem", color: "#0f172a", marginBottom: "1.5rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {token ? (
                <span>✏️ Edit Digital Card</span>
              ) : (
                <>
                  <img src="/assets/business_card.png" alt="Business Card Icon" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
                  <span>Card Details</span>
                </>
              )}
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Job Title / Role</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Business Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ width: "100%", padding: "0.45rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.8rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Website</label>
                  <input
                    type="text"
                    required
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Office Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              {/* QR Destination Picker */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>QR Link Destination</label>
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", cursor: "pointer", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="qrDestination"
                      value="website"
                      checked={qrDestination === "website"}
                      onChange={() => setQrDestination("website")}
                    />
                    Business Website
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem", cursor: "pointer", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="qrDestination"
                      value="map"
                      checked={qrDestination === "map"}
                      onChange={() => setQrDestination("map")}
                    />
                    Google Map Location
                  </label>
                </div>
              </div>

              {qrDestination === "map" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Google Map Location URL</label>
                  <input
                    type="url"
                    required
                    value={mapUrl}
                    onChange={(e) => setMapUrl(e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>LinkedIn Username</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="linkedin.com/in/..."
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Instagram Username</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="instagram.com/..."
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              {/* Template Style */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Card Template</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {TEMPLATE_PRESETS.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        setTemplateId(tpl.id);
                        setCustomAccent("");
                      }}
                      style={{
                        padding: "0.6rem",
                        fontSize: "0.85rem",
                        borderRadius: "0.5rem",
                        border: templateId === tpl.id ? `2px solid ${accentColor}` : "1px solid #cbd5e1",
                        background: templateId === tpl.id ? `${accentColor}10` : "white",
                        color: templateId === tpl.id ? accentColor : "#475569",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Customization */}
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Custom Accent Color</label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setCustomAccent(e.target.value)}
                    style={{ width: "42px", height: "42px", border: "1px solid #cbd5e1", borderRadius: "0.5rem", cursor: "pointer", background: "none", padding: 0 }}
                  />
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Choose custom color to brand your card details</span>
                </div>
              </div>

              {/* Edit PIN details */}
              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>Create Edit PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={editPin}
                  onChange={(e) => setEditPin(e.target.value)}
                  placeholder="e.g. 1234"
                  style={{ width: "120px", padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.95rem", letterSpacing: "0.15em", textAlign: "center" }}
                />
                <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b", marginTop: "0.35rem" }}>
                  Used to verify ownership and edit details later. Keep this PIN safe.
                </span>
              </div>
            </div>
          </div>

          {saveError && (
            <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", padding: "0.75rem", borderRadius: "0.5rem", color: "#b91c1c", fontSize: "0.85rem" }}>
              ⚠️ {saveError}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              padding: "1rem",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)"
            }}
          >
            {saving ? "Saving Profile..." : token ? "💾 Save Updates" : "🚀 Save & Publish Card Online"}
          </button>
        </form>

        {/* Right Side Visual Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
          
          <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>
            🔄 Click card to flip and view the back side (QR Code)
          </span>

          {/* 3D Flip Card Container */}
          <div
            className={`flip-card-container ${isFlipped ? "is-flipped" : ""}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flip-card-inner">
              
              {/* CARD FRONT */}
              <div
                className="flip-card-front"
                style={{
                  backgroundColor: currentTemplate.bg.startsWith("linear") ? undefined : currentTemplate.bg,
                  backgroundImage: currentTemplate.bg.startsWith("linear") ? currentTemplate.bg : undefined,
                  border: templateId === "minimalist" ? "1px solid #e2e8f0" : templateId === "neon" ? `2px solid ${accentColor}` : templateId === "classic" ? `1px solid ${accentColor}` : "none",
                  color: currentTemplate.text,
                  fontFamily: currentTemplate.font === "serif" ? "Georgia, serif" : currentTemplate.font === "monospace" ? "Courier New, monospace" : "system-ui, sans-serif"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800 }}>{fullName}</h3>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {jobTitle}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, opacity: 0.9 }}>
                      {companyName}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.68rem", opacity: 0.9, borderTop: templateId === "minimalist" ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.1)", paddingTop: "0.75rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div>📞 {phone}</div>
                    <div>📧 {email}</div>
                    <div>🌐 {website}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div>📍 {address}</div>
                    {linkedin && <div>🔗 LinkedIn: {linkedin}</div>}
                    {instagram && <div>📸 Instagram: {instagram}</div>}
                  </div>
                </div>
              </div>

              {/* CARD BACK */}
              <div
                className="flip-card-back"
                style={{
                  backgroundColor: currentTemplate.bg.startsWith("linear") ? undefined : currentTemplate.bg,
                  backgroundImage: currentTemplate.bg.startsWith("linear") ? currentTemplate.bg : undefined,
                  border: templateId === "minimalist" ? "1px solid #e2e8f0" : templateId === "neon" ? `2px solid ${accentColor}` : templateId === "classic" ? `1px solid ${accentColor}` : "none",
                  color: currentTemplate.text,
                  fontFamily: currentTemplate.font === "serif" ? "Georgia, serif" : currentTemplate.font === "monospace" ? "Courier New, monospace" : "system-ui, sans-serif",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1.5rem"
                }}
              >
                {/* Left of Back: Logo / Brand */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", flex: 1, textAlign: "center" }}>
                  {logoBase64 ? (
                    <img 
                      src={logoBase64} 
                      alt="Logo" 
                      style={{ width: "70px", height: "70px", borderRadius: "0.5rem", objectFit: "cover", border: "1px solid rgba(255,255,255,0.2)" }} 
                    />
                  ) : (
                    <div style={{ width: "70px", height: "70px", borderRadius: "0.5rem", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                      🏢
                    </div>
                  )}
                  <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>{companyName}</h4>
                </div>

                {/* Right of Back: QR Code */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                  <div style={{ background: "white", padding: "0.5rem", borderRadius: "0.75rem", display: "flex" }}>
                    <img 
                      src={qrImageUrl} 
                      alt="Business QR" 
                      style={{ width: "100px", height: "100px", display: "block" }} 
                    />
                  </div>
                  <span style={{ fontSize: "0.55rem", opacity: 0.8, textAlign: "center" }}>
                    Scan to visit {qrDestination === "website" ? "website" : "location"}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: "480px" }}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={handleDownloadFront}
                style={{
                  flex: 1,
                  background: accentColor,
                  color: "white",
                  border: "none",
                  padding: "0.85rem",
                  borderRadius: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                }}
              >
                📥 Download Front (Free)
              </button>
              <button
                type="button"
                onClick={handleDownloadBack}
                style={{
                  flex: 1,
                  background: isFlipped ? accentColor : "#64748b",
                  color: "white",
                  border: "none",
                  padding: "0.85rem",
                  borderRadius: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  transition: "background 0.2s"
                }}
              >
                📥 Download Back with QR
              </button>
            </div>
            <button
              type="button"
              onClick={handleShare}
              style={{
                width: "100%",
                background: "white",
                color: "#475569",
                border: "1px solid #cbd5e1",
                padding: "0.85rem",
                borderRadius: "0.75rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {copied ? "Copied Info!" : "📋 Copy Card Text Details"}
            </button>
          </div>
        </div>

      </div>

      {/* Success Modal showing Magic link and Share Link */}
      {publishSuccess && (
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
          zIndex: 99999,
          padding: "1rem"
        }}>
          <div style={{
            background: "white",
            width: "100%",
            maxWidth: "500px",
            borderRadius: "1.5rem",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            animation: "fade-in 0.2s ease-out"
          }}>
            {/* Header */}
            <div style={{ background: "#10b981", color: "white", padding: "1.5rem", position: "relative" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>🎉 Card Published Successfully!</h3>
              <button
                onClick={() => setPublishSuccess(false)}
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
            <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* Share link block */}
              <div>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", color: "#0f172a", fontWeight: 700 }}>Public Share Link</h4>
                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.8rem", color: "#64748b" }}>Share this link with anyone to view your digital business card online:</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    style={{ flex: 1, padding: "0.6rem 0.8rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.85rem", background: "#f8fafc" }}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      setShareLinkCopied(true);
                      setTimeout(() => setShareLinkCopied(false), 2000);
                    }}
                    style={{ padding: "0.6rem 1rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "0.5rem", color: "#475569", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
                  >
                    {shareLinkCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Magic link block */}
              <div>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", color: "#0f172a", fontWeight: 700 }}>🔐 Magic Edit Link</h4>
                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.8rem", color: "#64748b" }}>Keep this link private! Anyone with this link can modify your business card details:</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    readOnly
                    value={magicLinkUrl}
                    style={{ flex: 1, padding: "0.6rem 0.8rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.85rem", background: "#f8fafc" }}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(magicLinkUrl);
                      setMagicLinkCopied(true);
                      setTimeout(() => setMagicLinkCopied(false), 2000);
                    }}
                    style={{ padding: "0.6rem 1rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "0.5rem", color: "#475569", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
                  >
                    {magicLinkCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Reminder Warning */}
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "1rem", borderRadius: "0.75rem", fontSize: "0.8rem", color: "#b45309", lineHeight: 1.5 }}>
                ⚠️ <strong>Important Reminder</strong>: Since no login account is required, please bookmark or copy both links now. To make updates from another device, you will also need to enter the Edit PIN you created: <strong>{editPin}</strong>.
              </div>

              <button
                onClick={() => setPublishSuccess(false)}
                style={{
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "0.8rem",
                  borderRadius: "0.5rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  marginTop: "0.5rem",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)"
                }}
              >
                Close & Return to Editor
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
