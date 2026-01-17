'use client';

import { Suspense } from 'react';
import { useTranslation } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginContent() {
  const { t, language, setLanguage } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      localStorage.setItem('loginRedirect', redirect);
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] opacity-10" />
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-secondary)] rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      
      <button
        onClick={toggleLanguage}
        className="absolute top-6 right-6 btn btn-ghost text-sm"
      >
        {language === 'ko' ? 'EN' : '한국어'}
      </button>
      
      <main className="relative z-10 w-full max-w-md px-6 animate-fade-in">
        <div className="card p-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-bg mb-6 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text">{t.common.appName}</span>
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              {t.common.tagline}
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              {language === 'ko' ? '시작하기 전에' : 'Before you start'}
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm">
              {language === 'ko' ? '먼저 사용법을 확인해주세요!' : 'Please check how to use first!'}
            </p>
            
            <Link
              href="/guide"
              className="btn btn-primary w-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {language === 'ko' ? '사용법 보기' : 'How to use'}
            </Link>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border)]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[var(--color-bg-card)] text-[var(--color-text-muted)]">
                  {language === 'ko' ? '이미 사용법을 알고 있다면' : 'Already know how to use?'}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="btn w-full bg-white dark:bg-[var(--color-bg-elevated)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:shadow-md transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[var(--color-text-muted)] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t.auth.loginWithGoogle}
                </>
              )}
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)]">
              {language === 'ko' 
                ? <>로그인 시 <Link href="/terms" className="underline hover:text-[var(--color-primary)]">이용약관</Link> 및 <Link href="/privacy" className="underline hover:text-[var(--color-primary)]">개인정보처리방침</Link>에 동의하게 됩니다.</>
                : <>By logging in, you agree to our <Link href="/terms" className="underline hover:text-[var(--color-primary)]">Terms</Link> and <Link href="/privacy" className="underline hover:text-[var(--color-primary)]">Privacy Policy</Link>.</>}
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {language === 'ko' ? '저장' : 'Save'}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {language === 'ko' ? '검색' : 'Search'}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {language === 'ko' ? '태그' : 'Tags'}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-[var(--color-text-muted)] mt-4 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <a 
              href="https://www.threads.net/@all_dayjs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              {language === 'ko' ? '문의 : @all_dayjs' : 'Contact : @all_dayjs'}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}
