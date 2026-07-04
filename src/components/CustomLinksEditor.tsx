"use client";

import React, { useState } from "react";
import { Input } from "./ui/Input";

interface CustomLinkItem {
  title: string;
  url: string;
  image: string; // base64 or URL
}

export function CustomLinksEditor({ initialLinks }: { initialLinks?: CustomLinkItem[] }) {
  const [links, setLinks] = useState<CustomLinkItem[]>(
    initialLinks && initialLinks.length > 0 ? initialLinks : []
  );

  const handleAdd = () => {
    setLinks([...links, { title: "", url: "", image: "" }]);
  };

  const handleRemove = (index: number) => {
    const updated = [...links];
    updated.splice(index, 1);
    setLinks(updated);
  };

  const handleChange = (index: number, key: keyof CustomLinkItem, value: string) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [key]: value };
    setLinks(updated);
  };

  const handleImageUpload = (index: number, file: File | null) => {
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      alert("Icon image must be smaller than 1MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange(index, "image", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validLinks = links.filter((l) => l.title.trim().length > 0 && l.url.trim().length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input type="hidden" name="custom_links" value={JSON.stringify(validLinks)} />

      {links.map((link, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            background: "rgba(0,0,0,0.02)",
            padding: "1.25rem",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5 style={{ margin: 0, fontWeight: 600 }}>Custom Link #{index + 1}</h5>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              style={{
                background: "none",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Remove
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <Input
              label="Link Title"
              value={link.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
              placeholder="e.g. Visit Our Website"
              required
            />
            <Input
              label="URL"
              value={link.url}
              onChange={(e) => handleChange(index, "url", e.target.value)}
              placeholder="https://..."
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Link Icon (Upload Image or Paste URL)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                {link.image ? (
                  <img
                    src={link.image}
                    alt="Preview"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid var(--border)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--muted)",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e.target.files ? e.target.files[0] : null)}
                  className="input-field"
                  style={{ flex: "1 1 200px", minWidth: "0" }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>OR Image URL:</span>
                <input
                  type="url"
                  value={link.image.startsWith("data:") ? "" : link.image}
                  onChange={(e) => handleChange(index, "image", e.target.value)}
                  placeholder="https://..."
                  className="input-field"
                  style={{ flex: 1, padding: "0.4rem 0.75rem", fontSize: "0.875rem" }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        style={{
          background: "rgba(59, 130, 246, 0.1)",
          color: "var(--primary)",
          border: "1px dashed var(--primary)",
          padding: "0.75rem",
          borderRadius: "var(--radius-md)",
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          transition: "background 0.2s",
          marginTop: "0.25rem",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "rgba(59, 130, 246, 0.2)")}
        onMouseOut={(e) => (e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)")}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Custom Link Card
      </button>
    </div>
  );
}
