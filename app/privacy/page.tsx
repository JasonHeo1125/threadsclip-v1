'use client';

import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';

export default function PrivacyPage() {
  const { language } = useTranslation();
  const isKorean = language === 'ko';

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-40 bg-[var(--color-bg)]/80 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link href="/login" className="flex items-center gap-2 text-[var(--color-text)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {isKorean ? '돌아가기' : 'Back'}
          </Link>
        </div>
      </header>

      <article className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-8">
          {isKorean ? '개인정보처리방침' : 'Privacy Policy'}
        </h1>
        
        <p className="text-[var(--color-text-secondary)] mb-6">
          {isKorean ? '최종 수정일: 2025년 1월 16일' : 'Last updated: January 16, 2025'}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            {isKorean ? '1. 수집하는 정보' : '1. Information We Collect'}
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            {isKorean ? 'ThreadClip은 다음 정보를 수집합니다:' : 'ThreadClip collects the following information:'}
          </p>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
            <li>{isKorean ? '인증을 위한 Google 계정 정보 (이메일, 이름)' : 'Google account information (email, name) for authentication'}</li>
            <li>{isKorean ? '저장하기로 선택한 Threads 게시물 URL' : 'Threads post URLs that you choose to save'}</li>
            <li>{isKorean ? '저장된 게시물에 추가한 태그 및 메모' : 'Tags and notes you add to saved posts'}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            {isKorean ? '2. 정보 이용 방법' : '2. How We Use Your Information'}
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            {isKorean ? '수집된 정보는 다음 목적으로 사용됩니다:' : 'We use the collected information to:'}
          </p>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
            <li>{isKorean ? 'ThreadClip 서비스 제공 및 유지' : 'Provide and maintain the ThreadClip service'}</li>
            <li>{isKorean ? '계정 인증' : 'Authenticate your account'}</li>
            <li>{isKorean ? '저장된 Threads 게시물 저장 및 표시' : 'Store and display your saved Threads posts'}</li>
            <li>{isKorean ? '저장된 콘텐츠에 대한 검색 기능 제공' : 'Enable search functionality across your saved content'}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            {isKorean ? '3. 데이터 저장' : '3. Data Storage'}
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            {isKorean 
              ? '귀하의 데이터는 신뢰할 수 있는 클라우드 데이터베이스 제공업체인 Supabase를 통해 안전하게 저장됩니다. 당사는 귀하의 개인정보를 제3자에게 판매, 거래 또는 공유하지 않습니다.'
              : 'Your data is securely stored using Supabase, a trusted cloud database provider. We do not sell, trade, or share your personal information with third parties.'}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            {isKorean ? '4. 데이터 삭제' : '4. Data Deletion'}
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            {isKorean 
              ? <>앱을 통해 언제든지 저장된 게시물을 삭제할 수 있습니다. 계정 삭제를 요청하려면 <Link href="/data-deletion" className="text-[var(--color-primary)] underline">데이터 삭제 페이지</Link>를 참조하세요.</>
              : <>You can delete your saved posts at any time through the app. To request complete account deletion, please visit the <Link href="/data-deletion" className="text-[var(--color-primary)] underline">Data Deletion page</Link>.</>}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            {isKorean ? '5. 제3자 서비스' : '5. Third-Party Services'}
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            {isKorean ? 'ThreadClip은 다음 제3자 서비스를 사용합니다:' : 'ThreadClip uses the following third-party services:'}
          </p>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
            <li>{isKorean ? '인증을 위한 Google OAuth' : 'Google OAuth for authentication'}</li>
            <li>{isKorean ? '게시물 미리보기를 위한 Threads 임베드' : 'Threads embed for displaying post previews'}</li>
            <li>{isKorean ? '데이터 저장을 위한 Supabase' : 'Supabase for data storage'}</li>
            <li>{isKorean ? '호스팅을 위한 Vercel' : 'Vercel for hosting'}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            {isKorean ? '6. 문의' : '6. Contact'}
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            {isKorean 
              ? <>개인정보처리방침에 대한 문의사항이 있으시면 다음으로 연락해주세요: </>
              : <>If you have any questions about this Privacy Policy, please contact us at: </>}
            <a href="mailto:jasonheoai@gmail.com" className="text-[var(--color-primary)] hover:underline">
              jasonheoai@gmail.com
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
