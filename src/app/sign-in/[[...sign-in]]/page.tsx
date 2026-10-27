import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Link2 } from 'lucide-react';
import '../../marketing.css';
import '../../sign-up/[[...sign-up]]/signup.css';

export const metadata: Metadata = { title: 'Welcome back | MyRevLink', description: 'Sign in to manage your bio page and client inquiries.', robots: { index: false, follow: true } };
export default function Page() {
  return <main className="marketing signup-page"><div className="signup-story"><Link href="/" className="m-logo"><span><Link2 size={21}/></span>myrevlink.</Link><div><span className="m-eyebrow">PICK UP WHERE YOU LEFT OFF</span><h1>Your page.<br/>Your people.<br/><em>Your next chapter.</em></h1><p>Welcome back. Update your page, check new inquiries and keep your conversations moving.</p></div><Link href="/" className="signup-back"><ArrowLeft size={14}/> Back to MyRevLink</Link></div><div className="signup-auth"><SignIn fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard"/></div></main>;
}
