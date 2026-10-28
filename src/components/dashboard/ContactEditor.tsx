'use client';

import { useEffect, useRef, useState } from 'react';
import { Save, X } from 'lucide-react';
import { validateContactDraft, type ContactDraft, type ContactResult, type CrmContact } from '@/lib/crm';
import { useUnsavedChanges } from './useUnsavedChanges';

export function ContactEditor({ contact, stages, save, onSaved, onCancel }: {
  contact?: CrmContact; stages: string[]; save: (draft: ContactDraft) => Promise<ContactResult>;
  onSaved: (contact: CrmContact) => void; onCancel: () => void;
}) {
  const [draft, setDraft] = useState<ContactDraft>({
    id: contact?.id, version: contact?.updated_at, name: contact?.name || '', email: contact?.email || '', phone: contact?.phone || '',
    company: contact?.company || '', notes: contact?.notes || '', status: contact?.status && stages.includes(contact.status) ? contact.status : stages[0], follow_up_on: contact?.follow_up_on || '',
  });
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [discard, setDiscard] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useUnsavedChanges(dirty && !busy);
  useEffect(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'start' }); }, []);
  function change(key: keyof ContactDraft, value: string) { setDraft(current => ({ ...current, [key]: value })); setDirty(true); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const submitted = { ...draft };
    for (const field of ['name', 'email', 'phone', 'company', 'notes', 'status', 'follow_up_on'] as const) submitted[field] = String(data.get(field) ?? '');
    const checked = validateContactDraft(submitted, stages);
    if ('error' in checked) { setError(checked.error); return; }
    setBusy(true); setError('');
    try {
      const result = await save(checked.draft);
      if (result.error || !result.contact) { setError(result.error || 'Your contact couldn’t be saved. Please try again.'); return; }
      setDirty(false); onSaved(result.contact);
    } catch { setError('Your contact couldn’t be saved. Your edits are still here; please try again.'); }
    finally { setBusy(false); }
  }
  return <section className="dash-card crm-editor" id="contact-editor" aria-labelledby="contact-editor-heading"><div className="dash-card-heading"><div><h2 id="contact-editor-heading" ref={heading} tabIndex={-1}>{contact ? 'Edit contact' : 'Add a contact'}</h2><p>{contact ? 'Update client details, stage and private notes.' : 'Save a client or lead from a call, referral, social message or another source.'}</p></div><button type="button" className="dash-icon-button" disabled={busy} aria-label="Close contact editor" onClick={() => dirty ? setDiscard(true) : onCancel()}><X size={20}/></button></div>
    <form onSubmit={submit}><fieldset className="dash-editor-fields" disabled={busy}><div className="dash-field-grid"><div><label className="dash-field-label" htmlFor="crm-name">Name <span aria-hidden="true">*</span></label><input id="crm-name" name="name" value={draft.name} onChange={e => change('name', e.target.value)} required maxLength={120} autoComplete="off" placeholder="Client or lead name"/></div><div><label className="dash-field-label" htmlFor="crm-company">Company or organization</label><input id="crm-company" name="company" value={draft.company} onChange={e => change('company', e.target.value)} maxLength={160} placeholder="Optional"/></div><div><label className="dash-field-label" htmlFor="crm-email">Email address</label><input id="crm-email" name="email" type="email" inputMode="email" autoComplete="off" value={draft.email} onChange={e => change('email', e.target.value)} maxLength={254} placeholder="Optional"/></div><div><label className="dash-field-label" htmlFor="crm-phone">Phone number</label><input id="crm-phone" name="phone" type="tel" inputMode="tel" autoComplete="off" value={draft.phone} onChange={e => change('phone', e.target.value)} maxLength={32} placeholder="Include country code"/></div><div><label className="dash-field-label" htmlFor="crm-stage">Stage</label><select id="crm-stage" name="status" value={draft.status} onChange={e => change('status', e.target.value)}>{stages.map(stage => <option key={stage}>{stage}</option>)}</select></div><div><label className="dash-field-label" htmlFor="crm-followup">Next follow-up date</label><input id="crm-followup" name="follow_up_on" type="date" value={draft.follow_up_on} onChange={e => change('follow_up_on', e.target.value)}/></div></div><div><label className="dash-field-label" htmlFor="crm-notes">Private notes</label><textarea id="crm-notes" name="notes" rows={4} value={draft.notes} onChange={e => change('notes', e.target.value)} maxLength={4000} placeholder="Services discussed, preferences, or what to do next…"/><p className="dash-field-help">Contact details and notes stay in your workspace. A follow-up date does not send an automatic reminder.</p></div>{error && <div className="dash-notice dash-notice-error" role="alert">{error}</div>}
    {discard && <div className="crm-discard" role="alert"><p>Discard your unsaved contact changes?</p><div><button type="button" className="dash-button dash-button-secondary" onClick={() => setDiscard(false)}>Keep editing</button><button type="button" className="dash-button dash-button-secondary" onClick={onCancel}>Discard changes</button></div></div>}
    <div className="crm-editor-actions"><button type="button" className="dash-button dash-button-secondary" onClick={() => dirty ? setDiscard(true) : onCancel()}>Cancel</button><button type="submit" className="dash-button"><Save size={17}/>{busy ? 'Saving contact…' : contact ? 'Save contact' : 'Add contact'}</button></div></fieldset></form>
  </section>;
}
