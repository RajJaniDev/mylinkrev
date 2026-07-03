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

export function ShowcaseAppsEditor({ initialApps }: { initialApps?: ShowcaseApps }) {
  const [apps, setApps] = useState<ShowcaseApps>(initialApps || {});

  const handleChange = (key: keyof ShowcaseApps, value: string) => {
    const updated = { ...apps, [key]: value };
    setApps(updated);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", background: "rgba(0,0,0,0.02)", padding: "1.25rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
      <input type="hidden" name="showcase_apps" value={JSON.stringify(apps)} />
      
      <Input
        label="App Name"
        value={apps.app_name || ""}
        onChange={(e) => handleChange("app_name", e.target.value)}
        placeholder="e.g. My Business App"
      />
      
      <div className="input-group">
        <label className="input-label">App Description</label>
        <textarea
          value={apps.app_description || ""}
          onChange={(e) => handleChange("app_description", e.target.value)}
          placeholder="Brief description of what your app does..."
          className="input-field"
          style={{ minHeight: "80px", fontFamily: "inherit", resize: "vertical" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <Input
          label="App Store Link (iOS)"
          value={apps.ios_link || ""}
          onChange={(e) => handleChange("ios_link", e.target.value)}
          placeholder="https://apps.apple.com/..."
        />
        <Input
          label="Google Play Store Link (Android)"
          value={apps.android_link || ""}
          onChange={(e) => handleChange("android_link", e.target.value)}
          placeholder="https://play.google.com/..."
        />
        <Input
          label="Web App Link"
          value={apps.web_link || ""}
          onChange={(e) => handleChange("web_link", e.target.value)}
          placeholder="https://app.yourdomain.com"
        />
      </div>
    </div>
  );
}
