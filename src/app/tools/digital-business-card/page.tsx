import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { DigitalBusinessCardGenerator } from "@/components/DigitalBusinessCardGenerator";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Free Digital Business Card Generator | MyRevLink",
  description: "Design and download your customized digital business card for free. Pick from 5 modern templates and share instantly.",
};

export default async function DigitalBusinessCardPage() {
  const reqHeaders = await headers();
  let isIndia = false;
  
  // Detect region
  const country = reqHeaders.get("cf-ipcountry");
  if (country === "IN") {
    isIndia = true;
  } else {
    const acceptLang = reqHeaders.get("accept-language") || "";
    if (acceptLang.includes("en-IN") || acceptLang.includes("hi-IN")) {
      isIndia = true;
    }
  }

  // Fetch pricing from settings table for header nav
  const { data: settingsData } = await supabase
    .from("settings")
    .select("key, value");

  const settings = settingsData?.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {}) || {};

  const usdPrice = settings.qr_price_usd_amount || "5";
  const inrPrice = settings.qr_price_inr_amount || "399";

  const priceSymbol = isIndia ? "₹" : "$";
  const priceAmount = isIndia ? inrPrice : usdPrice;

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", overflowX: "hidden" }}>
      
      {/* HEADER / NAVBAR */}
      <header className="container header-nav">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <Image src="/logo.png" alt="MyRevLink Logo" width={28} height={28} style={{ objectFit: "contain" }} />
          <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#172554" }}>MyRevLink</span>
        </Link>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center", fontSize: "0.875rem", fontWeight: 600, color: "#4b5563" }} className="hidden sm:flex">
          <Link href="/#features">Features</Link>
          <Link href="/#how-it-works">How it Works</Link>
          
          {/* Tools Dropdown */}
          <div className="nav-dropdown-trigger" style={{ cursor: "pointer", padding: "0.5rem 0" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              Tools
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
            <div className="nav-dropdown-menu">
              <Link href="/tools/google-review-qr" className="nav-dropdown-item" style={{ borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--foreground)" }}>Generate AI Google Review QR</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.15rem", fontWeight: 400 }}>Printable A4 QR codes for just {priceSymbol}{priceAmount}</div>
              </Link>
              <Link href="/tools/digital-business-card" className="nav-dropdown-item">
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--foreground)" }}>Digital Business Card</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.15rem", fontWeight: 400 }}>Create & download cards for free</div>
              </Link>
            </div>
          </div>

          <Link href="/#pricing">Pricing</Link>
          <Link href="/#faq">FAQ</Link>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link href="/demo" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#2563eb" }}>View Demo</Link>
          <Link href="/sign-in" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#4b5563" }}>Login</Link>
          <Link href="/sign-up">
            <Button variant="primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem", borderRadius: "8px", background: "#1d4ed8" }}>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Main Tool Content */}
      <section style={{ padding: "4rem 1.5rem", background: "linear-gradient(180deg, #eff4ff 0%, #ffffff 100%)", flex: 1 }}>
        <div className="container">
          <div style={{ marginBottom: "2.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Link href="/" style={{ color: "#3b82f6", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              &larr; Back to Home
            </Link>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0f172a", marginTop: "0.5rem" }}>
              Free Digital Business Card Generator
            </h1>
            <p style={{ color: "#475569", fontSize: "1.125rem", maxWidth: "700px" }}>
              Build a sleek, interactive business card. Pick from our 5 modern template styles, customize your details, and download or copy details for free.
            </p>
          </div>

          <DigitalBusinessCardGenerator />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ marginTop: "auto", borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
        <div className="container" style={{ padding: "5rem 1.5rem 4rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <Image src="/logo.png" alt="MyRevLink Logo" width={28} height={28} style={{ objectFit: "contain" }} />
              <h3 style={{ fontSize: "1.25rem", color: "#0f172a", fontWeight: "bold", margin: 0 }}>MyRevLink</h3>
            </div>
            <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.6, maxWidth: "280px" }}>Empowering local businesses with AI-driven Google Reviews and beautiful digital profiles.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: "1.25rem", color: "#0f172a", fontSize: "0.95rem", fontWeight: 700 }}>Product</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link href="/#pricing" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Pricing</Link>
              <Link href="/sign-in" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Login</Link>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: "1.25rem", color: "#0f172a", fontSize: "0.95rem", fontWeight: 700 }}>Industries</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", width: "240px" }}>
              <Link href="/industries/dentists" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Dentists</Link>
              <Link href="/industries/restaurants" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Restaurants</Link>
              <Link href="/industries/real-estate" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Real Estate</Link>
              <Link href="/industries/hair-salons" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Hair Salons</Link>
              <Link href="/industries/plumbers" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Plumbers</Link>
              <Link href="/industries/gyms" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Gyms</Link>
              <Link href="/industries/lawyers" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Lawyers</Link>
              <Link href="/industries/contractors" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Contractors</Link>
              <Link href="/industries/doctors" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Doctors</Link>
              <Link href="/industries/hotels" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Hotels</Link>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: "1.25rem", color: "#0f172a", fontSize: "0.95rem", fontWeight: 700 }}>Company</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link href="/about-us" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>About Us</Link>
              <Link href="/contact-us" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Contact Us</Link>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: "1.25rem", color: "#0f172a", fontSize: "0.95rem", fontWeight: 700 }}>Legal</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link href="/privacy-policy" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Privacy Policy</Link>
              <Link href="/terms-and-conditions" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none" }}>Terms & Conditions</Link>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "1.5rem", borderTop: "1px solid #e2e8f0", color: "#94a3b8", fontSize: "0.875rem" }}>
          &copy; {new Date().getFullYear()} MyRevLink. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
