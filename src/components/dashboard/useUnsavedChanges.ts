'use client';

import { useEffect } from 'react';

export function useUnsavedChanges(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const warnOnUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    const warnOnLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const anchor = (event.target as HTMLElement).closest('a');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const next = new URL(anchor.href, window.location.href);
      if (next.origin === window.location.origin && next.pathname === window.location.pathname && next.search === window.location.search) return;
      if (!window.confirm('You have unsaved changes. Leave this page without saving?')) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener('beforeunload', warnOnUnload);
    document.addEventListener('click', warnOnLink, true);
    return () => { window.removeEventListener('beforeunload', warnOnUnload); document.removeEventListener('click', warnOnLink, true); };
  }, [dirty]);
}
