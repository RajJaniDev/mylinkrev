import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AboutUs() {
  return (
    <main className="container flex-col animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '800px', minHeight: '100vh' }}>
      <Link href="/">
        <Button variant="secondary" style={{ marginBottom: '2rem' }}>&larr; Back to Home</Button>
      </Link>
      
      <div className="glass-card">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>About Us</h1>
        
        <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: 'var(--secondary-foreground)' }}>
          At MyRevLink, we believe that local businesses are the backbone of our communities. Our mission is to help these businesses thrive in the digital age by making it incredibly simple to build and showcase a stellar online reputation.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>The Problem We Solve</h2>
        <p>
          We noticed that many excellent local businesses struggled to get Google Reviews, simply because asking customers to write one from scratch was too much friction. Customers are busy, and writing a good review takes time and thought.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Our Solution</h2>
        <p>
          We built MyRevLink to bridge this gap. By combining beautiful, mobile-friendly landing pages with cutting-edge AI, we allow customers to generate realistic, SEO-friendly 5-star reviews in just one tap. It's a win-win: customers save time, and businesses get the high-quality reviews they deserve to rank higher on Google Maps and search results.
        </p>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Our Commitment</h2>
        <p>
          We are committed to providing an affordable, highly effective tool for business owners. No recurring subscriptions—just a simple lifetime fee to unlock everything you need to skyrocket your ratings.
        </p>
      </div>
    </main>
  );
}
