'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowUpRight, Copy, Link2 } from 'lucide-react';
import './onboarding.css';
export function GettingStarted({ slug, hasBio, hasLinks, capturesLeads }: { slug: string; hasBio: boolean; hasLinks: boolean; capturesLeads: boolean }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const complete = Number(hasBio) + Number(hasLinks) + Number(capturesLeads);
  async function copy() {
    try { await navigator.clipboard.writeText(`https://myrevlink.in/b/${slug}`); setCopied(true); setCopyError(false); } catch { setCopyError(true); }
  }
  return <section className="getting-started" aria-labelledby="gs-title"><div className="gs-heading"><div><span className="ob-eyebrow">YOUR PAGE, READY FOR ITS NEXT CHAPTER</span><h2 id="gs-title">Make a great first impression.</h2><p>{complete}/3 essentials ready. Add your details, check your inquiry form, then share your link.</p></div><Link href={`/b/${slug}`} target="_blank" rel="noopener noreferrer" className="gs-preview">Preview page <ArrowUpRight size={16}/></Link></div><div className="gs-checks">{[{ label: 'Introduce yourself', detail: 'Add a short bio to your profile.', done: hasBio, href: '#profile-settings' }, { label: 'Add your important links', detail: 'Give visitors a clear next step.', done: hasLinks, href: '#profile-settings' }, { label: 'Enable your inquiry form', detail: 'Check the wording and required fields.', done: capturesLeads, href: '/dashboard/leads' }].map((item, index) => <Link key={item.label} href={item.href} className="gs-check"><span className={item.done ? 'gs-check-icon done' : 'gs-check-icon'}>{item.done ? <Check size={15}/> : index + 1}</span><span><strong>{item.label}</strong><small>{item.detail}</small></span></Link>)}</div><div className="gs-share"><span><Link2 size={14}/><span>myrevlink.in/b/{slug}</span></span><button type="button" onClick={copy}><Copy size={13}/>{copied ? 'Copied!' : 'Copy your link'}</button></div><p className="gs-hint">{copyError ? 'Copy is unavailable in this browser. Select and copy the link above.' : 'Preview the page and send yourself a test inquiry before adding the link to your bio. Test inquiries count toward your free lead allowance.'}</p></section>;
}
