import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PrivacyPolicy() {
  return (
    <main className="container flex-col animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <Link href="/">
        <Button variant="secondary" style={{ marginBottom: '2rem' }}>&larr; Back to Home</Button>
      </Link>
      
      <div className="glass-card">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 style={{ marginTop: '2rem' }}>1. Information We Collect</h2>
        <p>We collect information you provide directly to us when you register for an account, such as your name, email address, and business details.</p>
        
        <h2 style={{ marginTop: '2rem' }}>2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, including generating your custom business page and facilitating AI-generated reviews.</p>
        
        <h2 style={{ marginTop: '2rem' }}>3. Information Sharing</h2>
        <p>We do not share your personal information with third parties except as necessary to provide our services (e.g., payment processing via Lemon Squeezy, authentication via Clerk).</p>
        
        <h2 style={{ marginTop: '2rem' }}>4. Security</h2>
        <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>
      </div>
    </main>
  );
}
