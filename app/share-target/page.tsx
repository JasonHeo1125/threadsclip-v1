'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useTranslation } from '@/lib/i18n';

function ShareTargetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [threadsUrl, setThreadsUrl] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<'input' | 'saving' | 'success' | 'error'>('input');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const url = searchParams.get('url') || searchParams.get('text');

    if (!url) {
      router.push('/');
      return;
    }

    const threadsUrlMatch = url.match(/https?:\/\/(?:www\.)?threads\.(?:net|com)\/[^\s]+/);
    const extractedUrl = threadsUrlMatch ? threadsUrlMatch[0] : null;

    if (!extractedUrl) {
      setStatus('error');
      setMessage(t.pwa.shareTargetError);
      setTimeout(() => router.push('/'), 2000);
      return;
    }

    setThreadsUrl(extractedUrl);
  }, [searchParams, router, t]);

  async function handleSave() {
    if (!threadsUrl) return;
    
    setStatus('saving');
    
    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: threadsUrl, memo: memo.trim() }),
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

  if (status === 'saving') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center text-white p-8">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-xl font-medium">{t.pwa.shareTargetSaving}</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center text-white p-8">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xl font-medium">{message}</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center text-white p-8">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-xl font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="w-full max-w-md bg-[var(--color-bg-card)] rounded-2xl p-6 shadow-xl">
        <h1 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          쓰레드 저장
        </h1>

        {threadsUrl && (
          <div className="mb-4 p-3 bg-[var(--color-bg-elevated)] rounded-lg">
            <p className="text-xs text-[var(--color-text-muted)] mb-1">URL</p>
            <p className="text-sm text-[var(--color-text)] break-all line-clamp-2">{threadsUrl}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            {t.thread.memoLabel || '메모 (검색용)'}
          </label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder={t.thread.memoPlaceholder || '이 게시물에 대한 메모를 입력하세요'}
            className="input min-h-[100px] resize-none"
            autoFocus
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            💡 키워드, 요약 등을 입력하면 나중에 검색할 수 있어요
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push('/')}
            className="btn btn-secondary flex-1"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary flex-1"
            disabled={!threadsUrl}
          >
            {t.common.save}
          </button>
        </div>
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
