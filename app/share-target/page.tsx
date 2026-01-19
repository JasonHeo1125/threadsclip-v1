'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useTranslation } from '@/lib/i18n';
import { showToast, ToastContainer } from '@/components/ui/Toast';
import type { Tag } from '@/types/database';

function ShareTargetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { data: session, status: authStatus } = useSession();
  const [threadsUrl, setThreadsUrl] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<'loading' | 'login' | 'input' | 'saving' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const LAST_TAGS_KEY = 'threadclip_last_tags';

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const { data } = await response.json();
      const tagData = data || [];
      setTags(tagData);
      return tagData;
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      return [];
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    
    setIsAddingTag(true);
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName.trim() }),
      });
      
      if (response.ok) {
        const { data } = await response.json();
        setTags(prev => [...prev, data]);
        setSelectedTagIds(prev => [...prev, data.id]);
        setNewTagName('');
      } else if (response.status === 409) {
        showToast('이미 존재하는 카테고리입니다', 'error');
      }
    } catch {
      showToast(t.common.error, 'error');
    } finally {
      setIsAddingTag(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  useEffect(() => {
    if (authStatus === 'loading') return;

    async function checkAuth() {
      if (authStatus === 'unauthenticated') {
        setStatus('login');
        return;
      }

      const availableTags = await fetchTags();
      
      const savedTags = localStorage.getItem(LAST_TAGS_KEY);
      if (savedTags) {
        try {
          const parsedTagIds: string[] = JSON.parse(savedTags);
          const validTagIds = parsedTagIds.filter(id => 
            availableTags.some((tag: Tag) => tag.id === id)
          );
          setSelectedTagIds(validTagIds);
        } catch {
          setSelectedTagIds([]);
        }
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
  }, [searchParams, router, t, authStatus]);

  async function handleLogin(provider: 'google' | 'kakao') {
    const currentUrl = window.location.href;
    localStorage.setItem('redirectAfterLogin', currentUrl);
    await signIn(provider, { callbackUrl: currentUrl });
  }

  async function handleSave() {
    if (!threadsUrl) return;
    
    setStatus('saving');
    
    try {
      console.log('[ShareTarget] Saving thread:', { url: threadsUrl, memo, tagIds: selectedTagIds });
      
      let response;
      try {
        response = await fetch('/api/threads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: threadsUrl, memo: memo.trim(), tagIds: selectedTagIds }),
        });
        console.log('[ShareTarget] Fetch completed, response received');
      } catch (fetchError) {
        console.error('[ShareTarget] Fetch failed:', fetchError);
        throw fetchError;
      }

      console.log('[ShareTarget] Response status:', response.status, response.statusText);
      
      let result;
      try {
        result = await response.json();
        console.log('[ShareTarget] JSON parsed successfully:', result);
      } catch (jsonError) {
        console.error('[ShareTarget] JSON parse failed:', jsonError);
        throw new Error('Failed to parse response');
      }
      
      console.log('[ShareTarget] Response body:', result);

      if (response.ok || response.status === 409) {
        localStorage.setItem(LAST_TAGS_KEY, JSON.stringify(selectedTagIds));
        setStatus('success');
        setMessage(t.pwa.shareTargetSuccess);
        console.log('[ShareTarget] Save marked as successful');
      } else if (response.status === 400 && result.error?.includes('Invalid or inaccessible')) {
        setStatus('error');
        setMessage(t.thread.invalidOrInaccessible);
        setTimeout(() => router.push('/'), 3000);
        console.log('[ShareTarget] Invalid URL error shown');
      } else {
        console.error('[ShareTarget] Unhandled status code:', response.status, 'Error:', result.error);
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('[ShareTarget] Save exception:', error);
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
          {/* 카카오 로그인 버튼 */}
          <button
            onClick={() => handleLogin('kakao')}
            className="btn w-full text-[#191919] border-0 hover:shadow-md transition-all mb-3"
            style={{ backgroundColor: '#FEE500' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#191919">
              <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.68 1.784 5.036 4.478 6.376-.176.649-.638 2.351-.731 2.714-.115.451.165.445.348.324.143-.095 2.282-1.545 3.206-2.171.551.078 1.118.118 1.699.118 5.523 0 10-3.463 10-7.691C22 6.463 17.523 3 12 3z"/>
            </svg>
            카카오로 로그인
          </button>

          {/* Google 로그인 버튼 */}
          <button
            onClick={() => handleLogin('google')}
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
          
          <p className="text-xs text-[var(--color-text-muted)] text-center mt-2">
            ⚠️ Google 로그인이 안 되면 외부 브라우저(Safari, Chrome)에서 열어주세요
          </p>
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
          <p className="text-xl font-medium mb-8">{message}</p>
          
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button
              onClick={() => {
                // Android: Intent URL로 Threads 앱 열기 시도
                // iOS: threads:// 스킴 또는 threads.net 자동 전환
                const userAgent = navigator.userAgent.toLowerCase();
                const isAndroid = /android/.test(userAgent);
                
                if (isAndroid && threadsUrl) {
                  // Android Intent URL - 방금 저장한 게시물 상세 화면으로 이동
                  // 예: intent://www.threads.net/@user/post/123#Intent;scheme=https;package=com.instagram.barcelona;end
                  const urlWithoutProtocol = threadsUrl.replace(/^https?:\/\//, '');
                  window.location.href = `intent://${urlWithoutProtocol}#Intent;scheme=https;package=com.instagram.barcelona;end`;
                } else {
                  // iOS 또는 URL이 없는 경우 기존 방식
                  window.location.href = threadsUrl || 'https://www.threads.net';
                }
              }}
              className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium"
            >
              Threads로 돌아가기
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-white text-[var(--color-primary)] rounded-lg hover:bg-white/90 transition-colors font-medium"
            >
              저장 목록 확인하기
            </button>
          </div>
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
      <div className="w-full max-w-md bg-[var(--color-bg-card)] rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            카테고리 (선택)
          </label>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                  selectedTagIds.includes(tag.id)
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="새 카테고리 추가..."
              className="input flex-1 !py-2 text-sm"
              disabled={isAddingTag}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn btn-secondary !py-2 !px-3"
              disabled={isAddingTag || !newTagName.trim()}
            >
              {isAddingTag ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>
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
      <ToastContainer />
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
