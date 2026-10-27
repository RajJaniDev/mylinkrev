import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { audiences, isAudience } from '@/lib/audiences';
import { MarketingNav, MarketingFooter } from '@/components/marketing/MarketingNav';
import { ProfileShowcase } from '@/components/marketing/ProfileShowcase';
import '../../marketing.css';
type Props = { params: Promise<{ audience: string }> };
export function generateStaticParams() { return Object.keys(audiences).map(audience => ({ audience })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { audience } = await params;
  if (!isAudience(audience)) notFound();
  const content = audiences[audience];
  return { title: `${content.title} | MyRevLink`, description: content.description, alternates: { canonical: `/for/${audience}` }, openGraph: { title: content.title, description: content.description, url: `https://myrevlink.in/for/${audience}` } };
}
export default async function AudiencePage({ params }: Props) {
  const { audience } = await params;
  if (!isAudience(audience)) notFound();
  const content = audiences[audience];
  return <div className="marketing"><a href="#main" className="m-skip">Skip to content</a><MarketingNav/><main id="main"><section className="m-hero m-audience-hero m-wrap"><div className="m-hero-copy"><nav className="m-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>{content.label}</span></nav><span className="m-eyebrow">MADE FOR {content.label.toUpperCase()}</span><h1>Your {audience === 'creators' ? 'content' : 'expertise'}.<br/>Your connections.<br/><em>One bio link.</em></h1><p>{content.description}</p><div className="m-hero-actions"><Link href={`/sign-up?audience=${audience}`} className="m-button">Create your free page <ArrowUpRight size={18}/></Link></div><div className="m-hero-perks"><span>Free to start</span><span>No card required</span><span>Make it your own</span></div></div><ProfileShowcase initialAudience={audience}/></section><section className="m-section m-wrap m-guide"><span className="m-eyebrow">A CLEARER PATH TO YOUR NEXT INQUIRY</span><h2>{content.problem}</h2><p>{content.detail}</p><h2>Build a page that<br/><em>works for your work.</em></h2><ol>{content.tips.map(tip => <li key={tip}>{tip}</li>)}</ol><p>Your free account includes up to 7 captured leads. You can customize the form title, button label and whether email, phone or both are required. Manage each inquiry using your own lead stages. Link to an existing calendar if you offer scheduled sessions; MyRevLink does not confirm appointments or process consultation payments for you.</p><Link href={`/sign-up?audience=${audience}`} className="m-button">Start with the {content.singular.toLowerCase()} setup <ArrowUpRight size={18}/></Link></section><section className="m-audience-section"><div className="m-wrap"><span className="m-eyebrow">EXPLORE OTHER WAYS TO USE MYREVLINK</span><div className="m-audience-grid" style={{ marginTop: 25 }}>{Object.entries(audiences).filter(([key]) => key !== audience).map(([key, item]) => <Link href={`/for/${key}`} className="m-audience" key={key}><h3>{item.label}</h3><p>{item.problem}</p><span className="m-audience-link">Explore <ArrowRight size={16}/></span></Link>)}</div></div></section></main><MarketingFooter/></div>;
}
