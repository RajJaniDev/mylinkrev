'use client';

export default function DashboardError({ reset }: { reset: () => void }) {
  return <section className="dash-card dash-empty"><h2>We couldn’t load this part of your workspace.</h2><p>Please try again. Your saved information hasn’t been changed.</p><button className="dash-button" type="button" onClick={reset}>Try again</button></section>;
}
