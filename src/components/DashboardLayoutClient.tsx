"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ProfilePreviewFrame } from "./ProfilePreviewFrame";

interface DashboardLayoutClientProps {
  slug: string;
  children: React.ReactNode;
}

export function DashboardLayoutClient({ slug, children }: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const isQrPage = pathname === "/dashboard/qr";

  if (isQrPage) {
    return (
      <main className="animate-fade-in" style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 1rem" }}>
        {children}
      </main>
    );
  }

  return (
    <main className="dashboard-layout-wrapper animate-fade-in">
      <div className="dashboard-main-content">
        {children}
      </div>

      {/* Desktop Live Phone Preview Panel (hidden on QR manage page) */}
      <div className="dashboard-preview-panel">
        <ProfilePreviewFrame slug={slug} />
      </div>
    </main>
  );
}
