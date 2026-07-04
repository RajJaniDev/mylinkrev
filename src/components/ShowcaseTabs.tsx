"use client";

import React, { useState } from "react";
import { VideoEmbed } from "./VideoEmbed";

interface ShowcaseApps {
  app_name?: string;
  app_description?: string;
  ios_link?: string;
  android_link?: string;
  web_link?: string;
}

interface ProductItem {
  name: string;
  price: string;
  url: string;
  image: string;
}

interface ShowcaseTabsProps {
  videos?: string[];
  apps?: ShowcaseApps[] | ShowcaseApps;
  products?: ProductItem[];
}

export function ShowcaseTabs({ videos = [], apps, products = [] }: ShowcaseTabsProps) {
  // Normalize apps to an array
  const appsList: ShowcaseApps[] = React.useMemo(() => {
    if (!apps) return [];
    if (Array.isArray(apps)) return apps;
    if (typeof apps === "object" && Object.keys(apps).length > 0) {
      // Check if it has any actual values
      if (apps.app_name || apps.ios_link || apps.android_link || apps.web_link) {
        return [apps];
      }
    }
    return [];
  }, [apps]);

  const hasVideos = videos.length > 0;
  const hasApps = appsList.length > 0;
  const hasProducts = products.length > 0;

  // Filter tabs
  const availableTabs: { id: string; label: string }[] = [];
  if (hasVideos) availableTabs.push({ id: "videos", label: "Videos" });
  if (hasApps) availableTabs.push({ id: "apps", label: "Apps" });
  if (hasProducts) availableTabs.push({ id: "products", label: "Products" });

  const [activeTab, setActiveTab] = useState<string>(
    availableTabs.length > 0 ? availableTabs[0].id : ""
  );

  if (availableTabs.length === 0) return null;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }}>
      <h3 style={{ fontSize: "1.25rem", margin: 0, color: "var(--foreground)", fontWeight: 600 }}>Showcase</h3>
      
      {/* Dynamic Tab Navigation Header */}
      {availableTabs.length > 1 && (
        <div style={{
          display: "flex",
          padding: "0.25rem",
          background: "rgba(0,0,0,0.03)",
          borderRadius: "9999px",
          border: "1px solid var(--border)",
          width: "100%"
        }}>
          {availableTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "0.6rem 0.5rem",
                  borderRadius: "9999px",
                  border: "none",
                  background: isActive ? "var(--primary)" : "transparent",
                  color: isActive ? "white" : "var(--secondary-foreground)",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  textAlign: "center"
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Tab Contents */}
      <div style={{ width: "100%", minHeight: "150px" }}>
        
        {/* Videos Tab */}
        {activeTab === "videos" && hasVideos && (
          <div style={{ 
            display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.75rem",
            scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
            marginLeft: "-1.5rem", marginRight: "-1.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem"
          }} className="hide-scrollbar">
            {videos.map((url, index) => (
              <div key={index} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
                <VideoEmbed url={url} />
              </div>
            ))}
          </div>
        )}

        {/* Apps Tab */}
        {activeTab === "apps" && hasApps && (
          <div style={{
            display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.75rem",
            scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
            marginLeft: "-1.5rem", marginRight: "-1.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem"
          }} className="hide-scrollbar">
            {appsList.map((app, index) => (
              <div key={index} style={{ scrollSnapAlign: "start", flexShrink: 0, width: appsList.length > 1 ? "280px" : "100%" }}>
                <div className="glass-card animate-fade-in" style={{
                  padding: "1.25rem",
                  background: "rgba(255,255,255,0.4)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  border: "1px solid var(--border)",
                  height: "100%",
                  justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {app.app_name && (
                      <h4 style={{ margin: 0, fontSize: "1rem", color: "var(--foreground)", fontWeight: 700 }}>
                        {app.app_name}
                      </h4>
                    )}
                    
                    {app.app_description && (
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--secondary-foreground)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {app.app_description}
                      </p>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                    {app.web_link && (
                      <a
                        href={app.web_link.startsWith("http") ? app.web_link : `https://${app.web_link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="primary-card"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
                          padding: "0.6rem",
                          fontSize: "0.85rem",
                          borderRadius: "9999px",
                          background: "var(--primary)",
                          color: "white",
                          fontWeight: 600,
                          textDecoration: "none",
                          textAlign: "center"
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        Open Web App
                      </a>
                    )}

                    <div style={{ display: "flex", gap: "0.5rem", width: "100%", flexWrap: "wrap" }}>
                      {app.ios_link && (
                        <a
                          href={app.ios_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            minWidth: "100px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.3rem",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "9999px",
                            background: "#000",
                            color: "#fff",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            border: "1px solid rgba(255,255,255,0.1)",
                            textAlign: "center"
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
                          </svg>
                          App Store
                        </a>
                      )}

                      {app.android_link && (
                        <a
                          href={app.android_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            minWidth: "100px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.3rem",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "9999px",
                            background: "#000",
                            color: "#fff",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            border: "1px solid rgba(255,255,255,0.1)",
                            textAlign: "center"
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5 3.229c-.224.226-.38.583-.38 1.052v15.438c0 .47.156.827.38 1.053l.07.07L14.66 12 5.07 2.37l-.07.07zM17.82 8.84l-3.16 3.16 3.16 3.16.07-.04 3.73-2.12c1.06-.6 1.06-1.58 0-2.19l-3.73-2.12-.07.04zM14.66 12L5.07 22.21c.313.33.82.376 1.398.048l11.352-6.444L14.66 12zM6.468 1.74l11.352 6.444L14.66 12 6.468 1.74z"/>
                          </svg>
                          Google Play
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && hasProducts && (
          <div style={{
            display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.75rem",
            scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
            marginLeft: "-1.5rem", marginRight: "-1.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem"
          }} className="hide-scrollbar">
            {products.map((product, index) => (
              <div key={index} style={{ scrollSnapAlign: "start", flexShrink: 0, width: "240px" }}>
                <div className="glass-card" style={{
                  padding: 0,
                  overflow: "hidden",
                  height: "320px",
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(255,255,255,0.4)",
                  border: "1px solid var(--border)"
                }}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: "100%", height: "150px", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "150px",
                      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--muted)"
                    }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                    </div>
                  )}

                  <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "0.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <h4 style={{
                        margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)",
                        overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                        lineHeight: 1.3
                      }}>
                        {product.name}
                      </h4>
                      {product.price && (
                        <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--primary)" }}>
                          {product.price}
                        </span>
                      )}
                    </div>

                    <a
                      href={product.url.startsWith("http") ? product.url : `https://${product.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-card"
                      style={{
                        padding: "0.6rem 1rem",
                        fontSize: "0.85rem",
                        borderRadius: "9999px",
                        textAlign: "center",
                        width: "100%",
                        display: "block",
                        textDecoration: "none",
                        fontWeight: 700
                      }}
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
