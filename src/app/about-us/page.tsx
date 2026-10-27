import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us | MyRevLink",
  description: "Learn about MyRevLink: link-in-bio pages and simple inquiry management for independent professionals.",
};

export default function AboutUs() {
  return (
    <main className="flex-col animate-fade-in" style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px', margin: '0 auto', width: '100%', flex: 1 }}>
        <Link href="/">
          <Button variant="secondary" style={{ marginBottom: '2rem' }}>&larr; Back to Home</Button>
        </Link>
        
        <div className="glass-card">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>About Us</h1>
          
          <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: 'var(--secondary-foreground)' }}>
            MyRevLink gives independent professionals a simple home for their work online. Coaches, creators, freelancers and astrology consultants can bring their services, content and client inquiries together in one bio link.
          </p>

          <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>The Problem We Solve</h2>
          <p>
            A social profile can introduce your work, but important information and potential client conversations can get scattered across posts, links and messages. Visitors need a clear next step, and professionals need a practical way to organize inquiries.
          </p>

          <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Our Solution</h2>
          <p>
            Create a shareable profile, add your service and content links, and enable your inquiry form. Use a simple leads dashboard to search inquiries and move them through your own stages as you follow up. You can link to an existing calendar, website or shop.
          </p>

          <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Our Commitment</h2>
          <p>
            Start with a free account and explore the profile and inquiry workflow. The free plan includes up to 7 captured leads. Available Pro pricing and billing terms are shown in your dashboard and checkout before you upgrade.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
