'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Inbox, Mail, Phone, Plus, Check, X, Pencil, Archive, ArchiveRestore, CalendarDays, Building2, Download, ChevronDown } from 'lucide-react';

import { ContactEditor } from './dashboard/ContactEditor';
import { type CrmContact, type ContactDraft, type ContactResult } from '@/lib/crm';

interface Props {
  leads?: CrmContact[];
  leadStages: string[];
  crmReady: boolean;
  saveContact: (draft: ContactDraft) => Promise<ContactResult>;
  archiveContact: (id: string, archived: boolean, version?: string | null) => Promise<ContactResult>;
  updateLeadStatus: (leadId: string, newStatus: string, version?: string | null) => Promise<ContactResult>;
  updateLeadStages: (newStages: string[], renamedMap?: Record<string, string>, deletedStages?: string[]) => Promise<{ error?: string } | void>;
}
function StageRow({ stage, onRename, onRemove, disabled, canRemove }: { stage: string; onRename: (name: string) => void; onRemove: () => void; disabled: boolean; canRemove: boolean }) {
  const [name, setName] = useState(stage);
  return <div className="dash-stage-row"><input aria-label={`Rename stage ${stage}`} value={name} maxLength={60} disabled={disabled} onChange={event => setName(event.target.value)}/><button type="button" disabled={disabled || !name.trim() || name.trim() === stage} onClick={() => onRename(name.trim())}>Rename</button><button type="button" disabled={disabled || !canRemove} onClick={onRemove} aria-label={`Remove ${stage} stage`}>Remove</button></div>;
}
export function LeadsDashboard({ leads = [], leadStages, updateLeadStatus, updateLeadStages, crmReady, saveContact, archiveContact }: Props) {
  const [editor, setEditor] = useState<CrmContact | 'new' | null>(null);
  const [archived, setArchived] = useState(false);
  const [source, setSource] = useState('all');
  const addButton = useRef<HTMLButtonElement>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [manager, setManager] = useState(false);
  const [newStage, setNewStage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const stages = leadStages.length ? leadStages : ['New'];
  const term = search.trim().toLowerCase();
  const visible = leads.filter(lead => Boolean(lead.archived_at) === archived);
  const filtered = visible.filter(lead => (source === "all" || lead.source === source) && (!filter || (lead.status || stages[0]) === filter) && [lead.name, lead.email, lead.phone, lead.message, lead.status, lead.company, lead.notes].some(value => String(value || '').toLowerCase().includes(term))).sort((a,b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  async function mutate(task: () => Promise<{ error?: string } | void>, success: string) {
    setBusy(true); setError(''); setNotice('');
    try { const result = await task(); if (result?.error) throw new Error(result.error); setNotice(success); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'We couldn’t save that change. Please try again.'); }
    finally { setBusy(false); }
  }
  async function saveStages(next: string[], renamed?: Record<string, string>, deleted?: string[]) {
    const result = await updateLeadStages(next, renamed, deleted);
    if (result?.error) throw new Error(result.error);
  }
  function date(value: string) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(parsed) + ' UTC';
  }
  function closeEditor() { setEditor(null); requestAnimationFrame(() => addButton.current?.focus()); }
  function saved(contact: CrmContact) { setEditor(null); setArchived(false); setFilter(null); setSource('all'); setSearch(''); setError(''); setNotice(`${contact.name} saved.`); requestAnimationFrame(() => addButton.current?.focus()); }
  function exportContacts() {
    const cell = (value: unknown) => { const text = String(value ?? ''); return '"' + (/^[\s]*[=+@-]/.test(text) ? "'" + text : text).replace(/"/g, '""') + '"'; };
    const rows = [['Name','Email','Phone','Company','Stage','Source','Follow-up date','Private notes','Original inquiry','Archived'], ...filtered.map(contact => [contact.name,contact.email,contact.phone,contact.company,contact.status,contact.source === 'bio' ? 'Bio form' : 'Manual',contact.follow_up_on,contact.notes,contact.message,contact.archived_at ? 'Yes' : 'No'])];
    const url = URL.createObjectURL(new Blob(['\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url; link.download = 'myrevlink-contacts.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="dash-inbox"><div className="crm-header-actions"><button ref={addButton} type="button" className="dash-button" disabled={!crmReady || busy || Boolean(editor)} onClick={() => { setEditor('new'); setManager(false); setError(''); setNotice(''); }}><Plus size={18}/> Add contact</button><button type="button" className="dash-button dash-button-secondary" onClick={exportContacts} disabled={!filtered.length}><Download size={16}/> Export shown contacts</button></div>
    {!crmReady && <div className="dash-notice" role="status">Your existing inquiries are available below. Contact editing is temporarily unavailable. Please contact support to enable it.</div>}
    {editor && <ContactEditor key={editor === 'new' ? 'new' : editor.id} contact={editor === 'new' ? undefined : editor} stages={stages} save={saveContact} onSaved={saved} onCancel={closeEditor}/>}
    <div className="crm-view-switch"><button type="button" className={!archived ? 'active' : ''} aria-pressed={!archived} onClick={() => { setArchived(false); setFilter(null); }}>Active contacts <span>{leads.filter(contact => !contact.archived_at).length}</span></button><button type="button" className={archived ? 'active' : ''} aria-pressed={archived} onClick={() => { setArchived(true); setFilter(null); }}>Archived <span>{leads.filter(contact => contact.archived_at).length}</span></button></div>
    <div className="dash-inbox-toolbar"><div className="dash-search"><Search size={16}/><input type="search" value={search} onChange={event => setSearch(event.target.value)} aria-label="Search contacts" placeholder="Search name, contact, company or notes…"/></div></div>
    <details className="crm-filter-options"><summary>Filters & stages {(filter || source !== 'all') && <span className="dash-badge">Filters active</span>}<ChevronDown size={18}/></summary><div className="crm-filter-body"><div className="crm-source-filter"><label htmlFor="contact-source">Source</label><select id="contact-source" value={source} onChange={event => setSource(event.target.value)}><option value="all">All sources</option><option value="bio">Bio form</option><option value="manual">Manually added</option></select></div><div className="dash-stage-filters" aria-label="Filter contacts by stage"><button type="button" className={!filter ? 'active' : ''} aria-pressed={!filter} onClick={() => setFilter(null)}>All <span>{visible.length}</span></button>{stages.map(stage => <button type="button" key={stage} className={filter === stage ? 'active' : ''} aria-pressed={filter === stage} onClick={() => setFilter(stage)}>{stage}<span>{visible.filter(lead => (lead.status || stages[0]) === stage).length}</span></button>)}</div><button type="button" disabled={!crmReady || busy || Boolean(editor)} className="dash-button dash-button-secondary" aria-expanded={manager} aria-controls="stage-manager" onClick={() => setManager(value => !value)}><SlidersHorizontal size={14}/> Manage stages</button></div></details>
    {manager && <section className="dash-stage-manager" id="stage-manager"><div className="dash-card-heading"><h3>Your contact stages</h3><button type="button" className="dash-icon-button" aria-label="Close stage settings" onClick={() => setManager(false)}><X size={15}/></button></div><p>Your first stage is used for new form inquiries. Removing a stage moves its contacts to the first remaining stage.</p>{stages.map(stage => <StageRow key={stage} stage={stage} disabled={busy || Boolean(editor)} canRemove={stages.length > 1} onRename={name => {
      if (stages.includes(name)) { setError('That stage name already exists.'); return; }
      void mutate(async () => { await saveStages(stages.map(value => value === stage ? name : value), { [stage]: name }); if (filter === stage) setFilter(name); }, 'Stage renamed.');
    }} onRemove={() => void mutate(async () => { await saveStages(stages.filter(value => value !== stage), undefined, [stage]); if (filter === stage) setFilter(null); }, 'Stage removed. Its contacts have moved to the first remaining stage.')}/>)}<div className="dash-stage-add"><input aria-label="New stage name" placeholder="Add a stage, e.g. Consultation" maxLength={60} value={newStage} onChange={event => setNewStage(event.target.value)} disabled={busy}/><button type="button" className="dash-button" disabled={busy || !newStage.trim() || stages.length >= 15} onClick={() => {
      const name = newStage.trim();
      if (stages.includes(name)) { setError('That stage name already exists.'); return; }
      void mutate(async () => { await saveStages([...stages, name]); setNewStage(''); }, 'Stage added.');
    }}><Plus size={14}/> Add</button></div></section>}
    {error && <div className="dash-notice dash-notice-error" role="alert">{error}</div>}{notice && <div className="dash-notice" role="status"><Check size={15}/>{notice}</div>}
    {filtered.length ? <><p className="dash-inbox-summary" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'contact' : 'contacts'}{archived ? ' archived' : ''}{filter ? ` in ${filter}` : ''}</p>{filtered.map(lead => <article className="dash-lead-card" key={lead.id}><div className="dash-lead-heading"><span className="dash-person-avatar">{(lead.name || '?').slice(0,1).toUpperCase()}</span><div><h3>{lead.name || 'Unnamed contact'}</h3><time dateTime={lead.created_at}>Added {date(lead.created_at)}</time></div><select aria-label={`Stage for ${lead.name}`} value={lead.status || stages[0]} disabled={busy || !crmReady || Boolean(lead.archived_at) || Boolean(editor)} onChange={event => { const next = event.target.value; void mutate(() => updateLeadStatus(lead.id, next, lead.updated_at), `${lead.name} moved to ${next}.`); }}>{stages.map(stage => <option key={stage} value={stage}>{stage}</option>)}</select></div><div className="crm-contact-meta"><span className="dash-badge">{lead.source === 'manual' ? 'Manually added' : 'Bio form'}</span>{lead.company && <span><Building2 size={15}/>{lead.company}</span>}{lead.follow_up_on && <span><CalendarDays size={15}/>Follow up: {new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${lead.follow_up_on}T12:00:00Z`))}</span>}</div>{lead.message && <div className="crm-original"><span>Original inquiry</span><p>{lead.message}</p></div>}{lead.notes && <div className="crm-private-notes"><span>Private notes</span><p>{lead.notes}</p></div>}<div className="dash-lead-contacts">{lead.email && <a href={`mailto:${lead.email}`}><Mail size={16}/>{lead.email}</a>}{lead.phone && <a href={`tel:${lead.phone}`}><Phone size={16}/>{lead.phone}</a>}</div><div className="crm-contact-actions">{!lead.archived_at && <button type="button" className="dash-button dash-button-secondary" disabled={busy || !crmReady || Boolean(editor)} onClick={() => { setEditor(lead); setManager(false); setError(''); setNotice(''); }} aria-label={`Edit ${lead.name}`}><Pencil size={16}/>Edit contact</button>}<button type="button" className="dash-button dash-button-secondary" disabled={busy || !crmReady || Boolean(editor)} aria-label={`${lead.archived_at ? 'Restore' : 'Archive'} ${lead.name}`} onClick={() => void mutate(() => archiveContact(lead.id, !lead.archived_at, lead.updated_at), lead.archived_at ? `${lead.name} restored to active contacts.` : `${lead.name} archived. You can restore this contact from Archived.`)}>{lead.archived_at ? <ArchiveRestore size={16}/> : <Archive size={16}/>}{lead.archived_at ? 'Restore contact' : 'Archive'}</button></div></article>)}</> : <div className="dash-card"><div className="dash-empty"><span><Inbox size={27}/></span><h3>{term || filter || source !== 'all' ? 'No contacts match this view.' : archived ? 'No archived contacts.' : 'Keep your next client conversation here.'}</h3><p>{term || filter || source !== 'all' ? 'Try another search, source or stage.' : archived ? 'Archived contacts stay here until you restore them.' : 'Add a contact from a call or referral, or collect inquiries through your bio page.'}</p>{term || filter || source !== 'all' ? <button type="button" className="dash-button dash-button-secondary" onClick={() => { setSearch(''); setFilter(null); setSource('all'); }}>Clear filters</button> : !archived && <Link href="/dashboard/leads?tab=form" className="dash-button dash-button-secondary">Review inquiry form</Link>}</div></div>}
  </div>;
}
