"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ marginTop: "auto", borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
      <div className="container" style={{ padding: "5rem 1.5rem 4rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <Image src="/logo.png" alt="MyRevLink Logo" width={28} height={28} style={{ objectFit: "contain" }} />
            <h3 style={{ fontSize: "1.25rem", color: "#0f172a", fontWeight: "bold", margin: 0 }}>MyRevLink</h3>
          </div>
          <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.6, maxWidth: "280px" }}>
            Empowering local businesses with AI-driven Google Reviews and beautiful digital profiles.
          </p>
        </div>
        
        <div>
          <h4 style={{ marginBottom: "1.25rem", color: "#0f172a", fontSize: "0.95rem", fontWeight: 700 }}>Product</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link href="/#pricing" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Pricing</Link>
            <Link href="/sign-in" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Login</Link>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: "1.25rem", color: "#0f172a", fontSize: "0.95rem", fontWeight: 700 }}>Industries</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", width: "240px" }}>
            <Link href="/industries/dentists" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Dentists</Link>
            <Link href="/industries/restaurants" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Restaurants</Link>
            <Link href="/industries/real-estate" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Real Estate</Link>
            <Link href="/industries/hair-salons" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Hair Salons</Link>
            <Link href="/industries/plumbers" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Plumbers</Link>
            <Link href="/industries/gyms" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Gyms</Link>
            <Link href="/industries/lawyers" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Lawyers</Link>
            <Link href="/industries/contractors" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Contractors</Link>
            <Link href="/industries/doctors" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Doctors</Link>
            <Link href="/industries/hotels" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Hotels</Link>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: "1.25rem", color: "#0f172a", fontSize: "0.95rem", fontWeight: 700 }}>Company</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link href="/about-us" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>About Us</Link>
            <Link href="/contact-us" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Contact Us</Link>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: "1.25rem", color: "#0f172a", fontSize: "0.95rem", fontWeight: 700 }}>Legal</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link href="/privacy-policy" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Privacy Policy</Link>
            <Link href="/terms-and-conditions" style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}>Terms & Conditions</Link>
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: "center", padding: "1.5rem", borderTop: "1px solid #e2e8f0", color: "#94a3b8", fontSize: "0.875rem" }}>
        &copy; {currentYear} MyRevLink. All rights reserved.
      </div>
    </footer>
  );
}
