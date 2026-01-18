'use client';

import { Suspense } from 'react';
import { useTranslation } from '@/lib/i18n';
import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function getBrowserInfo() {
  if (typeof window === 'undefined') return { isInApp: false, platform: 'unknown', os: 'unknown' };
  
  const ua = window.navigator.userAgent.toLowerCase();
  
  // OS 감지
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const os = isIOS ? 'ios' : isAndroid ? 'android' : 'unknown';
  
  // 앱 감지
  if (ua.includes('instagram') || ua.includes('fban') || ua.includes('fbav')) {
    return { isInApp: true, platform: 'instagram', os };
  }
  
  if (ua.includes('kakaotalk')) {
    return { isInApp: true, platform: 'kakaotalk', os };
  }
  
  if (ua.includes('line/')) {
    return { isInApp: true, platform: 'line', os };
  }
  
  if (ua.includes('barcelona')) {
    return { isInApp: true, platform: 'threads', os };
  }
  
  if (ua.includes('mobile') && !ua.includes('safari') && ua.includes('webkit')) {
    return { isInApp: true, platform: 'threads', os };
  }
  
  return { isInApp: false, platform: 'unknown', os };
}

function LoginContent() {
  const { t, language, setLanguage } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<{ isInApp: boolean; platform: string; os: string }>({ isInApp: false, platform: 'unknown', os: 'unknown' });
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      localStorage.setItem('loginRedirect', redirect);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    const info = getBrowserInfo();
    setBrowserInfo(info);
  }, []);

  const openInExternalBrowser = async () => {
    const currentUrl = window.location.href;
    
    try {
      await navigator.clipboard.writeText(currentUrl);
      
      if (navigator.userAgent.includes('Android')) {
        const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
        window.location.href = intentUrl;
        
        setTimeout(() => {
          alert(language === 'ko' 
            ? '외부 브라우저가 열리지 않으면:\n1. Chrome/Samsung Internet 앱 열기\n2. 주소창에 붙여넣기 (URL 복사됨)\n3. 접속하기'
            : 'If browser does not open:\n1. Open Chrome/Samsung Internet\n2. Paste in address bar (URL copied)\n3. Visit');
        }, 1000);
      } else {
        const opened = window.open(currentUrl, '_blank');
        
        if (!opened || opened.closed || typeof opened.closed === 'undefined') {
          alert(language === 'ko'
            ? '📋 URL이 복사되었습니다!\n\n1. Safari 앱 열기\n2. 주소창 길게 누르기\n3. "붙여넣고 이동" 선택'
            : '📋 URL copied!\n\n1. Open Safari app\n2. Long press address bar\n3. Select "Paste and Go"');
        }
      }
    } catch (error) {
      alert(language === 'ko'
        ? `URL: ${currentUrl}\n\n1. 위 URL 복사하기\n2. Safari/Chrome 앱 열기\n3. 주소창에 붙여넣기`
        : `URL: ${currentUrl}\n\n1. Copy the URL above\n2. Open Safari/Chrome\n3. Paste in address bar`);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('kakao', { callbackUrl: '/' });
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  const getInAppWarningContent = () => {
    const { platform, os } = browserInfo;
    const browserName = os === 'ios' ? 'Safari' : 'Chrome';
    const browserNameKo = os === 'ios' ? 'Safari' : 'Chrome';

    if (platform === 'threads' || platform === 'instagram') {
      const appName = platform === 'threads' ? 'Threads' : 'Instagram';
      const appNameKo = platform === 'threads' ? 'Threads' : '인스타그램';
      
      return {
        title: language === 'ko' ? `${appNameKo} 앱 내 브라우저 감지` : `${appName} In-App Browser Detected`,
        showFixedPointer: true,
        pointerPosition: 'top-right',
        description: language === 'ko' 
          ? (
            <div className="space-y-3">
              <p className="text-sm text-[var(--color-text-secondary)] text-center">
                로그인이 제대로 작동하지 않을 수 있습니다.
              </p>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{browserNameKo}에서 접속하기</span>
                </div>
                <ol className="text-sm text-[var(--color-text-secondary)] space-y-2 pl-1">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-400 flex-shrink-0">1.</span>
                    <span>화면 <strong className="text-purple-400">오른쪽 위 가로 점 3개(⋯)</strong> 탭</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-400 flex-shrink-0">2.</span>
                    <span><strong className="text-purple-400">"외부 브라우저에서 열기"</strong> 선택</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-400 flex-shrink-0">3.</span>
                    <span>{browserNameKo}에서 다시 로그인</span>
                  </li>
                </ol>
              </div>
            </div>
          ) 
          : (
            <div className="space-y-3">
              <p className="text-sm text-[var(--color-text-secondary)] text-center">
                Login may not work properly.
              </p>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Access via {browserName}</span>
                </div>
                <ol className="text-sm text-[var(--color-text-secondary)] space-y-2 pl-1">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-400 flex-shrink-0">1.</span>
                    <span>Tap <strong className="text-purple-400">three horizontal dots (⋯)</strong> at top right</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-400 flex-shrink-0">2.</span>
                    <span>Select <strong className="text-purple-400">"Open in Browser"</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-400 flex-shrink-0">3.</span>
                    <span>Login again in {browserName}</span>
                  </li>
                </ol>
              </div>
            </div>
          ),
      };
    }

    if (platform === 'kakaotalk') {
      // 카카오톡은 iOS/Android에서 UI가 다름
      const isIOS = os === 'ios';
      
      return {
        title: language === 'ko' ? '카카오톡 앱 내 브라우저 감지' : 'KakaoTalk In-App Browser Detected',
        showFixedPointer: isIOS, // Android는 UI가 다양해서 포인터 비활성화
        pointerPosition: 'bottom-right',
        description: language === 'ko' 
          ? (
            <div className="space-y-3">
              <p className="text-sm text-[var(--color-text-secondary)] text-center">
                로그인이 제대로 작동하지 않을 수 있습니다.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{browserNameKo}에서 접속하기</span>
                </div>
                {isIOS ? (
                  <ol className="text-sm text-[var(--color-text-secondary)] space-y-2 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-300 flex-shrink-0">1.</span>
                      <span>화면 <strong className="text-amber-300">오른쪽 하단 공유 버튼(↑)</strong> 탭</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-300 flex-shrink-0">2.</span>
                      <span><strong className="text-amber-300">"Safari로 열기"</strong> 선택</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-300 flex-shrink-0">3.</span>
                      <span>Safari에서 다시 로그인</span>
                    </li>
                  </ol>
                ) : (
                  <ol className="text-sm text-[var(--color-text-secondary)] space-y-2 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-300 flex-shrink-0">1.</span>
                      <span>화면 <strong className="text-amber-300">오른쪽 위 점 3개(⋮)</strong> 탭</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-300 flex-shrink-0">2.</span>
                      <span><strong className="text-amber-300">"다른 브라우저로 열기"</strong> 선택</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-300 flex-shrink-0">3.</span>
                      <span>Chrome에서 다시 로그인</span>
                    </li>
                  </ol>
                )}
              </div>
            </div>
          ) 
          : (
            <div className="space-y-3">
              <p className="text-sm text-[var(--color-text-secondary)] text-center">
                Login may not work properly.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Access via {browserName}</span>
                </div>
                {isIOS ? (
                  <ol className="text-sm text-[var(--color-text-secondary)] space-y-2 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-300 flex-shrink-0">1.</span>
                      <span>Tap <strong className="text-amber-300">share button (↑)</strong> at bottom right</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-300 flex-shrink-0">2.</span>
                      <span>Select <strong className="text-amber-300">"Open in Safari"</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-300 flex-shrink-0">3.</span>
                      <span>Login again in Safari</span>
                    </li>
                  </ol>
                ) : (
                  <ol className="text-sm text-[var(--color-text-secondary)] space-y-2 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-300 flex-shrink-0">1.</span>
                      <span>Tap <strong className="text-amber-300">three dots (⋮)</strong> at top right</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-300 flex-shrink-0">2.</span>
                      <span>Select <strong className="text-amber-300">"Open in other browser"</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-amber-300 flex-shrink-0">3.</span>
                      <span>Login again in Chrome</span>
                    </li>
                  </ol>
                )}
              </div>
            </div>
          ),
      };
    }

    return null;
  };

  const warningContent = browserInfo.isInApp ? getInAppWarningContent() : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] opacity-10" />
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-secondary)] rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      
      <button
        onClick={toggleLanguage}
        className="absolute top-6 left-6 btn btn-ghost text-sm z-[60]"
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
          
          {warningContent && (
            <>
              {warningContent.showFixedPointer && (
                <div className={`fixed z-50 ${
                  warningContent.pointerPosition === 'top-right' 
                    ? 'top-2 right-2' 
                    : 'bottom-6 right-2'
                }`}>
                  <div className="text-6xl animate-bounce">
                    {warningContent.pointerPosition === 'top-right' ? '👆' : '👇'}
                  </div>
                  <div className={`absolute ${
                    warningContent.pointerPosition === 'top-right'
                      ? 'top-0 right-0'
                      : 'bottom-0 right-0'
                  } w-3 h-3 rounded-full animate-ping ${
                    warningContent.pointerPosition === 'top-right'
                      ? 'bg-purple-500'
                      : 'bg-amber-500'
                  }`} />
                </div>
              )}
              
              <div className="mb-6 p-5 bg-gradient-to-br from-orange-500/5 to-pink-500/5 border border-orange-500/20 rounded-2xl backdrop-blur-sm">
                <div className="flex flex-col gap-3">
                  <div className="w-full">
                    <h3 className="font-bold text-base mb-3 text-center bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                      {warningContent.title}
                    </h3>
                    <div>
                      {warningContent.description}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className={`space-y-4 transition-opacity duration-300 ${
            warningContent ? 'opacity-40 pointer-events-none select-none' : ''
          }`}>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              {language === 'ko' ? '시작하기 전에' : 'Before you start'}
            </h2>
            <p className="text-[var(--color-text)] text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {language === 'ko' ? '먼저 사용법을 확인해주세요!' : 'Please check how to use first!'}
            </p>
            
            <Link
              href="/guide"
              className="btn btn-primary w-full"
              style={{ animation: 'pulseScale 2s ease-in-out infinite' }}
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
              onClick={handleKakaoLogin}
              disabled={isLoading}
              className="btn w-full text-[#191919] border-0 hover:shadow-md transition-all"
              style={{ backgroundColor: '#FEE500' }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#191919] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#191919">
                    <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.68 1.784 5.036 4.478 6.376-.176.649-.638 2.351-.731 2.714-.115.451.165.445.348.324.143-.095 2.282-1.545 3.206-2.171.551.078 1.118.118 1.699.118 5.523 0 10-3.463 10-7.691C22 6.463 17.523 3 12 3z"/>
                  </svg>
                  {language === 'ko' ? '카카오로 로그인' : 'Login with Kakao'}
                </>
              )}
            </button>

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
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
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
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
