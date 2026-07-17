import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { UserButton } from "@clerk/nextjs";
import { DashboardNav } from "@/components/DashboardNav";
import { ProfilePreviewFrame } from "@/components/ProfilePreviewFrame";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // Fetch business for this user
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!business) {
    // If not registered, render children directly (which is the Register form)
    return (
      <main className="dashboard-layout-wrapper animate-fade-in">
        <div className="dashboard-main-content" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="glass-card" style={{ padding: "3rem 2rem" }}>
            <div className="dashboard-header" style={{ marginBottom: "2rem" }}>
              <h1 className="dashboard-title">Dashboard</h1>
              <UserButton />
            </div>
            {children}
          </div>
        </div>
      </main>
    );
  }

  const leadsCount = Array.isArray(business.leads) ? business.leads.length : 0;

  return (
    <main className="dashboard-layout-wrapper animate-fade-in">
      <div className="dashboard-main-content">
        <div className="glass-card" style={{ padding: "2.5rem 2rem" }}>
          <div className="dashboard-header" style={{ marginBottom: '1rem' }}>
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="dashboard-settings-btn">
              <span className="hide-on-mobile" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Settings & Logout</span>
              <UserButton />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '-0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Account Plan:</span>
            {(business.payment_status === "active" || business.payment_status === "completed") ? (
              <span style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.25rem 0.6rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                textTransform: 'uppercase'
              }}>
                Pro User
              </span>
            ) : (
              <span style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.25rem 0.6rem",
                borderRadius: "9999px",
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                color: "#3b82f6",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                textTransform: 'uppercase'
              }}>
                Free User
              </span>
            )}
          </div>

          {/* Shared Top Navigation Menu */}
          <DashboardNav leadsCount={leadsCount} />

          {children}
        </div>
      </div>

      {/* Desktop Live Preview Panel */}
      <div className="dashboard-preview-panel">
        <ProfilePreviewFrame slug={business.slug} />
      </div>
    </main>
  );
}
