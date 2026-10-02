"use client";

import React, { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How much does Google Business Profile management cost?",
    answer:
      "One-time setup & optimization costs ₹14,999 ($199). Ongoing monthly management starts at ₹11,999/mo ($149/mo) and includes 4 weekly Google posts, citation building, review generation, and monthly ranking reports. Multi-location packages for brands and franchises start at ₹34,999/mo ($399/mo).",
  },
  {
    question: "How long until my business ranks in the Google Map Pack 3-Pack?",
    answer:
      "Most local businesses see meaningful ranking improvements and an uptick in customer calls within 60 to 90 days. High-competition niches in major metros (like Delhi NCR, Mumbai, Bangalore, or New York) typically take 3 to 5 months. Review velocity, citation consistency, and weekly posts are the primary levers that move map rankings.",
  },
  {
    question: "Can you manage GMB for multiple locations or service-area businesses?",
    answer:
      "Yes. We manage multi-location accounts with bulk posting, centralized review monitoring, and per-location ranking reports. For service-area businesses (like plumbers, electricians, or consultants without a physical storefront), we configure precise service radius zones while adhering strictly to Google's address display guidelines.",
  },
  {
    question: "How do you handle negative reviews and policy suspensions?",
    answer:
      "We respond to every review professionally within 24 hours. For fake, spam, or policy-violating reviews, we build evidence cases and submit removal requests directly to Google. If your profile encounters a 'Soft' or 'Hard' suspension, our team prepares and submits the reinstatement appeal documents.",
  },
  {
    question: "How does MyRevLink's review system integrate with GMB management?",
    answer:
      "Google's ranking algorithm strongly rewards review freshness and keyword diversity. As part of our service, you receive our proprietary MyRevLink AI review QR kits and digital links. Customers scan a counter QR code, pick 5 stars, and publish an authentic, keyword-optimized review to your Google profile in 15 seconds.",
  },
  {
    question: "Is there any long-term contract or lock-in?",
    answer:
      "No. Our monthly growth plans operate on a flexible month-to-month basis. You can pause or cancel at any time with zero penalty. Everything we optimize—your profile improvements, citations, photos, and reviews—remains 100% yours forever.",
  },
  {
    question: "What access do you need to start managing my profile?",
    answer:
      "You simply invite our agency email as a 'Manager' in your Google Business Profile settings. You retain 100% Primary Ownership of your Google account at all times. We never request your personal Google account password.",
  },
];

export default function GmbFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}>
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        const numberStr = (idx + 1).toString().padStart(2, "0");

        return (
          <div
            key={idx}
            style={{
              background: isOpen ? "#ffffff" : "#f8fafc",
              border: isOpen ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
              borderRadius: "14px",
              overflow: "hidden",
              transition: "all 0.25s ease",
              boxShadow: isOpen ? "0 10px 25px -5px rgba(37, 99, 235, 0.08)" : "none",
            }}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              style={{
                width: "100%",
                padding: "1.25rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                background: "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: isOpen ? "#2563eb" : "#94a3b8",
                    letterSpacing: "0.1em",
                  }}
                >
                  {numberStr}
                </span>
                <span
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 700,
                    color: isOpen ? "#1e3a8a" : "#0f172a",
                    lineHeight: 1.4,
                  }}
                >
                  {faq.question}
                </span>
              </span>

              <span
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: isOpen ? "#eff6ff" : "#ffffff",
                  border: "1px solid #e2e8f0",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  color: isOpen ? "#2563eb" : "#64748b",
                  transition: "transform 0.25s ease",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>

            {isOpen && (
              <div
                style={{
                  padding: "0 1.5rem 1.5rem 3.5rem",
                  color: "#475569",
                  fontSize: "0.9375rem",
                  lineHeight: 1.65,
                  borderTop: "1px solid #f1f5f9",
                  paddingTop: "1rem",
                }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
