"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardNav({ 
  leadsCount = 0,
  feedbackCount = 0 
}: { 
  leadsCount?: number;
  feedbackCount?: number;
}) {
  const pathname = usePathname();

  const isProfileActive = pathname === "/dashboard";
  const isLeadsActive = pathname === "/dashboard/leads";
  const isFeedbackActive = pathname === "/dashboard/feedback";

  return (
    <div style={{ 
      display: "flex", 
      gap: "0.75rem", 
      borderBottom: "1px solid var(--border)", 
      paddingBottom: "1rem", 
      marginBottom: "2rem",
      flexWrap: "wrap"
    }}>
      <Link 
        href="/dashboard" 
        style={{
          textDecoration: "none",
          padding: "0.6rem 1.2rem",
          borderRadius: "var(--radius-md)",
          fontWeight: 600,
          fontSize: "0.95rem",
          transition: "all 0.2s",
          background: isProfileActive ? "linear-gradient(90deg, var(--primary), var(--accent))" : "rgba(255, 255, 255, 0.03)",
          color: isProfileActive ? "white" : "var(--secondary-foreground)",
          border: isProfileActive ? "none" : "1px solid var(--border)",
          boxShadow: isProfileActive ? "0 4px 12px rgba(59, 130, 246, 0.25)" : "none"
        }}
      >
        Profile Settings
      </Link>
      <Link 
        href="/dashboard/leads" 
        style={{
          textDecoration: "none",
          padding: "0.6rem 1.2rem",
          borderRadius: "var(--radius-md)",
          fontWeight: 600,
          fontSize: "0.95rem",
          transition: "all 0.2s",
          background: isLeadsActive ? "linear-gradient(90deg, var(--primary), var(--accent))" : "rgba(255, 255, 255, 0.03)",
          color: isLeadsActive ? "white" : "var(--secondary-foreground)",
          border: isLeadsActive ? "none" : "1px solid var(--border)",
          boxShadow: isLeadsActive ? "0 4px 12px rgba(59, 130, 246, 0.25)" : "none"
        }}
      >
        Leads & Inquiries {leadsCount > 0 ? `(${leadsCount})` : ""}
      </Link>
      <Link 
        href="/dashboard/feedback" 
        style={{
          textDecoration: "none",
          padding: "0.6rem 1.2rem",
          borderRadius: "var(--radius-md)",
          fontWeight: 600,
          fontSize: "0.95rem",
          transition: "all 0.2s",
          background: isFeedbackActive ? "linear-gradient(90deg, var(--primary), var(--accent))" : "rgba(255, 255, 255, 0.03)",
          color: isFeedbackActive ? "white" : "var(--secondary-foreground)",
          border: isFeedbackActive ? "none" : "1px solid var(--border)",
          boxShadow: isFeedbackActive ? "0 4px 12px rgba(59, 130, 246, 0.25)" : "none"
        }}
      >
        Customer Feedback {feedbackCount > 0 ? `(${feedbackCount})` : ""}
      </Link>
    </div>
  );
}
