"use client";

import React, { useState } from "react";
import { Input } from "./ui/Input";
import { SubmitButton } from "./SubmitButton";

interface LeadsConfigFormProps {
  socials: any;
  action: (formData: FormData) => void;
}

export function LeadsConfigForm({ socials, action }: LeadsConfigFormProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "1.5rem", 
      padding: "1.5rem", 
      background: "rgba(255, 255, 255, 0.02)", 
      border: "1px solid var(--border)", 
      borderRadius: "var(--radius-md)" 
    }}>
      {/* Header with Collapsible Toggle Button */}
      <div 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          cursor: "pointer",
          userSelect: "none"
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
          Contact Form Configuration
        </h3>
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontSize: "1.25rem",
            cursor: "pointer",
            padding: "0.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s"
          }}
        >
          {isCollapsed ? "▼" : "▲"}
        </button>
      </div>

      {/* Collapsible Form Body */}
      {!isCollapsed && (
        <form action={action} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "0.5rem" }}>
          
          {/* Hide Contact Form Toggle */}
          <div className="input-group" style={{ flexDirection: "row", alignItems: "center", gap: "0.75rem", background: "rgba(59, 130, 246, 0.1)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: 0 }}>
            <input 
              type="checkbox" 
              name="hide_contact_form" 
              id="hide_contact_form" 
              defaultChecked={socials.hide_contact_form} 
              style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }} 
            />
            <label htmlFor="hide_contact_form" style={{ fontSize: "0.95rem", color: "var(--foreground)", cursor: "pointer" }}>
              <strong>Hide "Send Inquiry" button on my profile page</strong> <br/>
              <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                If checked, visitors won't be able to see the Contact Form or submit leads.
              </span>
            </label>
          </div>

          <Input 
            label="Contact Form Title" 
            name="contact_form_title" 
            defaultValue={socials.contact_form_title || 'Contact Us'} 
            placeholder="e.g. Book a Consultation" 
          />
          <Input 
            label="Contact Button Text" 
            name="contact_button_title" 
            defaultValue={socials.contact_button_title || 'Send Inquiry'} 
            placeholder="e.g. Send Request" 
          />
          <Input 
            label="Submission Success Message" 
            name="contact_success_message" 
            defaultValue={socials.contact_success_message || 'Thank you! We will get back to you soon.'} 
            placeholder="e.g. Got it! Talk to you soon." 
          />

          <div className="input-group" style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground)" }}>
              Required Fields in Contact Form
            </label>
            <select 
              name="contact_required_fields"
              defaultValue={socials.contact_required_fields || 'email'}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                fontSize: "1rem",
                fontFamily: "inherit",
                outline: "none"
              }}
            >
              <option value="email">Email Only (Phone optional)</option>
              <option value="phone">Phone Only (Email optional)</option>
              <option value="both">Both Email and Phone</option>
            </select>
          </div>

          <div style={{ marginTop: "0.5rem" }}>
            <SubmitButton>Save Form Settings</SubmitButton>
          </div>
        </form>
      )}
    </div>
  );
}
