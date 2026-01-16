import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-40 bg-[var(--color-bg)]/80 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center">
          <Link href="/login" className="flex items-center gap-2 text-[var(--color-text)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            돌아가기
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">이용약관</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-[var(--color-text-secondary)]">
          <p className="text-sm text-[var(--color-text-muted)]">최종 수정일: 2025년 1월 16일</p>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">1. 서비스 소개</h2>
            <p>
              ThreadClip은 Threads 게시물을 저장하고 검색할 수 있는 웹 서비스입니다. 
              본 서비스는 개인적인 아카이빙 목적으로 제공됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">2. 이용 조건</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>서비스 이용을 위해 Google 계정으로 로그인해야 합니다.</li>
              <li>저장할 수 있는 게시물 수는 계정당 100개로 제한됩니다.</li>
              <li>타인의 권리를 침해하는 용도로 사용할 수 없습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">3. 면책 조항</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>저장된 게시물이 원본에서 삭제되면 서비스에서도 정상적으로 표시되지 않을 수 있습니다.</li>
              <li>서비스는 &quot;있는 그대로&quot; 제공되며, 특정 목적에 대한 적합성을 보장하지 않습니다.</li>
              <li>서비스 중단 또는 데이터 손실에 대해 책임지지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">4. 지적재산권</h2>
            <p>
              저장된 Threads 게시물의 저작권은 원 작성자에게 있습니다. 
              ThreadClip은 게시물의 URL과 사용자 메모만 저장하며, 
              게시물 콘텐츠 자체는 Threads 플랫폼에서 제공됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">5. 계정 삭제</h2>
            <p>
              언제든지 계정과 저장된 데이터를 삭제할 수 있습니다. 
              삭제 요청은 <Link href="/data-deletion" className="text-[var(--color-primary)] underline">데이터 삭제 페이지</Link>에서 할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">6. 약관 변경</h2>
            <p>
              본 약관은 서비스 개선을 위해 변경될 수 있으며, 
              변경 시 서비스 내 공지를 통해 안내드립니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">7. 문의</h2>
            <p>
              서비스 관련 문의사항은 이메일로 연락해주세요.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
