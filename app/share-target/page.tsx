'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useTranslation } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';

function ShareTargetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const [threadsUrl, setThreadsUrl] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<'loading' | 'login' | 'input' | 'saving' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setStatus('login');
        return;
      }

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
      setStatus('input');
    }

    checkAuth();
  }, [searchParams, router, t, supabase.auth]);

  async function handleLogin() {
    const currentUrl = window.location.href;
    localStorage.setItem('redirectAfterLogin', currentUrl);
    router.push('/login');
  }

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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
        <div className="w-full max-w-md bg-[var(--color-bg-card)] rounded-2xl p-6 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[var(--color-text)] mb-2">
            로그인이 필요해요
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            쓰레드를 저장하려면 먼저 로그인해주세요
          </p>
          <button
            onClick={handleLogin}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 로그인
          </button>
          <button
            onClick={() => router.push('/')}
            className="btn btn-ghost w-full mt-3"
          >
            {t.common.cancel}
          </button>
        </div>
      </div>
    );
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
