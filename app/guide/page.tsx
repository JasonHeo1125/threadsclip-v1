'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';

type Platform = 'ios' | 'android';

export default function GuidePage() {
  const { t } = useTranslation();
  const [platform, setPlatform] = useState<Platform>('ios');

  const SHORTCUT_URL = 'https://www.icloud.com/shortcuts/8e84b75970404140964e6ccb9a344a75';

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-40 bg-[var(--color-bg)]/80 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[var(--color-text)]">돌아가기</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            사용 가이드
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Threads 게시물을 빠르게 저장하는 방법
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
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  단축어 추가하기
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                아래 버튼을 눌러 ThreadClip 단축어를 추가하세요.
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
                단축어 추가하기
              </a>
              <div className="mt-4 p-3 bg-[var(--color-bg-elevated)] rounded-lg">
                <p className="text-xs text-[var(--color-text-muted)]">
                  💡 단축어 앱이 열리면 "단축어 추가" 버튼을 눌러주세요
                </p>
              </div>
              <div className="mt-4 aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">스크린샷 준비중</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Threads에서 공유하기
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                저장하고 싶은 게시물에서 공유 버튼을 누르세요.
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">스크린샷 준비중</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  ThreadClip 단축어 선택
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                공유 시트에서 "Thread clip" 단축어를 선택하세요.
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">스크린샷 준비중</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  4
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  메모 입력 후 저장
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Safari가 열리면 메모를 입력하고 저장 버튼을 누르세요.
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">스크린샷 준비중</p>
              </div>
            </div>

            <div className="card p-4 bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30">
              <p className="text-sm text-[var(--color-text)]">
                💡 <strong>팁:</strong> 처음 사용 시 로그인이 필요합니다. 한번 로그인하면 이후에는 바로 저장할 수 있어요!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  앱 설치하기
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                Chrome에서 ThreadClip 사이트에 접속한 후, 메뉴에서 "홈 화면에 추가"를 선택하세요.
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">스크린샷 준비중</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  Threads에서 공유하기
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                저장하고 싶은 게시물에서 공유 버튼을 누르세요.
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">스크린샷 준비중</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  ThreadClip 선택
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                공유 목록에서 "ThreadClip"을 선택하세요.
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">스크린샷 준비중</p>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">
                  4
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                  메모 입력 후 저장
                </h2>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">
                메모를 입력하고 저장 버튼을 누르세요.
              </p>
              <div className="aspect-[9/16] bg-[var(--color-bg-elevated)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--color-text-muted)] text-sm">스크린샷 준비중</p>
              </div>
            </div>

            <div className="card p-4 bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30">
              <p className="text-sm text-[var(--color-text)]">
                💡 <strong>팁:</strong> Android에서는 공유 시 ThreadClip이 바로 목록에 나타납니다!
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="btn btn-primary">
            시작하기
          </Link>
        </div>
      </main>
    </div>
  );
}
