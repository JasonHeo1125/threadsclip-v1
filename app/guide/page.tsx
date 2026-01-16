'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type Platform = 'ios' | 'android';

function LoginStepCard({ isLoggedIn, isKorean }: { isLoggedIn: boolean; isKorean: boolean }) {
  if (isLoggedIn) {
    return (
      <div className="card p-6 border-2 border-green-500/50 bg-green-500/5 opacity-60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            {isKorean ? '로그인 완료!' : 'Logged In!'}
          </h2>
          <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
            {isKorean ? '완료' : 'Done'}
          </span>
        </div>
        <p className="text-[var(--color-text-muted)] mt-3 text-sm">
          {isKorean 
            ? '✅ 로그인이 완료되었습니다. 다음 단계로 진행하세요!'
            : '✅ You are logged in. Continue to the next step!'}
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6 border-2 border-[var(--color-primary)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
          0
        </div>
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          {isKorean ? '먼저 로그인하기' : 'Login First'}
        </h2>
        <span className="px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs rounded-full">
          {isKorean ? '중요' : 'Important'}
        </span>
      </div>
      <p className="text-[var(--color-text-secondary)] mb-4">
        {isKorean 
          ? '⚠️ 단축어 설정 전에 먼저 로그인해주세요! 로그인하지 않으면 공유 시 다시 해야 할 수 있어요.'
          : '⚠️ Please login before setting up the shortcut! Otherwise, you may need to share again.'}
      </p>
      <Link
        href="/login?redirect=/guide"
        className="btn btn-primary w-full flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {isKorean ? '로그인하기' : 'Login'}
      </Link>
    </div>
  );
}

export default function GuidePage() {
  const { language } = useTranslation();
  const isKorean = language === 'ko';
  const [platform, setPlatform] = useState<Platform>('ios');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const SHORTCUT_URL = 'https://www.icloud.com/shortcuts/8e84b75970404140964e6ccb9a344a75';

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setIsLoading(false);
    };
    checkAuth();
  }, [supabase.auth]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-40 bg-[var(--color-bg)]/80 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href={isLoggedIn ? "/" : "/login"} className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[var(--color-text)]">{isKorean ? '돌아가기' : 'Back'}</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            {isKorean ? '사용 가이드' : 'How to Use'}
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {isKorean ? 'Threads 게시물을 빠르게 저장하는 방법' : 'How to quickly save Threads posts'}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-[var(--color-bg-elevated)] rounded-full p-1">
            <button
              onClick={() => setPlatform('ios')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                platform === 'ios'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              🍎 iPhone
            </button>
            <button
              onClick={() => setPlatform('android')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                platform === 'android'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              🤖 Android
            </button>
          </div>
        </div>

        {platform === 'ios' ? (
          <div className="space-y-6">
            {isLoading ? (
              <div className="card p-6 animate-pulse">
                <div className="h-8 bg-[var(--color-bg-elevated)] rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-[var(--color-bg-elevated)] rounded w-2/3 mb-4"></div>
                <div className="h-10 bg-[var(--color-bg-elevated)] rounded"></div>
              </div>
            ) : (
              <LoginStepCard isLoggedIn={isLoggedIn} isKorean={isKorean} />
            )}

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {isKorean ? '단축어 추가하기' : 'Add Shortcut'}
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                {isKorean 
                  ? '아래 버튼을 눌러 ThreadClip 단축어를 추가하세요.'
                  : 'Tap the button below to add the ThreadClip shortcut.'}
              </p>
              <a
                href={SHORTCUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {isKorean ? '단축어 추가하기' : 'Add Shortcut'}
              </a>
              <div className="mt-4 p-3 bg-[var(--color-bg-elevated)] rounded-lg">
                <p className="text-xs text-[var(--color-text-muted)]">
                  {isKorean 
                    ? '💡 단축어 앱이 열리면 "단축어 추가" 버튼을 눌러주세요'
                    : '💡 When the Shortcuts app opens, tap "Add Shortcut"'}
                </p>
              </div>
              <div className="mt-4 aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">{isKorean ? '스크린샷 준비중' : 'Screenshot coming soon'}</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {isKorean ? 'Threads에서 공유하기' : 'Share from Threads'}
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                {isKorean 
                  ? '저장하고 싶은 게시물에서 공유 버튼을 누르세요.'
                  : 'Tap the share button on the post you want to save.'}
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">{isKorean ? '스크린샷 준비중' : 'Screenshot coming soon'}</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {isKorean ? 'ThreadClip 단축어 선택' : 'Select ThreadClip Shortcut'}
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                {isKorean 
                  ? '공유 시트에서 "Thread clip" 단축어를 선택하세요.'
                  : 'Select the "Thread clip" shortcut from the share sheet.'}
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">{isKorean ? '스크린샷 준비중' : 'Screenshot coming soon'}</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  4
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {isKorean ? '"항상 허용" 선택' : 'Select "Always Allow"'}
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                {isKorean 
                  ? '권한 요청 팝업이 나타나면 "항상 허용"을 선택해주세요. 이후에는 별도 확인 없이 바로 저장됩니다.'
                  : 'When the permission popup appears, select "Always Allow". After this, posts will be saved without additional confirmation.'}
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">{isKorean ? '스크린샷 준비중' : 'Screenshot coming soon'}</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  5
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {isKorean ? '메모 입력 후 저장' : 'Add Note and Save'}
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                {isKorean 
                  ? 'Safari가 열리면 메모를 입력하고 저장 버튼을 누르세요.'
                  : 'When Safari opens, enter a note and tap the save button.'}
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">{isKorean ? '스크린샷 준비중' : 'Screenshot coming soon'}</p>
              </div>
            </div>

            <div className="card p-4 bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30">
              <p className="text-sm text-[var(--color-text)]">
                {isKorean 
                  ? '💡 팁: 처음 사용 시 로그인이 필요합니다. 한번 로그인하면 이후에는 바로 저장할 수 있어요!'
                  : '💡 Tip: Login is required on first use. Once logged in, you can save posts instantly!'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {isLoading ? (
              <div className="card p-6 animate-pulse">
                <div className="h-8 bg-[var(--color-bg-elevated)] rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-[var(--color-bg-elevated)] rounded w-2/3 mb-4"></div>
                <div className="h-10 bg-[var(--color-bg-elevated)] rounded"></div>
              </div>
            ) : isLoggedIn ? (
              <div className="card p-6 border-2 border-green-500/50 bg-green-500/5 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    {isKorean ? '로그인 완료!' : 'Logged In!'}
                  </h2>
                  <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                    {isKorean ? '완료' : 'Done'}
                  </span>
                </div>
                <p className="text-[var(--color-text-muted)] mt-3 text-sm">
                  {isKorean 
                    ? '✅ 로그인이 완료되었습니다. 다음 단계로 진행하세요!'
                    : '✅ You are logged in. Continue to the next step!'}
                </p>
              </div>
            ) : (
              <div className="card p-6 border-2 border-[var(--color-primary)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                    0
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    {isKorean ? '먼저 로그인하기' : 'Login First'}
                  </h2>
                  <span className="px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs rounded-full">
                    {isKorean ? '중요' : 'Important'}
                  </span>
                </div>
                <p className="text-[var(--color-text-secondary)] mb-4">
                  {isKorean 
                    ? '⚠️ 앱 설치 전에 먼저 로그인해주세요! 로그인하지 않으면 공유 시 다시 해야 할 수 있어요.'
                    : '⚠️ Please login before installing the app! Otherwise, you may need to share again.'}
                </p>
                <Link
                  href="/login?redirect=/guide"
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isKorean ? '로그인하기' : 'Login'}
                </Link>
              </div>
            )}

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {isKorean ? '앱 설치하기' : 'Install App'}
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                {isKorean 
                  ? 'Chrome에서 ThreadClip 사이트에 접속한 후, 메뉴에서 "홈 화면에 추가"를 선택하세요.'
                  : 'Visit the ThreadClip site in Chrome, then select "Add to Home Screen" from the menu.'}
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">{isKorean ? '스크린샷 준비중' : 'Screenshot coming soon'}</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {isKorean ? 'Threads에서 공유하기' : 'Share from Threads'}
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                {isKorean 
                  ? '저장하고 싶은 게시물에서 공유 버튼을 누르세요.'
                  : 'Tap the share button on the post you want to save.'}
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">{isKorean ? '스크린샷 준비중' : 'Screenshot coming soon'}</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {isKorean ? 'ThreadClip 선택' : 'Select ThreadClip'}
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                {isKorean 
                  ? '공유 목록에서 "ThreadClip"을 선택하세요.'
                  : 'Select "ThreadClip" from the share list.'}
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">{isKorean ? '스크린샷 준비중' : 'Screenshot coming soon'}</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  4
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  {isKorean ? '메모 입력 후 저장' : 'Add Note and Save'}
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                {isKorean 
                  ? '메모를 입력하고 저장 버튼을 누르세요.'
                  : 'Enter a note and tap the save button.'}
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">{isKorean ? '스크린샷 준비중' : 'Screenshot coming soon'}</p>
              </div>
            </div>

            <div className="card p-4 bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30">
              <p className="text-sm text-[var(--color-text)]">
                {isKorean 
                  ? '💡 팁: Android에서는 공유 시 ThreadClip이 바로 목록에 나타납니다!'
                  : '💡 Tip: On Android, ThreadClip appears directly in the share list!'}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href={isLoggedIn ? "/" : "/login"} className="btn btn-primary">
            {isLoggedIn 
              ? (isKorean ? '홈으로 가기' : 'Go to Home')
              : (isKorean ? '시작하기' : 'Get Started')}
          </Link>
        </div>
      </main>
    </div>
  );
}
