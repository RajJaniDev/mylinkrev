'use server';

import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { crmDatabase, loadContacts } from '@/lib/crm-store';
import { contactStages, validateContactDraft, type CrmContact, type ContactDraft, type ContactResult } from '@/lib/crm';

const unavailable = 'Contact management is temporarily unavailable. Your changes have not been saved. Please try again later or contact support.';
async function context() {
  const user = await currentUser();
  if (!user) return { error: 'Please sign in again before managing contacts.' } as const;
  const db = crmDatabase();
  if (!db) return { error: unavailable } as const;
  const { data: business, error } = await db.from('businesses').select('id,user_id,leads,social_links').eq('user_id', user.id).maybeSingle();
  if (error || !business) return { error: 'We couldn’t load your workspace. Please refresh and try again.' } as const;
  return { user, db, business, stages: contactStages(business.social_links?.lead_stages) };
}
function refresh() { revalidatePath('/dashboard', 'layout'); }
async function writeContact(ctx: Exclude<Awaited<ReturnType<typeof context>>, { error: string }>, existing: CrmContact | undefined, next: CrmContact): Promise<ContactResult> {
  const record = { ...next, business_id: ctx.business.id };
  const query = existing?.updated_at
    ? ctx.db.from('crm_contacts').update(record).eq('business_id', ctx.business.id).eq('id', next.id).eq('updated_at', existing.updated_at).select('id').maybeSingle()
    : ctx.db.from('crm_contacts').insert(record).select('id').single();
  const { data, error } = await query;
  if (error || !data) return { error: error?.code === '23505' || !error ? 'This contact changed in another session. Refresh it before trying again.' : unavailable };
  refresh();
  return { contact: next };
}
export async function saveContact(input: ContactDraft): Promise<ContactResult> {
  const ctx = await context();
  if ('error' in ctx) return { error: ctx.error };
  const parsed = validateContactDraft(input, ctx.stages);
  if ('error' in parsed) return parsed;
  const { draft } = parsed;
  const loaded = await loadContacts(ctx.business);
  if (!loaded.ready) return { error: unavailable };
  const existing = draft.id ? loaded.contacts.find(contact => contact.id === draft.id) : undefined;
  if (draft.id && !existing) return { error: 'This contact is no longer available. Refresh your contacts.' };
  if (existing && (existing.updated_at || null) !== (draft.version || null)) return { error: 'This contact changed in another session. Refresh it before saving.' };
  if (existing?.archived_at) return { error: 'Restore this contact before editing it.' };
  const email = draft.email ? draft.email.toLowerCase() : null;
  const phone = draft.phone || null;
  // Prevent accidental duplicates from a double tap or adding the same client twice.
  if (!existing && loaded.contacts.some(contact => !contact.archived_at && ((email && contact.email?.toLowerCase() === email) || (phone && contact.phone?.replace(/\D/g, '') === phone.replace(/\D/g, ''))))) return { error: 'A contact with that email or phone already exists. Search for it and edit the existing contact.' };
  const now = new Date().toISOString();
  const next: CrmContact = {
    id: existing?.id || crypto.randomUUID(), name: draft.name, email, phone, company: draft.company,
    notes: draft.notes, status: draft.status, follow_up_on: draft.follow_up_on || null,
    source: existing?.source || 'manual', message: existing?.message || '', archived_at: existing?.archived_at || null,
    created_at: existing?.created_at || now, updated_at: now,
  };
  return writeContact(ctx, existing, next);
}
export async function updateContactStatus(id: string, status: string, version?: string | null): Promise<ContactResult> {
  const ctx = await context();
  if ('error' in ctx) return { error: ctx.error };
  if (typeof id !== 'string' || typeof status !== 'string' || !ctx.stages.includes(status)) return { error: 'Choose one of your current stages.' };
  const loaded = await loadContacts(ctx.business);
  if (!loaded.ready) return { error: unavailable };
  const existing = loaded.contacts.find(contact => contact.id === id);
  if (!existing || existing.archived_at) return { error: 'This contact is unavailable. Refresh your contacts.' };
  if ((existing.updated_at || null) !== (version || null)) return { error: 'This contact changed in another session. Refresh and try again.' };
  return writeContact(ctx, existing, { ...existing, status, updated_at: new Date().toISOString() });
}
export async function archiveContact(id: string, archived: boolean, version?: string | null): Promise<ContactResult> {
  const ctx = await context();
  if ('error' in ctx) return { error: ctx.error };
  if (typeof id !== 'string' || typeof archived !== 'boolean') return { error: 'Choose a valid contact.' };
  const loaded = await loadContacts(ctx.business);
  if (!loaded.ready) return { error: unavailable };
  const existing = loaded.contacts.find(contact => contact.id === id);
  if (!existing) return { error: 'This contact is unavailable. Refresh your contacts.' };
  if ((existing.updated_at || null) !== (version || null)) return { error: 'This contact changed in another session. Refresh and try again.' };
  const now = new Date().toISOString();
  return writeContact(ctx, existing, { ...existing, archived_at: archived ? now : null, updated_at: now });
}
export async function updateContactStages(stages: string[], renamed: Record<string, string> = {}): Promise<{ error?: string }> {
  const ctx = await context();
  if ('error' in ctx) return { error: ctx.error };
  if (!Array.isArray(stages) || !stages.length || stages.length > 15 || stages.some(stage => typeof stage !== 'string' || !stage.trim() || stage.length > 60) || new Set(stages).size !== stages.length) return { error: 'Use 1–15 unique stage names of up to 60 characters.' };
  if (!renamed || typeof renamed !== 'object' || Array.isArray(renamed) || Object.entries(renamed).some(([old, next]) => !ctx.stages.includes(old) || typeof next !== 'string' || !stages.includes(next))) return { error: 'Check your renamed stages and try again.' };
  const { error } = await ctx.db.rpc('crm_update_stages', { p_business_id: ctx.business.id, p_user_id: ctx.user.id, p_stages: stages, p_renamed: renamed });
  if (error) return { error: unavailable };
  refresh();
  return {};
}
