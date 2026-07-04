"use client";

import React, { useState } from "react";
import { Input } from "./ui/Input";

interface ShowcaseApps {
  app_name?: string;
  app_description?: string;
  ios_link?: string;
  android_link?: string;
  web_link?: string;
}

export function ShowcaseAppsEditor({ initialApps }: { initialApps?: ShowcaseApps[] | ShowcaseApps }) {
  // Normalize initialApps to always be an array
  const getInitialAppsArray = (): ShowcaseApps[] => {
    if (!initialApps) return [];
    if (Array.isArray(initialApps)) return initialApps;
    // If it's a single object (backward compatibility)
    if (typeof initialApps === "object" && Object.keys(initialApps).length > 0) {
      return [initialApps];
    }
    return [];
  };

  const [apps, setApps] = useState<ShowcaseApps[]>(getInitialAppsArray());

  const handleAdd = () => {
    setApps([...apps, { app_name: "", app_description: "", ios_link: "", android_link: "", web_link: "" }]);
  };

  const handleRemove = (index: number) => {
    const updated = [...apps];
    updated.splice(index, 1);
    setApps(updated);
  };

  const handleChange = (index: number, key: keyof ShowcaseApps, value: string) => {
    const updated = [...apps];
    updated[index] = { ...updated[index], [key]: value };
    setApps(updated);
  };

  const validApps = apps.filter(
    (app) =>
      app.app_name?.trim() ||
      app.ios_link?.trim() ||
      app.android_link?.trim() ||
      app.web_link?.trim()
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input type="hidden" name="showcase_apps" value={JSON.stringify(validApps)} />

      {apps.map((app, index) => (
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
            <h5 style={{ margin: 0, fontWeight: 600 }}>App/Web Link #{index + 1}</h5>
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

          <Input
            label="App/Web Project Name"
            value={app.app_name || ""}
            onChange={(e) => handleChange(index, "app_name", e.target.value)}
            placeholder="e.g. My Business App"
          />

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              value={app.app_description || ""}
              onChange={(e) => handleChange(index, "app_description", e.target.value)}
              placeholder="Brief description of what your app does..."
              className="input-field"
              style={{ minHeight: "80px", fontFamily: "inherit", resize: "vertical" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <Input
              label="App Store Link (iOS)"
              value={app.ios_link || ""}
              onChange={(e) => handleChange(index, "ios_link", e.target.value)}
              placeholder="https://apps.apple.com/..."
            />
            <Input
              label="Google Play Store Link (Android)"
              value={app.android_link || ""}
              onChange={(e) => handleChange(index, "android_link", e.target.value)}
              placeholder="https://play.google.com/..."
            />
            <Input
              label="Web App Link"
              value={app.web_link || ""}
              onChange={(e) => handleChange(index, "web_link", e.target.value)}
              placeholder="https://app.yourdomain.com"
            />
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
        Add Another App/Web Link
      </button>
    </div>
  );
}
