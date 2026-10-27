export default function DashboardLoading() {
  return <div className="dash-page" role="status" aria-label="Loading workspace"><div className="dash-page-heading"><div><span className="dash-eyebrow">YOUR WORKSPACE</span><h1>Getting things ready…</h1><p>Your page and inquiries will appear here shortly.</p></div></div><div className="dash-card" style={{ minHeight: 130, background: '#f0f3eb' }}/><div className="dash-stats">{[1,2,3].map(item => <div key={item} style={{ minHeight: 115 }}/>)}</div></div>;
}
