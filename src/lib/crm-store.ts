import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { contactStages, mergeContacts, type CrmContact } from './crm';

export function crmDatabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
export async function loadContacts(business: { id: string; leads?: unknown; social_links?: Record<string, unknown> }) {
  const stages = contactStages(business.social_links?.lead_stages);
  const db = crmDatabase();
  const fallback = { contacts: mergeContacts(business.leads, [], stages), ready: false };
  if (!db) return fallback;
  const stored: CrmContact[] = [];
  for (let from = 0; ; from += 500) {
    const { data, error } = await db.from('crm_contacts').select('id,name,email,phone,company,notes,message,status,source,follow_up_on,archived_at,created_at,updated_at').eq('business_id', business.id).order('id').range(from, from + 499);
    if (error) return fallback;
    stored.push(...data as CrmContact[]);
    if (data.length < 500) break;
  }
  return { contacts: mergeContacts(business.leads, stored, stages), ready: true };
}
