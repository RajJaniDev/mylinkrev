'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { Save, Check } from 'lucide-react';
import { useUnsavedChanges } from './dashboard/useUnsavedChanges';
import { Input } from './ui/Input';

type SaveState = { error: string; saved: number };
function SaveButton({ pending }: { pending: boolean }) {
  return <button type="submit" className="dash-button" disabled={pending}><Save size={15}/>{pending ? 'Saving…' : 'Save form settings'}</button>;
}
export function LeadsConfigForm({ socials, action }: { socials: Record<string, any>; action: (previous: SaveState, formData: FormData) => Promise<SaveState> }) {
  const [state, formAction, pending] = useActionState(action, { error: '', saved: 0 });
  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);
  useEffect(() => { if (state.saved) setDirty(false); }, [state.saved]);
  return <form onChange={() => setDirty(true)} onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); startTransition(() => formAction(data)); }} className="dash-form-settings"><fieldset className="dash-editor-fields" disabled={pending}><section className="dash-card"><div className="dash-card-heading"><div><h2>Your inquiry form</h2><p>Make it easy for interested visitors to start a conversation.</p></div></div><label className="dash-toggle"><input type="checkbox" name="accept_inquiries" defaultChecked={!socials.hide_contact_form}/><span><strong>Accept inquiries on my page</strong><small>Show your inquiry button and let visitors send their name, contact details and message.</small></span></label><Input name="contact_button_title" label="Button text" defaultValue={socials.contact_button_title || 'Send inquiry'} placeholder="Ask about a consultation" maxLength={80} required/><Input name="contact_form_title" label="Form heading" defaultValue={socials.contact_form_title || 'Let’s talk'} placeholder="Tell me about your goals" maxLength={120} required/><label className="dash-field-label" htmlFor="required-contact">Which contact details should visitors provide?</label><select id="required-contact" name="contact_required_fields" defaultValue={socials.contact_required_fields || 'email'}><option value="email">Require email · phone optional</option><option value="phone">Require phone · email optional</option><option value="both">Require both email and phone</option></select><p className="dash-field-help">Name and message are always required. Asking for less can make it easier to get in touch.</p></section><section className="dash-card"><h2>After someone gets in touch</h2><p className="dash-field-help">Show a clear confirmation. This message does not send an email or confirm a booking.</p><Input name="contact_success_message" label="Confirmation message" defaultValue={socials.contact_success_message || 'Thank you! I’ll be in touch soon.'} maxLength={500} required/></section>{state.error && <div className="dash-notice dash-notice-error" role="alert">{state.error}</div>}{state.saved > 0 && !state.error && !dirty && <div className="dash-notice" role="status"><Check size={16}/> Form settings saved.</div>}<div className="dash-savebar"><span>{dirty ? "You have unsaved form changes" : "Update your public inquiry form"}</span><SaveButton pending={pending}/></div></fieldset></form>;
}
