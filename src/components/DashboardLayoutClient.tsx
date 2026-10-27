'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function DashboardLayoutClient({ children, sidebar, account, name }: { children: ReactNode; sidebar: ReactNode; account: ReactNode; name: string }) {
  const pathname = usePathname();
  const section = pathname === '/dashboard/profile' ? 'My page' : pathname === '/dashboard/leads' ? 'Inquiries' : pathname === '/dashboard/qr' ? 'Review QR' : pathname === '/dashboard/feedback' ? 'Feedback' : 'Overview';
  return <div className="dashboard-app"><a href="#dashboard-content" className="dash-skip">Skip to content</a><aside className="dash-sidebar">{sidebar}</aside><div className="dash-workspace"><header className="dash-topbar"><div className="dash-breadcrumb"><span>Your workspace</span><span>/</span><strong>{section}</strong></div><div className="dash-account"><span>{name}</span>{account}</div></header><main id="dashboard-content" className={`dash-content ${pathname === '/dashboard/qr' ? 'dash-content-wide' : ''}`}>{children}</main></div></div>;
}
