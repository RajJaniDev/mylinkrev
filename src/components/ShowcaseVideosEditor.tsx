"use client";

import React, { useState } from 'react';

export function ShowcaseVideosEditor({ initialVideos }: { initialVideos: string[] }) {
  const [videos, setVideos] = useState<string[]>(initialVideos.length > 0 ? initialVideos : [""]);

  const handleAdd = () => {
    setVideos([...videos, ""]);
  };

  const handleRemove = (index: number) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    // Always keep at least one input, even if empty, for good UX
    if (newVideos.length === 0) {
      setVideos([""]);
    } else {
      setVideos(newVideos);
    }
  };

  const handleChange = (index: number, value: string) => {
    const newVideos = [...videos];
    newVideos[index] = value;
    setVideos(newVideos);
  };

  // We serialize the valid URLs to a JSON string so the Server Action can parse it easily
  const validVideos = videos.map(v => v.trim()).filter(v => v.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <input type="hidden" name="showcase_videos" value={JSON.stringify(validVideos)} />
      
      {videos.map((video, index) => (
        <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="url"
            value={video}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder="e.g. https://www.youtube.com/watch?v=..."
            className="input-field"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            style={{
              background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer',
              padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '0.25rem', transition: 'background 0.2s, color 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'none'; }}
            aria-label="Remove link"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={handleAdd}
        style={{
          background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', border: '1px dashed var(--primary)',
          padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          transition: 'background 0.2s', marginTop: '0.25rem'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Another Video Link
      </button>
    </div>
  );
}
