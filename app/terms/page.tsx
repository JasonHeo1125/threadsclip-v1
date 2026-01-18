'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function TermsPage() {
  const { language } = useTranslation();
  const isKorean = language === 'ko';

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
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

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">
          {isKorean ? '이용약관' : 'Terms of Service'}
        </h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-[var(--color-text-secondary)]">
          <p className="text-sm text-[var(--color-text-muted)]">
            {isKorean ? '최종 수정일: 2025년 1월 16일' : 'Last updated: January 16, 2025'}
          </p>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              {isKorean ? '1. 서비스 소개' : '1. Service Introduction'}
            </h2>
            <p>
              {isKorean 
                ? 'ThreadClip은 Threads 게시물을 저장하고 검색할 수 있는 웹 서비스입니다. 본 서비스는 개인적인 아카이빙 목적으로 제공됩니다.'
                : 'ThreadClip is a web service that allows you to save and search Threads posts. This service is provided for personal archiving purposes.'}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              {isKorean ? '2. 이용 조건' : '2. Terms of Use'}
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                {isKorean 
                  ? '서비스 이용을 위해 Google 계정으로 로그인해야 합니다.'
                  : 'You must log in with a Google account to use the service.'}
              </li>
              <li>
                {isKorean 
                  ? '저장할 수 있는 게시물 수는 계정당 1000개로 제한됩니다.'
                  : 'The number of posts you can save is limited to 1000 per account.'}
              </li>
              <li>
                {isKorean 
                  ? '타인의 권리를 침해하는 용도로 사용할 수 없습니다.'
                  : 'You may not use this service to infringe on the rights of others.'}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              {isKorean ? '3. 면책 조항' : '3. Disclaimer'}
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                {isKorean 
                  ? '저장된 게시물이 원본에서 삭제되면 서비스에서도 정상적으로 표시되지 않을 수 있습니다.'
                  : 'If a saved post is deleted from the original source, it may not display properly in the service.'}
              </li>
              <li>
                {isKorean 
                  ? '서비스는 "있는 그대로" 제공되며, 특정 목적에 대한 적합성을 보장하지 않습니다.'
                  : 'The service is provided "as is" and does not guarantee fitness for a particular purpose.'}
              </li>
              <li>
                {isKorean 
                  ? '서비스 중단 또는 데이터 손실에 대해 책임지지 않습니다.'
                  : 'We are not responsible for service interruption or data loss.'}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              {isKorean ? '4. 지적재산권' : '4. Intellectual Property'}
            </h2>
            <p>
              {isKorean 
                ? '저장된 Threads 게시물의 저작권은 원 작성자에게 있습니다. ThreadClip은 게시물의 URL과 사용자 메모만 저장하며, 게시물 콘텐츠 자체는 Threads 플랫폼에서 제공됩니다.'
                : 'The copyright of saved Threads posts belongs to the original author. ThreadClip only stores the URL and user notes, and the post content itself is provided by the Threads platform.'}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              {isKorean ? '5. 계정 삭제' : '5. Account Deletion'}
            </h2>
            <p>
              {isKorean 
                ? <>언제든지 계정과 저장된 데이터를 삭제할 수 있습니다. 삭제 요청은 <Link href="/data-deletion" className="text-[var(--color-primary)] underline">데이터 삭제 페이지</Link>에서 할 수 있습니다.</>
                : <>You can delete your account and saved data at any time. You can request deletion on the <Link href="/data-deletion" className="text-[var(--color-primary)] underline">Data Deletion page</Link>.</>}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              {isKorean ? '6. 약관 변경' : '6. Changes to Terms'}
            </h2>
            <p>
              {isKorean 
                ? '본 약관은 서비스 개선을 위해 변경될 수 있으며, 변경 시 서비스 내 공지를 통해 안내드립니다.'
                : 'These terms may be changed to improve the service, and changes will be announced through in-service notifications.'}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
              {isKorean ? '7. 문의' : '7. Contact'}
            </h2>
            <p>
              {isKorean 
                ? <>서비스 관련 문의사항은 <a href="mailto:jasonheoai@gmail.com" className="text-[var(--color-primary)] underline">jasonheoai@gmail.com</a>으로 연락해주세요.</>
                : <>For service-related inquiries, please contact us at <a href="mailto:jasonheoai@gmail.com" className="text-[var(--color-primary)] underline">jasonheoai@gmail.com</a>.</>}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
