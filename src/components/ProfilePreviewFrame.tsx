"use client";

import React, { useEffect, useState } from "react";

export function ProfilePreviewFrame({ slug }: { slug?: string }) {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!slug || !origin) {
    return (
      <div className="phone-frame-placeholder">
        <div className="phone-screen-placeholder">
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Register your business to see live preview</p>
        </div>
      </div>
    );
  }

  const previewUrl = `${origin}/b/${slug}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)", fontSize: "0.875rem" }}>
        <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
        <span>Live Preview</span>
      </div>
      
      <div className="phone-frame">
        <div className="phone-notch" />
        <iframe
          src={previewUrl}
          className="phone-iframe"
          title="Profile Preview"
          key={previewUrl} // Force reload when slug changes
        />
      </div>
    </div>
  );
}
