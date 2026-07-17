"use client";

import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessSlug: string;
  formTitle?: string;
  buttonText?: string;
  successMessage?: string;
  requiredFields?: 'email' | 'phone' | 'both';
}

export function ContactFormModal({
  isOpen,
  onClose,
  businessSlug,
  formTitle = "Contact Us",
  buttonText = "Send Inquiry",
  successMessage = "Thank you! We will get back to you soon.",
  requiredFields = 'email'
}: ContactFormModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const isEmailRequired = requiredFields === 'email' || requiredFields === 'both';
  const isPhoneRequired = requiredFields === 'phone' || requiredFields === 'both';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEmailRequired && !email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (isPhoneRequired && !phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s\-()]{7,18}$/;

    if (email.trim() && !emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (phone.trim() && !phoneRegex.test(phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: businessSlug,
          name,
          email,
          phone,
          message
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(8px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem"
    }}>
      {/* Modal Card */}
      <div 
        className="glass-card animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "480px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          padding: "2.5rem 2rem",
          borderRadius: "1.5rem",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "var(--muted)",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"}
          onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
        >
          &times;
        </button>

        {success ? (
          <div style={{ textAlign: "center", padding: "2rem 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "0.5rem"
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Submission Successful!</h2>
            <p style={{ color: "var(--secondary-foreground)", fontSize: "0.95rem", lineHeight: 1.5, margin: 0 }}>
              {successMessage}
            </p>
            <Button onClick={onClose} style={{ marginTop: "1rem" }}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem 0" }}>{formTitle}</h2>
              <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>
                Please fill in the details below to contact us.
              </p>
            </div>

            {error && (
              <div style={{
                padding: "0.75rem 1rem",
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "#ef4444",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem"
              }}>
                ⚠️ {error}
              </div>
            )}

            <Input
              label="Your Name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />

            <Input
              label={isEmailRequired ? "Email Address" : "Email Address (Optional)"}
              name="email"
              type="email"
              required={isEmailRequired}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />

            <Input
              label={isPhoneRequired ? "Phone Number" : "Phone Number (Optional)"}
              name="phone"
              type="tel"
              required={isPhoneRequired}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 (555) 000-0000"
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground)" }}>
                Message / Inquiry Details <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="How can we help you?"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  outline: "none",
                  resize: "vertical"
                }}
              />
            </div>

            <Button type="submit" variant="primary" disabled={loading} style={{ marginTop: "0.5rem" }}>
              {loading ? "Sending..." : buttonText}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
