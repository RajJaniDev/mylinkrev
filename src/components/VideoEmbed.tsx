"use client";

import React, { useState } from 'react';

export function VideoEmbed({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  let embedUrl = "";
  let youtubeVideoId = "";
  let isYouTube = false;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtube.com") || parsedUrl.hostname.includes("youtu.be")) {
      isYouTube = true;
      if (parsedUrl.hostname.includes("youtu.be")) {
        youtubeVideoId = parsedUrl.pathname.slice(1).split(/[?#]/)[0];
      } else if (parsedUrl.pathname.includes("/shorts/")) {
        youtubeVideoId = parsedUrl.pathname.split("/shorts/")[1]?.split(/[?#]/)[0];
      } else if (parsedUrl.pathname.includes("/embed/")) {
        youtubeVideoId = parsedUrl.pathname.split("/embed/")[1]?.split(/[?#]/)[0];
      } else {
        youtubeVideoId = parsedUrl.searchParams.get("v") || "";
      }
      if (youtubeVideoId) {
        embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`;
      }
    } else if (parsedUrl.hostname.includes("instagram.com")) {
      const pathname = parsedUrl.pathname.replace(/\/$/, ""); // remove trailing slash
      if (pathname.includes("/p/") || pathname.includes("/reel/")) {
        embedUrl = `https://www.instagram.com${pathname}/embed`;
      }
    }
  } catch (e) {
    // Invalid URL
  }

  // YouTube Lazy Loading Preview
  if (isYouTube && youtubeVideoId) {
    const thumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;

    if (!isPlaying) {
      return (
        <div 
          onClick={() => setIsPlaying(true)}
          className="glass-card" 
          style={{ 
            flex: '0 0 auto', 
            width: '300px', 
            height: '400px', 
            borderRadius: '1rem', 
            overflow: 'hidden', 
            padding: 0, 
            border: '1px solid var(--border)', 
            position: 'relative',
            cursor: 'pointer',
            background: '#000'
          }}
        >
          <img 
            src={thumbnailUrl} 
            alt="YouTube Video Thumbnail" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.85, transition: 'opacity 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.85'}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '64px',
            height: '64px',
            background: 'rgba(59, 130, 246, 0.9)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
            transition: 'transform 0.2s',
            pointerEvents: 'none'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      );
    }

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

  // Instagram or other generic Embed
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
