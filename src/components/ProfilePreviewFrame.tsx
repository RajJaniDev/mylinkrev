'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export function ProfilePreviewFrame({ slug }: { slug?: string }) {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setRevision(value => value + 1);
    window.addEventListener('myrevlink:profile-saved', refresh);
    return () => window.removeEventListener('myrevlink:profile-saved', refresh);
  }, []);
  if (!slug) return <p className="dash-field-help">Create your page to see a preview.</p>;
  return <div className="dash-preview-frame"><button type="button" className="dash-preview-refresh" onClick={() => setRevision(value => value + 1)}><RefreshCw size={13}/> Refresh saved page</button><iframe src={`/b/${slug}`} key={`${slug}-${revision}`} title="Your saved public profile" loading="lazy"/></div>;
}
