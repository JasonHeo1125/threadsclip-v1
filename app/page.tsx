'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/lib/i18n';
import { Header } from '@/components/ui/Header';
import { SearchBar } from '@/components/ui/SearchBar';
import { ThreadCard } from '@/components/thread/ThreadCard';
import { SaveThreadModal } from '@/components/thread/SaveThreadModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ThreadListSkeleton } from '@/components/ui/Loading';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { STORAGE_LIMITS } from '@/lib/constants';
import type { SavedThread, Tag } from '@/types/database';

type ThreadWithTags = SavedThread & { tags: Tag[] };
type SortOrder = 'newest' | 'oldest';

const ITEMS_PER_PAGE = 10;

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();
  const [threads, setThreads] = useState<ThreadWithTags[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLimitPopupOpen, setIsLimitPopupOpen] = useState(false);
  const offsetRef = useRef(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const redirectPath = localStorage.getItem('loginRedirect');
    if (redirectPath) {
      localStorage.removeItem('loginRedirect');
      router.replace(redirectPath);
    }
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchThreads = useCallback(async (reset = true) => {
    try {
      if (reset) {
        setIsLoading(true);
        offsetRef.current = 0;
      } else {
        setIsLoadingMore(true);
      }

      const params = new URLSearchParams({
        limit: ITEMS_PER_PAGE.toString(),
        offset: offsetRef.current.toString(),
        sortOrder,
      });

      if (debouncedSearch) {
        params.set('search', debouncedSearch);
      }
      if (selectedTagId) {
        params.set('tagId', selectedTagId);
      }

      const response = await fetch(`/api/threads?${params}`);
      const { data, total: totalCount, hasMore: more } = await response.json();

      if (reset) {
        setThreads(data || []);
      } else {
        setThreads(prev => [...prev, ...(data || [])]);
      }
      
      setTotal(totalCount || 0);
      setHasMore(more || false);
      offsetRef.current += ITEMS_PER_PAGE;
    } catch (error) {
      console.error('Failed to fetch threads:', error);
      showToast(t.common.error, 'error');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [debouncedSearch, selectedTagId, sortOrder, t.common.error]);

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch('/api/tags');
      const { data } = await response.json();
      setAllTags(data || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    fetchThreads(true);
  }, [debouncedSearch, selectedTagId, sortOrder, fetchThreads]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          fetchThreads(false);
        }
      },
      { rootMargin: '300px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading, fetchThreads]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchThreads(false);
    }
  };

  const handleSaveThread = async (url: string, memo: string, tagIds: string[] = []) => {
    try {
      console.log('[Client] Saving thread:', { url, memo, tagIds });
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, memo, tagIds }),
      });

      console.log('[Client] Response status:', response.status, response.statusText);
      const result = await response.json();
      console.log('[Client] Response body:', result);

      if (!response.ok) {
        if (response.status === 409) {
          showToast(t.thread.alreadySaved, 'info');
          return;
        }
        if (response.status === 429) {
          showToast(t.thread.maxReached, 'error');
          return;
        }
        if (response.status === 400 && result.error?.includes('Invalid or inaccessible')) {
          showToast(t.thread.invalidOrInaccessible, 'error');
          return;
        }
        console.error('[Client] Save failed with error:', result.error);
        throw new Error(result.error);
      }

      console.log('[Client] Save successful');
      showToast(t.thread.saved, 'success');
      fetchThreads(true);
      fetchTags();
    } catch (error) {
      console.error('[Client] Save exception:', error);
      throw new Error('Save failed');
    }
  };

  const handleDeleteThread = async (id: string) => {
    if (!confirm(t.thread.deleteConfirm)) return;

    try {
      const response = await fetch(`/api/threads?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setThreads((prev) => prev.filter((thread) => thread.id !== id));
      setTotal((prev) => prev - 1);
      showToast(t.common.success, 'success');
    } catch {
      showToast(t.common.error, 'error');
    }
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  const handleTagFilter = (tagId: string | null) => {
    setSelectedTagId(tagId);
    setIsFilterOpen(false);
  };

  const getSelectedTagName = () => {
    if (!selectedTagId) return null;
    return allTags.find(tag => tag.id === selectedTagId)?.name;
  };

  const getStorageCountColor = () => {
    const remaining = STORAGE_LIMITS.FREE_TIER - total;
    if (remaining <= STORAGE_LIMITS.DANGER_THRESHOLD) {
      return 'text-red-500';
    }
    if (remaining <= STORAGE_LIMITS.WARNING_THRESHOLD) {
      return 'text-yellow-500';
    }
    return 'text-[var(--color-text-muted)]';
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header user={session?.user} onAddClick={() => setIsModalOpen(true)} />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={() => {}}
          />
        </div>

        <div className="flex items-center justify-between mb-4 relative">
          <div className="relative">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t.home.title}
              <button
                onClick={() => setIsLimitPopupOpen(true)}
                className={`ml-2 text-sm font-normal ${getStorageCountColor()} hover:underline cursor-pointer`}
              >
                ({total}/{STORAGE_LIMITS.FREE_TIER})
              </button>
            </h2>

            {isLimitPopupOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsLimitPopupOpen(false)}
                />
                <div className="absolute left-0 top-full mt-2 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-20 p-4 w-64">
                  <p className="text-sm text-[var(--color-text)]">
                    무료 티어는 현재 <strong>{STORAGE_LIMITS.FREE_TIER}개</strong>까지 저장 가능합니다.
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-2">
                    더 많은 저장 공간이 필요하시면 프로 플랜을 이용해주세요.
                  </p>
                  <button
                    onClick={() => setIsLimitPopupOpen(false)}
                    className="mt-3 text-xs text-[var(--color-primary)] hover:underline"
                  >
                    닫기
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSortChange}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              {sortOrder === 'newest' ? '최신순' : '오래된순'}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedTagId
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {selectedTagId ? getSelectedTagName() : '필터'}
              </button>

              {isFilterOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => handleTagFilter(null)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-bg-elevated)] transition-colors ${
                        !selectedTagId ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-text)]'
                      }`}
                    >
                      전체
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => handleTagFilter(tag.id)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-bg-elevated)] transition-colors ${
                          selectedTagId === tag.id ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-text)]'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                    {allTags.length === 0 && (
                      <p className="px-4 py-2 text-sm text-[var(--color-text-muted)]">
                        카테고리 없음
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <ThreadListSkeleton count={3} />
        ) : threads.length === 0 ? (
          <EmptyState
            icon={searchQuery ? 'search' : 'bookmark'}
            title={searchQuery ? t.home.noResults : undefined}
            subtitle={searchQuery ? t.home.noResultsSubtitle : undefined}
            action={
              !searchQuery && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t.home.addNew}
                </button>
              )
            }
          />
        ) : (
          <>
            <div className="space-y-4">
              {threads.map((thread, index) => (
                <div
                  key={thread.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ThreadCard
                    thread={thread}
                    onDelete={handleDeleteThread}
                  />
                </div>
              ))}
            </div>
            
            <div ref={loadMoreRef} className="mt-6 flex justify-center py-4">
              {isLoadingMore && (
                <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">로딩 중...</span>
                </div>
              )}
              {!hasMore && threads.length > 0 && (
                <p className="text-sm text-[var(--color-text-muted)]">
                  모든 쓰레드를 불러왔습니다
                </p>
              )}
            </div>
          </>
        )}
      </main>

      <SaveThreadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveThread}
      />

      <ToastContainer />
    </div>
  );
}
