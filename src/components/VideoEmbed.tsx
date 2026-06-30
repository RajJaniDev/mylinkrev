"use client";

import React from 'react';

export function VideoEmbed({ url }: { url: string }) {
  let embedUrl = "";

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtube.com") || parsedUrl.hostname.includes("youtu.be")) {
      let videoId = "";
      if (parsedUrl.hostname.includes("youtu.be")) {
        videoId = parsedUrl.pathname.slice(1);
      } else {
        videoId = parsedUrl.searchParams.get("v") || "";
      }
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (parsedUrl.hostname.includes("instagram.com")) {
      // Ensure the URL ends with /embed
      const pathname = parsedUrl.pathname.replace(/\/$/, ""); // remove trailing slash
      if (pathname.includes("/p/") || pathname.includes("/reel/")) {
        embedUrl = `https://www.instagram.com${pathname}/embed`;
      }
    }
  } catch (e) {
    // Invalid URL
  }

  if (embedUrl) {
    return (
      <div className="glass-card" style={{ flex: '0 0 auto', width: '300px', height: '400px', borderRadius: '1rem', overflow: 'hidden', padding: 0, border: '1px solid var(--border)', background: '#000' }}>
        <iframe 
          src={embedUrl} 
          style={{ width: '100%', height: '100%', border: 'none' }} 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        />
      </div>
    );
  }

  // Fallback for non-embeddable or malformed URLs
  return (
    <div className="glass-card" style={{ flex: '0 0 auto', width: '300px', height: '400px', borderRadius: '1rem', background: 'var(--background)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', textAlign: 'center', gap: '1rem' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>
      <span style={{ fontSize: '0.875rem', color: 'var(--secondary-foreground)' }}>Linked Media</span>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
        Open Link
      </a>
    </div>
  );
}
