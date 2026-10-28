export type ContactSource = 'manual' | 'bio';
export interface CrmContact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string;
  notes: string;
  message: string;
  status: string;
  source: ContactSource;
  follow_up_on: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string | null;
}
export interface ContactDraft {
  id?: string;
  version?: string | null;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  status: string;
  follow_up_on: string;
}
export type ContactResult = { error?: string; contact?: CrmContact };
export const DEFAULT_STAGES = ['New', 'Contacted', 'Accepted', 'Rejected'];
export function contactStages(value: unknown): string[] {
  return Array.isArray(value) && value.length && value.every(stage => typeof stage === 'string' && stage.trim()) ? value : DEFAULT_STAGES;
}
export function validateContactDraft(value: unknown, stages: string[]): { error: string } | { draft: ContactDraft } {
  if (!value || typeof value !== 'object') return { error: 'Check the contact details and try again.' };
  const data = value as Record<string, unknown>;
  const limits = { name: 120, email: 254, phone: 32, company: 160, notes: 4000, status: 60, follow_up_on: 10 };
  const clean: Record<string, string> = {};
  for (const [key, max] of Object.entries(limits)) {
    const input = data[key] ?? '';
    if (typeof input !== 'string' || input.length > max) return { error: `${key === 'follow_up_on' ? 'Follow-up date' : key[0].toUpperCase() + key.slice(1)} is too long or invalid.` };
    clean[key] = input.trim();
  }
  if (!clean.name) return { error: 'Add a name for this contact.' };
  if (clean.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) return { error: 'Enter a valid email address, or leave it empty.' };
  if (clean.phone && (!/^\+?[\d\s().-]+$/.test(clean.phone) || clean.phone.replace(/\D/g, '').length < 7 || clean.phone.replace(/\D/g, '').length > 15)) return { error: 'Enter a valid phone number with 7–15 digits, or leave it empty.' };
  if (!stages.includes(clean.status)) return { error: 'Choose one of your current stages.' };
  if (clean.follow_up_on) {
    const date = new Date(`${clean.follow_up_on}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(clean.follow_up_on) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== clean.follow_up_on) return { error: 'Choose a valid follow-up date.' };
  }
  if (data.id !== undefined && (typeof data.id !== 'string' || !data.id || data.id.length > 128)) return { error: 'This contact is no longer available. Refresh and try again.' };
  if (data.version != null && typeof data.version !== 'string') return { error: 'Refresh this contact before editing it.' };
  return { draft: { ...clean, id: data.id as string | undefined, version: data.version as string | null | undefined } as ContactDraft };
}
export function mergeContacts(legacy: unknown, stored: CrmContact[], stages: string[]): CrmContact[] {
  const contacts = new Map<string, CrmContact>();
  if (Array.isArray(legacy)) for (const value of legacy) {
    if (!value || typeof value.id !== 'string') continue;
    contacts.set(value.id, {
      id: value.id, name: String(value.name || 'Unnamed contact'), email: typeof value.email === 'string' ? value.email : null,
      phone: typeof value.phone === 'string' ? value.phone : null, message: String(value.message || ''), status: typeof value.status === 'string' ? value.status : stages[0],
      company: '', notes: '', source: 'bio', follow_up_on: null, archived_at: null,
      created_at: typeof value.created_at === 'string' ? value.created_at : '1970-01-01T00:00:00.000Z', updated_at: null,
    });
  }
  for (const contact of stored) contacts.set(contact.id, contact);
  return [...contacts.values()].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}
