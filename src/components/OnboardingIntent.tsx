'use client';
import { useEffect } from 'react';
import { isAudience } from '@/lib/audiences';
export function OnboardingIntent({ audience }: { audience: string }) {
  useEffect(() => {
    if (isAudience(audience)) {
      try { window.localStorage.setItem('myrevlink-audience', audience); } catch { /* Storage is optional. */ }
    }
  }, [audience]);
  return null;
}
