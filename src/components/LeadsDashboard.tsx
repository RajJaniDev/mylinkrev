'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Inbox, Mail, Phone, Plus, Check, X } from 'lucide-react';

interface Lead { id: string; name: string; email?: string | null; phone?: string | null; message: string; status?: string; created_at: string; }
interface Props {
  leads?: Lead[];
  leadStages: string[];
  updateLeadStatus: (leadId: string, newStatus: string) => Promise<{ error?: string } | void>;
  updateLeadStages: (newStages: string[], renamedMap?: Record<string, string>, deletedStages?: string[]) => Promise<{ error?: string } | void>;
}
function StageRow({ stage, onRename, onRemove, disabled, canRemove }: { stage: string; onRename: (name: string) => void; onRemove: () => void; disabled: boolean; canRemove: boolean }) {
  const [name, setName] = useState(stage);
  return <div className="dash-stage-row"><input aria-label={`Rename stage ${stage}`} value={name} maxLength={60} disabled={disabled} onChange={event => setName(event.target.value)}/><button type="button" disabled={disabled || !name.trim() || name.trim() === stage} onClick={() => onRename(name.trim())}>Rename</button><button type="button" disabled={disabled || !canRemove} onClick={onRemove} aria-label={`Remove ${stage} stage`}>Remove</button></div>;
}
export function LeadsDashboard({ leads = [], leadStages, updateLeadStatus, updateLeadStages }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [manager, setManager] = useState(false);
  const [newStage, setNewStage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const stages = leadStages.length ? leadStages : ['New'];
  const term = search.trim().toLowerCase();
  const filtered = leads.filter(lead => (!filter || (lead.status || stages[0]) === filter) && [lead.name, lead.email, lead.phone, lead.message, lead.status].some(value => String(value || '').toLowerCase().includes(term))).sort((a,b) => Date.parse(b.created_at) - Date.parse(a.created_at));
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
  return <div className="dash-inbox"><div className="dash-inbox-toolbar"><div className="dash-search"><Search size={16}/><input type="search" value={search} onChange={event => setSearch(event.target.value)} aria-label="Search inquiries" placeholder="Search name, contact or message…"/></div><button type="button" className="dash-button dash-button-secondary" aria-expanded={manager} aria-controls="stage-manager" onClick={() => setManager(value => !value)}><SlidersHorizontal size={14}/> Manage stages</button></div><div className="dash-stage-filters" aria-label="Filter inquiries by stage"><button type="button" className={!filter ? 'active' : ''} aria-pressed={!filter} onClick={() => setFilter(null)}>All <span>{leads.length}</span></button>{stages.map(stage => <button type="button" key={stage} className={filter === stage ? 'active' : ''} aria-pressed={filter === stage} onClick={() => setFilter(stage)}>{stage}<span>{leads.filter(lead => (lead.status || stages[0]) === stage).length}</span></button>)}</div>
    {manager && <section className="dash-stage-manager" id="stage-manager"><div className="dash-card-heading"><h3>Your inquiry stages</h3><button type="button" className="dash-icon-button" aria-label="Close stage settings" onClick={() => setManager(false)}><X size={15}/></button></div><p>Your first stage is used for new inquiries. Removing a stage moves its inquiries to the first remaining stage.</p>{stages.map(stage => <StageRow key={stage} stage={stage} disabled={busy} canRemove={stages.length > 1} onRename={name => {
      if (stages.includes(name)) { setError('That stage name already exists.'); return; }
      void mutate(async () => { await saveStages(stages.map(value => value === stage ? name : value), { [stage]: name }); if (filter === stage) setFilter(name); }, 'Stage renamed.');
    }} onRemove={() => void mutate(async () => { await saveStages(stages.filter(value => value !== stage), undefined, [stage]); if (filter === stage) setFilter(null); }, 'Stage removed. Its inquiries have moved to the first remaining stage.')}/>)}<div className="dash-stage-add"><input aria-label="New stage name" placeholder="Add a stage, e.g. Consultation" maxLength={60} value={newStage} onChange={event => setNewStage(event.target.value)} disabled={busy}/><button type="button" className="dash-button" disabled={busy || !newStage.trim() || stages.length >= 15} onClick={() => {
      const name = newStage.trim();
      if (stages.includes(name)) { setError('That stage name already exists.'); return; }
      void mutate(async () => { await saveStages([...stages, name]); setNewStage(''); }, 'Stage added.');
    }}><Plus size={14}/> Add</button></div></section>}
    {error && <div className="dash-notice dash-notice-error" role="alert">{error}</div>}{notice && <div className="dash-notice" role="status"><Check size={15}/>{notice}</div>}
    {filtered.length ? <><p className="dash-inbox-summary" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'inquiry' : 'inquiries'}{filter ? ` in ${filter}` : ''}</p>{filtered.map(lead => <article className="dash-lead-card" key={lead.id}><div className="dash-lead-heading"><span className="dash-person-avatar">{(lead.name || '?').slice(0,1).toUpperCase()}</span><div><h3>{lead.name || 'Unnamed contact'}</h3><time dateTime={lead.created_at}>{date(lead.created_at)}</time></div><select aria-label={`Stage for ${lead.name}`} value={lead.status || stages[0]} disabled={busy} onChange={event => { const next = event.target.value; void mutate(() => updateLeadStatus(lead.id, next), `${lead.name} moved to ${next}.`); }}>{stages.map(stage => <option key={stage} value={stage}>{stage}</option>)}</select></div><p>{lead.message}</p><div className="dash-lead-contacts">{lead.email && <a href={`mailto:${lead.email}`}><Mail size={14}/>{lead.email}</a>}{lead.phone && <a href={`tel:${lead.phone}`}><Phone size={14}/>{lead.phone}</a>}</div></article>)}</> : <div className="dash-card"><div className="dash-empty"><span><Inbox size={27}/></span><h3>{leads.length ? 'No inquiries match this view.' : 'Your inbox is ready for its first conversation.'}</h3><p>{leads.length ? 'Try another search or stage to find the conversation you’re looking for.' : 'Share your page and give visitors a clear way to ask about your services.'}</p>{leads.length ? <button type="button" className="dash-button dash-button-secondary" onClick={() => { setSearch(''); setFilter(null); }}>Clear filters</button> : <Link href="/dashboard/leads?tab=form" className="dash-button dash-button-secondary">Review inquiry form</Link>}</div></div>}
  </div>;
}
