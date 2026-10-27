import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, Link2 } from "lucide-react";
import { OnboardingIntent } from "@/components/OnboardingIntent";
import { audiences, isAudience } from "@/lib/audiences";
import "../../marketing.css";
import "./signup.css";
export const metadata: Metadata = { title: "Create your free bio page | MyRevLink", description: "Create your link-in-bio page, capture inquiries and organize your leads.", robots: { index: false, follow: true } };
export default async function Page({ searchParams }: { searchParams: Promise<{ audience?: string }> }) {
  const { audience = "" } = await searchParams;
  const chosen = isAudience(audience) ? audiences[audience] : null;
  return <main className="marketing signup-page"><OnboardingIntent audience={audience}/><div className="signup-story"><Link href="/" className="m-logo"><span><Link2 size={21}/></span>myrevlink.</Link><div><span className="m-eyebrow">YOUR NEXT CHAPTER</span><h1>A page for you.<br/><em>A place to begin.</em></h1><p>{chosen ? `A starting point for ${chosen.label.toLowerCase()}: your services, content and inquiries, together.` : "Bring your services, content and client inquiries together in one bio link."}</p><ul>{['Create your free account', 'Choose your profile and inquiry setup', 'Add your links and share your page'].map(item => <li key={item}><Check size={16}/>{item}</li>)}</ul><small>Free includes up to 7 captured leads. No card required.</small></div><Link href="/" className="signup-back"><ArrowLeft size={14}/> Back to MyRevLink</Link></div><div className="signup-auth"><SignUp fallbackRedirectUrl="/dashboard" forceRedirectUrl="/dashboard" signInFallbackRedirectUrl="/dashboard" signInForceRedirectUrl="/dashboard"/></div></main>;
}
