import Link from 'next/link';
import type { CrmContact } from '@/lib/crm';
import { ArrowRight, PanelTop, Inbox, Check, MessageSquare, ArrowUpRight } from 'lucide-react';
import { GettingStarted } from '@/components/GettingStarted';
import { ShareLink } from '@/components/dashboard/ShareLink';

export function DashboardOverview({ business, firstName, contacts, params = {} }: { business: { slug: string; name: string; description?: string; payment_status: string; leads?: any[]; social_links: Record<string, any> }; firstName?: string | null; contacts?: CrmContact[]; params?: { success?: string; error?: string } }) {
  const socials = business.social_links || {};
  const capturedCount = Array.isArray(business.leads) ? business.leads.length : 0;
  const leads = contacts ? contacts.filter(contact => !contact.archived_at) : Array.isArray(business.leads) ? business.leads : [];
  const stages = Array.isArray(socials.lead_stages) && socials.lead_stages.length ? socials.lead_stages : ['New', 'Contacted', 'Accepted', 'Rejected'];
  const newLeads = leads.filter(lead => !lead.status || lead.status === stages[0]).length;
  const handled = leads.length - newLeads;
  const hasBio = Boolean(business.description?.trim());
  const hasLinks = Boolean(socials.booking_url || socials.instagram || socials.youtube || socials.whatsapp || socials.linkedin || socials.custom_links?.some((link: { url?: string }) => link.url));
  const accepts = !socials.hide_contact_form;
  const paid = ['active', 'completed'].includes(business.payment_status);
  const canReceive = accepts && (paid || capturedCount < 7);
  const recent = [...leads].sort((a,b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0,3);
  return <div className="dash-page">
    <div className="dash-page-heading"><div><span className="dash-eyebrow">YOUR WORKSPACE</span><h1>{params.success === 'registered' ? 'Your next chapter starts here.' : `Welcome back, ${firstName || business.name}.`}</h1><p>{newLeads ? `You have ${newLeads} ${newLeads === 1 ? 'contact' : 'contacts'} to follow up with. Keep the conversation going.` : 'A clear view of your page, your contacts and what to do next.'}</p></div><Link href="/dashboard/profile" className="dash-button dash-button-secondary"><PanelTop size={16}/> Edit my page</Link></div>
    {params.success === 'registered' && <div className="dash-notice" role="status"><Check size={17}/> Your page is created. Add your links and preview it before sharing.</div>}
    {params.success && params.success !== 'registered' && <div className="dash-notice" role="status">{paid ? 'Your Pro plan is active.' : 'Your plan updates after payment is confirmed. You can keep using your free page.'}</div>}
    {params.error && <div className="dash-notice dash-notice-error" role="alert">{params.error === 'CheckoutFailed' ? 'Checkout couldn’t start. Please try again from My page.' : 'Something went wrong. Please try again or contact support.'}</div>}
    <ShareLink slug={business.slug}/>
    <div className="dash-stats"><div><span><Inbox size={16}/> Active contacts</span><strong>{leads.length}</strong><small>Manual contacts and form inquiries</small></div><div><span><MessageSquare size={16}/> Awaiting first contact</span><strong>{newLeads}</strong><small>In your “{stages[0]}” stage</small></div><div><span><Check size={16}/> Other stages</span><strong>{handled}</strong><small>Moved out of your first stage</small></div></div>
    {!(hasBio && hasLinks && accepts) && <GettingStarted slug={business.slug} hasBio={hasBio} hasLinks={hasLinks} capturesLeads={accepts}/>}
    <section className="dash-card"><div className="dash-card-heading"><div><h2>Recent contacts</h2><p>Your latest conversations start here.</p></div><Link href="/dashboard/leads" className="dash-text-link">View contacts <ArrowRight size={15}/></Link></div>{recent.length ? <div className="dash-recent-list">{recent.map(lead => <Link key={lead.id} href="/dashboard/leads" className="dash-recent-row"><span className="dash-person-avatar">{lead.name.slice(0,1).toUpperCase()}</span><div><strong>{lead.name}</strong><p>{lead.company || lead.message || "Manually added contact"}</p></div><span className="dash-badge">{lead.status || stages[0]}</span><ArrowUpRight size={16}/></Link>)}</div> : <div className="dash-empty"><span><Inbox size={26}/></span><h3>Your next conversation starts with your link.</h3><p>Add your page to your social bio or share it directly. New inquiries will appear here.</p><Link href="/dashboard/leads?tab=form" className="dash-button dash-button-secondary">Review my inquiry form <ArrowRight size={15}/></Link></div>}</section>
    <div className="dash-overview-bottom"><div className="dash-card"><span className={`dash-status ${canReceive ? '' : 'is-paused'}`}><span/>{!accepts ? 'Inquiry form paused' : canReceive ? 'Inquiry form enabled' : 'Free lead allowance reached'}</span><h3>{canReceive ? 'Give visitors a way to reach you.' : accepts ? 'Ready for more conversations?' : 'Ready to start a conversation?'}</h3><p>{canReceive ? 'Check the wording and contact details you ask visitors to share.' : accepts ? 'Your free allowance is full. Review your plan to receive more inquiries.' : 'Enable your inquiry form when you’re ready to receive requests.'}</p><Link href="/dashboard/leads?tab=form" className="dash-text-link">Manage inquiry form <ArrowRight size={15}/></Link></div><div className="dash-card"><span className="dash-eyebrow">{paid ? 'YOUR PRO PLAN' : 'YOUR FREE PLAN'}</span><h3>{paid ? 'Room for more conversations.' : `${capturedCount} of 7 free form inquiries collected`}</h3><p>{paid ? 'Your plan includes unlimited inquiries and additional profile customization.' : capturedCount >= 7 ? 'Your free allowance is full. Upgrade to receive more inquiries.' : 'Start with your first connections. Review upgrade options when you need more.'}</p><Link href="/dashboard/profile#plan" className="dash-text-link">{paid ? 'View plan' : 'View upgrade options'} <ArrowRight size={15}/></Link></div></div>
  </div>;
}
