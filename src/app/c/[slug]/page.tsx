import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PublicBusinessCardView } from "@/components/PublicBusinessCardView";
import { headers } from "next/headers";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: card } = await supabase
    .from("digital_cards")
    .select("full_name, company_name")
    .eq("slug", slug)
    .single();

  if (!card) {
    return {
      title: "Card Not Found | MyRevLink",
    };
  }

  return {
    title: `${card.full_name} - ${card.company_name} | Digital Business Card`,
    description: `View the digital business card of ${card.full_name} from ${card.company_name}. Scan the QR code to connect.`,
  };
}

export default async function PublicBusinessCardPage({ params }: Props) {
  const { slug } = await params;

  // Fetch card details
  const { data: card, error } = await supabase
    .from("digital_cards")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !card) {
    notFound();
  }

  const reqHeaders = await headers();
  let isIndia = false;
  
  // Detect region for header pricing display
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
            <button style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem", borderRadius: "8px", background: "#1d4ed8", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}>Get Started</button>
          </Link>
        </div>
      </header>

      {/* Profile Section */}
      <section style={{ padding: "4rem 1.5rem", background: "linear-gradient(180deg, #eff4ff 0%, #ffffff 100%)", flex: 1, display: "flex", alignItems: "center" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <PublicBusinessCardView card={card} />
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
