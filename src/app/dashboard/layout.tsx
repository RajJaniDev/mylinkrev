import type { Metadata } from 'next';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ArrowUpRight, Link2, CircleHelp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DashboardNav } from '@/components/DashboardNav';
import { DashboardLayoutClient } from '@/components/DashboardLayoutClient';
import { loadContacts } from '@/lib/crm-store';
import './dashboard.css';

export const metadata: Metadata = { title: 'Your workspace | MyRevLink', robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect('/sign-in');
  const { data: business, error } = await supabase.from('businesses').select('*').eq('user_id', user.id).maybeSingle();
  if (error) return <div className="dashboard-app dash-welcome"><div className="dash-welcome-card"><h1>We couldn’t load your workspace.</h1><p>Your data hasn’t been changed. Try loading the dashboard again.</p><Link className="dash-button" href="/dashboard">Try again</Link></div></div>;
  if (!business) return <div className="dashboard-app dash-welcome"><header className="dash-welcome-header"><Link href="/" className="dash-brand"><span><Link2 size={21}/></span>myrevlink.</Link><UserButton appearance={{ elements: { userButtonTrigger: { minWidth: "44px", minHeight: "44px" } } }}/></header><main className="dash-welcome-card">{children}</main><p className="dash-welcome-help">Need a hand? <Link href="/contact-us">Get in touch</Link></p></div>;
  const socials = business.social_links || {};
  const stages = Array.isArray(socials.lead_stages) && socials.lead_stages.length ? socials.lead_stages : ['New', 'Contacted', 'Accepted', 'Rejected'];
  const crm = await loadContacts(business);
  const leads = crm.contacts.filter(contact => !contact.archived_at);
  const newCount = leads.filter((lead: { status?: string }) => !lead.status || lead.status === stages[0]).length;
  const feedbacks = Array.isArray(business.feedbacks) ? business.feedbacks : Array.isArray(socials.feedbacks) ? socials.feedbacks : [];
  const paid = ['active', 'completed'].includes(business.payment_status);
  return <DashboardLayoutClient name={business.name} account={<UserButton appearance={{ elements: { userButtonTrigger: { minWidth: "44px", minHeight: "44px" } } }}/>} sidebar={<>
    <Link href="/" className="dash-brand"><span><Link2 size={21}/></span>myrevlink.</Link>
    <div className="dash-business"><div className="dash-business-avatar">{business.name.slice(0, 1).toUpperCase()}</div><div><strong>{business.name}</strong><span>{paid ? 'Pro plan' : 'Free plan'}</span></div></div>
    <DashboardNav leadsCount={newCount} feedbackCount={feedbacks.length}/>
    <div className="dash-sidebar-bottom"><Link href={`/b/${business.slug}`} target="_blank" rel="noopener noreferrer"><ArrowUpRight size={17}/> View public page</Link><Link href="/contact-us"><CircleHelp size={17}/> Help & support</Link><p>A small link. Your next opportunity.</p></div>
  </>}>{children}</DashboardLayoutClient>;
}
