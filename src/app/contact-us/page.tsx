import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ContactUs() {
  return (
    <main className="container flex-col animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '800px', minHeight: '100vh' }}>
      <Link href="/">
        <Button variant="secondary" style={{ marginBottom: '2rem' }}>&larr; Back to Home</Button>
      </Link>
      
      <div className="glass-card">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Contact Us</h1>
        
        <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: 'var(--secondary-foreground)' }}>
          Have a question, need support, or just want to say hi? We're here to help!
        </p>

        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Get in Touch via Email</h2>
          <p style={{ marginBottom: '1.5rem' }}>We strive to respond to all inquiries within 24 hours.</p>
          <a href="mailto:codealphainfotech@gmail.com" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'underline' }}>
            codealphainfotech@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
}
