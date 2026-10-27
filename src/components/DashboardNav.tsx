'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PanelTop, Inbox, QrCode, MessageSquare } from 'lucide-react';

export function DashboardNav({ leadsCount = 0, feedbackCount = 0 }: { leadsCount?: number; feedbackCount?: number }) {
  const pathname = usePathname();
  const items = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, count: 0 },
    { href: '/dashboard/profile', label: 'My page', icon: PanelTop, count: 0 },
    { href: '/dashboard/leads', label: 'Inquiries', icon: Inbox, count: leadsCount },
  ];
  const tools = [
    { href: '/dashboard/qr', label: 'Review QR', icon: QrCode, count: 0 },
    { href: '/dashboard/feedback', label: 'Feedback', icon: MessageSquare, count: feedbackCount },
  ];
  function render(item: typeof items[number]) {
    const Icon = item.icon;
    return <Link key={item.href} href={item.href} className={`dash-nav-link ${pathname === item.href ? 'is-active' : ''}`} aria-current={pathname === item.href ? 'page' : undefined}>
      <Icon size={18}/><span>{item.label}</span>{item.count > 0 && <span className="dash-nav-count">{item.count}</span>}
    </Link>;
  }
  return <nav aria-label="Dashboard navigation" className="dash-navigation"><div className="dash-nav-group">{items.map(render)}</div><div className="dash-nav-group dash-optional"><span className="dash-nav-label">OPTIONAL TOOLS</span>{tools.map(render)}</div></nav>;
}
