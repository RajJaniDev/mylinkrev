'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
export function InquiryTabs({ inbox, form }: { inbox: ReactNode; form: ReactNode }) {
  const params = useSearchParams();
  const showForm = params.get('tab') === 'form';
  return <><nav className="dash-tabs" aria-label="Inquiry views"><Link href="/dashboard/leads" className={!showForm ? 'active' : ''} aria-current={!showForm ? 'page' : undefined}>Inbox</Link><Link href="/dashboard/leads?tab=form" className={showForm ? 'active' : ''} aria-current={showForm ? 'page' : undefined}>Inquiry form</Link></nav>{showForm ? form : inbox}</>;
}
