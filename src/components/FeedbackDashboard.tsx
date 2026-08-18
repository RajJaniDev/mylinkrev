"use client";

import React, { useState, useTransition } from "react";

export interface FeedbackItem {
  id: string;
  name: string;
  contact: string;
  message: string;
  stars: number;
  created_at: string;
}

interface FeedbackDashboardProps {
  feedbacks: FeedbackItem[];
  deleteFeedbackAction: (id: string) => Promise<void>;
}

export function FeedbackDashboard({ feedbacks, deleteFeedbackAction }: FeedbackDashboardProps) {
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [isPending, startTransition] = useTransition();

  const filteredFeedbacks = feedbacks.filter(item => {
    if (filterRating === "all") return true;
    return item.stars === filterRating;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this customer feedback?")) {
      startTransition(async () => {
        await deleteFeedbackAction(id);
      });
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoString;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: "flex", gap: "2px", color: "#f59e0b" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            style={{ 
              color: star <= rating ? "#f59e0b" : "var(--border)",
              fontSize: "1.1rem"
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header & Filter Controls */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid var(--border)"
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>Customer Feedback & Reviews</h2>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "var(--secondary-foreground)" }}>
            Private customer reviews gathered for ratings of 3 stars or lower.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setFilterRating("all")}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "0.5rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              border: filterRating === "all" ? "none" : "1px solid var(--border)",
              background: filterRating === "all" ? "var(--primary)" : "transparent",
              color: filterRating === "all" ? "white" : "var(--foreground)"
            }}
          >
            All ({feedbacks.length})
          </button>
          {[3, 2, 1].map((r) => {
            const count = feedbacks.filter(f => f.stars === r).length;
            return (
              <button
                key={r}
                onClick={() => setFilterRating(r)}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: filterRating === r ? "none" : "1px solid var(--border)",
                  background: filterRating === r ? "var(--primary)" : "transparent",
                  color: filterRating === r ? "white" : "var(--foreground)"
                }}
              >
                {r} Stars ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedbacks List */}
      {filteredFeedbacks.length === 0 ? (
        <div style={{
          padding: "3rem 1.5rem",
          textAlign: "center",
          border: "1px dashed var(--border)",
          borderRadius: "1rem",
          color: "var(--muted)"
        }}>
          <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>No customer feedback found.</p>
          <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>
            When customers rate 3 stars or lower on your review page, their feedback will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredFeedbacks.map((item) => (
            <div 
              key={item.id}
              style={{
                padding: "1.25rem 1.5rem",
                borderRadius: "1rem",
                background: "color-mix(in srgb, var(--background) 70%, transparent)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
              }}
            >
              {/* Header Row: Stars, Date, Delete Action */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {renderStars(item.stars)}
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "0.375rem",
                    background: item.stars === 3 ? "rgba(245, 158, 11, 0.15)" : "rgba(239, 68, 68, 0.15)",
                    color: item.stars === 3 ? "#d97706" : "#ef4444",
                    border: item.stars === 3 ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)"
                  }}>
                    {item.stars} Star Rating
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: '0.8rem', color: "var(--muted)" }}>
                    {formatDate(item.created_at)}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.375rem",
                      transition: "background 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "none"}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.9rem" }}>
                <div>
                  <span style={{ color: "var(--muted)", marginRight: "0.4rem" }}>Customer Name:</span>
                  <strong style={{ color: "var(--foreground)" }}>{item.name}</strong>
                </div>
                <div>
                  <span style={{ color: "var(--muted)", marginRight: "0.4rem" }}>Contact:</span>
                  <strong style={{ color: "var(--primary)" }}>{item.contact}</strong>
                </div>
              </div>

              {/* Message Body */}
              <div style={{
                padding: "0.875rem 1rem",
                borderRadius: "0.5rem",
                background: "var(--background)",
                border: "1px solid var(--border)",
                fontSize: "0.95rem",
                lineHeight: 1.5,
                color: "var(--foreground)"
              }}>
                {item.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
