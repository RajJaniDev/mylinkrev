'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PanelTop, Inbox, QrCode, MessageSquare, Ellipsis, CircleHelp } from 'lucide-react';

export function DashboardNav({ leadsCount = 0, feedbackCount = 0 }: { leadsCount?: number; feedbackCount?: number }) {
  const pathname = usePathname();
  const items = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, count: 0 },
    { href: '/dashboard/profile', label: 'My page', icon: PanelTop, count: 0 },
    { href: '/dashboard/leads', label: 'Contacts', icon: Inbox, count: leadsCount },
  ];
  const tools = [
    { href: '/dashboard/qr', label: 'Review QR', icon: QrCode, count: 0 },
    { href: '/dashboard/feedback', label: 'Feedback', icon: MessageSquare, count: feedbackCount },
  ];
  function render(item: typeof items[number], mobile = false) {
    const Icon = item.icon;
    return <Link key={`${mobile ? "mobile" : "desktop"}-${item.href}`} href={item.href} className={`dash-nav-link ${pathname === item.href ? 'is-active' : ''}`} aria-current={pathname === item.href ? 'page' : undefined}>
      <Icon size={18}/><span>{item.label}</span>{item.count > 0 && <span className="dash-nav-count">{item.count}</span>}
    </Link>;
  }
  return <nav aria-label="Dashboard navigation" className="dash-navigation"><div className="dash-nav-group">{items.map(item => render(item))}</div><div className="dash-nav-group dash-optional"><span className="dash-nav-label">OPTIONAL TOOLS</span>{tools.map(item => render(item))}</div><details className="dash-mobile-tools" onClick={event => { if ((event.target as HTMLElement).closest("a")) event.currentTarget.open = false; }} onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }}><summary aria-label="More dashboard tools"><Ellipsis size={21}/><span>More</span></summary><div className="dash-mobile-tools-menu">{tools.map(item => render(item, true))}<Link href="/contact-us" className="dash-nav-link"><CircleHelp size={18}/><span>Help & support</span></Link></div></details></nav>;
}
