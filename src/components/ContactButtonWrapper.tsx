"use client";

import React, { useState } from "react";
import { ContactFormModal } from "./ContactFormModal";

interface ContactButtonWrapperProps {
  businessSlug: string;
  buttonTitle: string;
  formTitle: string;
  successMessage: string;
  requiredFields?: 'email' | 'phone' | 'both';
}

export function ContactButtonWrapper({
  businessSlug,
  buttonTitle,
  formTitle,
  successMessage,
  requiredFields = 'email'
}: ContactButtonWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div style={{ width: "100%", marginTop: "0.5rem" }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{ width: "100%", display: "block", background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          <div
            className="glass-card primary-card"
            style={{
              gap: "0.75rem",
              padding: "1.25rem",
              background: "var(--primary)",
              color: "white",
              border: "none",
              transform: "scale(1)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span style={{ fontSize: "1.125rem", fontWeight: 600 }}>{buttonTitle}</span>
          </div>
        </button>
      </div>

      <ContactFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        businessSlug={businessSlug}
        formTitle={formTitle}
        buttonText={buttonTitle}
        successMessage={successMessage}
        requiredFields={requiredFields}
      />
    </>
  );
}
