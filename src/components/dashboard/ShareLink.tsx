'use client';

import { useState } from 'react';
import { Copy, Check, ArrowUpRight, Link2 } from 'lucide-react';
import Link from 'next/link';

export function ShareLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(`https://myrevlink.in/b/${slug}`); setCopied(true); setError(false); }
    catch { setError(true); }
  }
  return <div className="dash-share"><div><span className="dash-share-icon"><Link2 size={20}/></span><div><strong>Your link, ready to share</strong><span className="dash-public-url">myrevlink.in/b/{slug}</span></div></div><div className="dash-share-actions"><button type="button" className="dash-button" onClick={copy}>{copied ? <Check size={15}/> : <Copy size={15}/>}{copied ? 'Copied' : 'Copy link'}</button><Link className="dash-icon-button" href={`/b/${slug}`} target="_blank" rel="noopener noreferrer" aria-label="Open public page"><ArrowUpRight size={18}/></Link></div><span className="dash-copy-status" role="status">{error ? 'Select the link above and copy it manually.' : copied ? 'Link copied. Add it to your social bio or share it in a message.' : ''}</span></div>;
}
