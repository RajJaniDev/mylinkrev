'use client';
import { useEffect, useRef, useState, useActionState } from 'react';
import { ArrowLeft, ArrowRight, Check, Link2, Sparkles, Compass, Play, BriefcaseBusiness } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { supabase } from '@/lib/supabase';
import { audiences, isAudience, type Audience } from '@/lib/audiences';
import './onboarding.css';
type RegistrationState = { error: string };
interface Props { registerAction: (previous: RegistrationState, formData: FormData) => Promise<RegistrationState>; }
function CreateButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return <button className="ob-primary" type="submit" disabled={disabled || pending}>{pending ? 'Creating your page…' : 'Create my free page'}{!pending && <ArrowRight size={17}/>}</button>;
}
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9\s_-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
export default function RegisterBusinessForm({ registerAction }: Props) {
  const [step, setStep] = useState(1);
  const [audience, setAudience] = useState<Audience>('coaches');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [captureLeads, setCaptureLeads] = useState(true);
  const [availability, setAvailability] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');
  const latestCheck = useRef(0);
  const [state, action] = useActionState(registerAction, { error: '' });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const profile = audiences[audience];
  useEffect(() => {
    try { const saved = localStorage.getItem('myrevlink-audience'); if (saved && isAudience(saved)) setAudience(saved); } catch { /* No storage required. */ }
  }, []);
  useEffect(() => {
    const requestId = ++latestCheck.current;
    if (!slug) return;
    const timer = setTimeout(async () => {
      setAvailability('checking');
      try {
        const { data, error } = await supabase.from('businesses').select('slug').eq('slug', slug).maybeSingle();
        if (requestId === latestCheck.current) setAvailability(error ? 'error' : data ? 'taken' : 'available');
      } catch { if (requestId === latestCheck.current) setAvailability('error'); }
    }, 400);
    return () => clearTimeout(timer);
  }, [slug]);
  function changeStep(next: number) { setStep(next); requestAnimationFrame(() => headingRef.current?.focus()); }
  return <div className="onboarding"><div className="ob-progress" aria-label={`Setup step ${step} of 2`}><span className={step >= 1 ? 'active' : ''}/><span className={step >= 2 ? 'active' : ''}/><small>{step} / 2</small></div><span className="ob-eyebrow">A LITTLE ABOUT YOU</span><h2 tabIndex={-1} ref={headingRef}>{step === 1 ? 'What are you building?' : 'Let’s make it yours.'}</h2><p className="ob-intro">{step === 1 ? 'Choose a starting point. We’ll tailor your inquiry form and lead stages. You can change them later.' : 'Add your name, claim your link and give visitors a short introduction.'}</p><form action={action}><input type="hidden" name="audience" value={audience}/>{step === 1 ? <><fieldset className="ob-choices"><legend className="ob-sr-only">Choose your work</legend>{Object.entries(audiences).map(([key, item], index) => { const Icon = [Compass, Play, BriefcaseBusiness, Sparkles][index]; return <label key={key} className={audience === key ? 'ob-choice selected' : 'ob-choice'}><input type="radio" name="audience_choice" value={key} checked={audience === key} onChange={() => setAudience(key as Audience)}/><Icon size={22}/><span><strong>{item.singular}</strong><small>{['Consultations & coaching', 'Content & collaborations', 'Projects & client inquiries', 'Consultations & session inquiries'][index]}</small></span><span className="ob-radio">{audience === key && <Check size={12}/>}</span></label>; })}</fieldset><div className="ob-template"><span><Sparkles size={17}/> Your starting point</span><p>Inquiry button: <strong>{profile.cta}</strong></p><p>Lead stages: {profile.stages.slice(0, 3).join(' → ')} → …</p></div><button type="button" className="ob-primary" onClick={() => changeStep(2)}>Continue <ArrowRight size={17}/></button><p className="ob-footnote">Free to start. No payment details needed.</p></> : <><button type="button" className="ob-back" onClick={() => changeStep(1)}><ArrowLeft size={14}/> Change starting point: {profile.singular}</button><label className="ob-label" htmlFor="ob-name">Your name or brand</label><input id="ob-name" name="name" value={name} maxLength={100} autoComplete="organization" required placeholder={profile.name} onChange={e => { setName(e.target.value); }} onBlur={() => { if (!slug) { setAvailability('idle'); setSlug(slugify(name)); } }}/><label className="ob-label" htmlFor="ob-slug">Your personal link</label><div className="ob-slug"><Link2 size={15}/><span>myrevlink.in/b/</span><input id="ob-slug" name="slug" value={slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={60} aria-describedby="ob-availability" autoComplete="off" placeholder="your-name" onChange={e => { setAvailability('idle'); setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 60)); }}/></div><p className={`ob-availability ${availability}`} id="ob-availability" aria-live="polite">{availability === 'checking' ? 'Checking your link…' : availability === 'available' ? 'This link is available. Yours when you create your page.' : availability === 'taken' ? 'That link is taken. Try adding your specialty or another word.' : availability === 'error' ? 'We couldn’t check availability. We’ll check again when you create your page.' : 'Use letters, numbers and hyphens. Choose carefully: your link cannot be changed later.'}</p><label className="ob-label" htmlFor="ob-bio">A short introduction <span>(optional)</span></label><textarea id="ob-bio" name="description" value={description} maxLength={500} rows={3} placeholder={profile.bio} onChange={e => setDescription(e.target.value)}/><label className="ob-capture"><input type="checkbox" name="capture_leads" checked={captureLeads} onChange={e => setCaptureLeads(e.target.checked)}/><span><strong>Let visitors send me inquiries</strong><small>Your “{profile.cta}” button collects a name, email and message. Manage inquiries in your dashboard. Free includes 7 leads.</small></span></label>{state.error && <p role="alert" className="ob-error">{state.error}</p>}<CreateButton disabled={!name.trim() || !slug || availability === 'taken' || availability === 'checking'}/><p className="ob-footnote">Your page will be public at this link. Add your services and review it before sharing.</p></>}</form></div>;
}
