"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QRPosterCustomizer, QRTemplateConfig } from "./QRPosterCustomizer";

interface GoogleReviewQRGeneratorProps {
  priceSymbol?: string;
  priceAmount?: string;
}

export function GoogleReviewQRGenerator({ priceSymbol = "$", priceAmount = "5" }: GoogleReviewQRGeneratorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Payment Modal State
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [email, setEmail] = useState("");

  const [currentConfig, setCurrentConfig] = useState<Partial<QRTemplateConfig>>({
    templateId: "google_arch",
    businessName: "Acme Bakery",
    reviewLink: "https://g.page/r/example-link/review",
    headline: "Scan to Rate Us on Google",
    subheadline: "Scan this code to write a quick Google Review & get AI assistance!",
    accentColor: "#1a73e8"
  });

  // Clean local storage logic for paid state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const paidState = localStorage.getItem(`mylinkrev_qr_paid_${currentConfig.businessName}`);
      if (paidState === "true") {
        setIsPaid(true);
      } else {
        setIsPaid(false);
      }
      // Load saved customization from localStorage if exists
      const savedConfig = localStorage.getItem("mylinkrev_qr_custom_config");
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig);
          setCurrentConfig(parsed);
        } catch (e) {}
      }
    }
  }, [currentConfig.businessName]);

  // Capture successful checkout redirect callback from Dodo Payments
  useEffect(() => {
    const success = searchParams.get("success");
    const paidBusiness = searchParams.get("businessName");

    if (success === "true" && paidBusiness) {
      setIsPaid(true);
      if (typeof window !== "undefined") {
        localStorage.setItem(`mylinkrev_qr_paid_${paidBusiness}`, "true");
      }
      router.replace("/tools/google-review-qr");
    }
  }, [searchParams, router]);

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
          businessName: currentConfig.businessName,
          email,
          reviewLink: currentConfig.reviewLink,
        }),
      });

      const data = await response.json();
      if (response.ok && data.checkoutUrl) {
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

  const handleSaveConfig = (newConfig: QRTemplateConfig) => {
    setCurrentConfig(newConfig);
    if (typeof window !== "undefined") {
      localStorage.setItem("mylinkrev_qr_custom_config", JSON.stringify(newConfig));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", width: "100%" }}>
      
      {/* Top Banner Info */}
      <div style={{
        background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        padding: "1.25rem 1.5rem",
        borderRadius: "1rem",
        border: "1px solid #bfdbfe",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ fontSize: "1.5rem" }}>💡</div>
          <div>
            <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#1e3a8a", fontWeight: 800 }}>
              Design & Print Custom Google Review QR Posters
            </h4>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#1e40af" }}>
              Select from 5 predefined templates, customize your branding & logo, and download high-res PNG posters.
            </p>
          </div>
        </div>

        {!isPaid && (
          <button
            type="button"
            onClick={() => setShowCheckout(true)}
            style={{
              background: "#2563eb",
              color: "white",
              padding: "0.6rem 1.25rem",
              borderRadius: "0.5rem",
              fontWeight: 700,
              fontSize: "0.85rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)"
            }}
          >
            Unlock Unlimited Poster Downloads ({priceSymbol}{priceAmount})
          </button>
        )}
      </div>

      {/* QR Poster Customizer Panel */}
      <QRPosterCustomizer
        initialConfig={currentConfig}
        onSave={handleSaveConfig}
        priceSymbol={priceSymbol}
        priceAmount={priceAmount}
        isPaid={isPaid}
        onCheckout={() => setShowCheckout(true)}
        showSaveButton={true}
      />

      {/* Checkout Modal */}
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
            <div style={{ background: "#2563eb", color: "white", padding: "1.5rem", position: "relative" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>Unlock High-Res PNG Poster</h3>
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
                  <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginTop: "0.25rem" }}>
                    We'll email you the receipt and high-resolution PNG poster downloads.
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
                    background: "#2563eb",
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
                  {loadingPayment ? "Redirecting to Checkout..." : `Pay ${priceSymbol}${priceAmount} & Unlock Downloads`}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
