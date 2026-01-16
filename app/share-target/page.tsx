'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useTranslation } from '@/lib/i18n';

function ShareTargetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const url = searchParams.get('url') || searchParams.get('text');

    if (!url) {
      router.push('/');
      return;
    }

    const threadsUrlMatch = url.match(/https?:\/\/(?:www\.)?threads\.net\/[^\s]+/);
    const threadsUrl = threadsUrlMatch ? threadsUrlMatch[0] : null;

    if (!threadsUrl) {
      setStatus('error');
      setMessage(t.pwa.shareTargetError);
      setTimeout(() => router.push('/'), 2000);
      return;
    }

    saveThread(threadsUrl);
  }, [searchParams, router, t]);

  async function saveThread(url: string) {
    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (response.ok || response.status === 409) {
        setStatus('success');
        setMessage(t.pwa.shareTargetSuccess);
        setTimeout(() => router.push('/?saved=true'), 1500);
      } else {
        throw new Error('Save failed');
      }
    } catch {
      setStatus('error');
      setMessage(t.common.error);
      setTimeout(() => router.push('/'), 2000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="text-center text-white p-8">
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-xl font-medium">{t.pwa.shareTargetSaving}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xl font-medium">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-xl font-medium">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function ShareTargetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ShareTargetContent />
    </Suspense>
  );
}
