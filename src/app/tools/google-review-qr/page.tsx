import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { GoogleReviewQRGenerator } from "@/components/GoogleReviewQRGenerator";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI Google Review QR Generator | MyRevLink",
  description: "Design and print high-converting Google Review QR code posters for your business counter. No login required, pay just $5 for the high-res printable poster.",
};

export default async function GoogleReviewQRPage() {
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

  // Fetch pricing from settings table
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
              AI Google Review QR Generator
            </h1>
            <p style={{ color: "#475569", fontSize: "1.125rem", maxWidth: "700px" }}>
              Design a customizable, high-converting Google Review QR poster for your business counter. No login required.
            </p>
          </div>

          <GoogleReviewQRGenerator priceSymbol={priceSymbol} priceAmount={priceAmount} />
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
