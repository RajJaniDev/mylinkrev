"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface RegisterBusinessFormProps {
  userId: string;
  priceText: string;
}

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word characters
    .replace(/[\s_]+/g, "-")  // replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
};

export default function RegisterBusinessForm({ userId, priceText }: RegisterBusinessFormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    // Detect timezone to determine if the user is in India
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isIndia = tz === "Asia/Kolkata" || tz === "Asia/Calcutta";
    document.cookie = `user_is_india=${isIndia}; path=/; max-age=31536000`; // Cookie expires in 1 year
  }, []);

  const checkSlugAvailable = async (testSlug: string) => {
    const { data, error: dbError } = await supabase
      .from("businesses")
      .select("slug")
      .eq("slug", testSlug)
      .maybeSingle();
    return !data && !dbError;
  };

  const generateAvailableSlugSuggestion = async (baseSlug: string) => {
    let counter = 1;
    let suggestionFound = false;
    let finalSuggestion = "";

    while (!suggestionFound && counter <= 10) {
      const tempSuggestion = `${baseSlug}-${counter}`;
      const available = await checkSlugAvailable(tempSuggestion);
      if (available) {
        finalSuggestion = tempSuggestion;
        suggestionFound = true;
      } else {
        counter++;
      }
    }

    if (!finalSuggestion) {
      finalSuggestion = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;
    }
    return finalSuggestion;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameBlur = async () => {
    // Suggest slug only if business name is provided and slug is currently empty
    if (name.trim() && !slug.trim()) {
      setIsChecking(true);
      setError("");
      setSuggestion("");
      const generatedSlug = slugify(name);
      
      const available = await checkSlugAvailable(generatedSlug);
      if (available) {
        setSlug(generatedSlug);
        setIsValidated(true);
      } else {
        setSlug(generatedSlug);
        setError("Link already taken");
        const suggested = await generateAvailableSlugSuggestion(generatedSlug);
        setSuggestion(suggested);
        setIsValidated(false);
      }
      setIsChecking(false);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    // Clear validation status on typing
    setError("");
    setSuggestion("");
    setIsValidated(false);
  };

  const handleSlugBlur = async () => {
    if (!slug.trim()) return;

    setIsChecking(true);
    setError("");
    setSuggestion("");
    
    const cleanedSlug = slugify(slug);
    setSlug(cleanedSlug);

    const available = await checkSlugAvailable(cleanedSlug);
    if (available) {
      setIsValidated(true);
    } else {
      setError("Link already taken");
      const suggested = await generateAvailableSlugSuggestion(cleanedSlug);
      setSuggestion(suggested);
      setIsValidated(false);
    }
    setIsChecking(false);
  };

  const handleSelectSuggestion = () => {
    if (suggestion) {
      setSlug(suggestion);
      setError("");
      setSuggestion("");
      setIsValidated(true); // Suggestion is guaranteed to be available
    }
  };

  const isSubmitDisabled = !name.trim() || !slug.trim() || !!error || isChecking;

  return (
    <form action="/api/checkout" method="POST" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input type="hidden" name="userId" value={userId} />
      
      <Input
        label="Business Name"
        name="name"
        required
        value={name}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
        placeholder="e.g. Acme Corp"
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Input
          label="Custom Link (Slug)"
          name="slug"
          required
          value={slug}
          onChange={handleSlugChange}
          onBlur={handleSlugBlur}
          error={error}
          placeholder="e.g. acme-corp"
        />
        
        {isValidated && !error && (
          <span style={{ color: "#10b981", fontSize: "0.875rem", display: "block", marginTop: "-1rem", marginBottom: "1.25rem", fontWeight: 500 }}>
            ✓ Link is available!
          </span>
        )}

        {suggestion && (
          <div style={{ marginTop: "-1rem", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
            <span style={{ color: "var(--muted)" }}>How about: </span>
            <button
              type="button"
              onClick={handleSelectSuggestion}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: 500,
                padding: 0,
              }}
            >
              {suggestion}
            </button>
          </div>
        )}
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitDisabled}>
        {isChecking ? "Checking link..." : `Pay ${priceText} & Register`}
      </Button>
    </form>
  );
}
