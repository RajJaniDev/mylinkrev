import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function TermsAndConditions() {
  return (
    <main className="container flex-col animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <Link href="/">
        <Button variant="secondary" style={{ marginBottom: '2rem' }}>&larr; Back to Home</Button>
      </Link>
      
      <div className="glass-card">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Terms and Conditions</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 style={{ marginTop: '2rem' }}>1. Acceptance of Terms</h2>
        <p>By accessing and using MyRevLink, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.</p>
        
        <h2 style={{ marginTop: '2rem' }}>2. Use of Service</h2>
        <p>You agree to use our service only for lawful purposes. You are responsible for ensuring that the business information and Google Review links you provide are accurate.</p>
        
        <h2 style={{ marginTop: '2rem' }}>3. Payments</h2>
        <p>Access to the dashboard requires a one-time payment. All payments are processed securely through our third-party payment provider. Refunds are handled on a case-by-case basis.</p>
        
        <h2 style={{ marginTop: '2rem' }}>4. Limitation of Liability</h2>
        <p>MyRevLink shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.</p>
      </div>
    </main>
  );
}
