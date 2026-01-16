'use client';

import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';

export default function DataDeletionPage() {
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
          {isKorean ? '데이터 삭제 안내' : 'Data Deletion Instructions'}
        </h1>
        
        <p className="text-[var(--color-text-secondary)] mb-6">
          {isKorean 
            ? 'ThreadClip은 귀하의 개인정보를 존중하며, 데이터를 삭제할 수 있는 여러 방법을 제공합니다.'
            : 'ThreadClip respects your privacy and provides multiple ways to delete your data.'}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            {isKorean ? '개별 게시물 삭제' : 'Delete Individual Posts'}
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            {isKorean 
              ? '앱에서 직접 저장된 Threads 게시물을 삭제할 수 있습니다:'
              : 'You can delete any saved Threads post directly from the app:'}
          </p>
          <ol className="list-decimal list-inside text-[var(--color-text-secondary)] space-y-2">
            <li>{isKorean ? 'ThreadClip 계정에 로그인하세요' : 'Log in to your ThreadClip account'}</li>
            <li>{isKorean ? '삭제하려는 게시물을 찾으세요' : 'Find the post you want to delete'}</li>
            <li>{isKorean ? '게시물 카드의 휴지통 아이콘을 클릭하세요' : 'Click the trash icon on the post card'}</li>
            <li>{isKorean ? '게시물이 영구적으로 삭제됩니다' : 'The post will be permanently deleted'}</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            {isKorean ? '모든 데이터 / 계정 삭제' : 'Delete All Data / Account'}
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            {isKorean 
              ? '계정과 모든 관련 데이터의 완전한 삭제를 요청하려면:'
              : 'To request complete deletion of your account and all associated data:'}
          </p>
          <ol className="list-decimal list-inside text-[var(--color-text-secondary)] space-y-2">
            <li>
              {isKorean ? '다음 이메일로 연락하세요: ' : 'Send an email to '}
              <a href="mailto:jasonheoai@gmail.com" className="text-[var(--color-primary)] hover:underline">jasonheoai@gmail.com</a>
            </li>
            <li>{isKorean ? '제목에 "데이터 삭제 요청"을 포함하세요' : 'Include "Data Deletion Request" in the subject line'}</li>
            <li>{isKorean ? '계정과 연결된 이메일 주소를 알려주세요' : 'Provide the email address associated with your account'}</li>
            <li>{isKorean ? '30일 이내에 요청을 처리해 드립니다' : 'We will process your request within 30 days'}</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            {isKorean ? '삭제되는 데이터' : 'What Data Will Be Deleted'}
          </h2>
          <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
            <li>{isKorean ? '계정 정보' : 'Your account information'}</li>
            <li>{isKorean ? '저장된 모든 Threads 게시물' : 'All saved Threads posts'}</li>
            <li>{isKorean ? '모든 태그 및 메모' : 'All tags and notes'}</li>
            <li>{isKorean ? '인증 토큰' : 'Authentication tokens'}</li>
          </ul>
        </section>

        <p className="text-[var(--color-text-muted)] text-sm">
          {isKorean 
            ? '참고: 삭제는 영구적이며 되돌릴 수 없습니다.'
            : 'Note: Deletion is permanent and cannot be undone.'}
        </p>
      </article>
    </main>
  );
}
