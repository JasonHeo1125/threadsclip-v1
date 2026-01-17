'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { Header } from '@/components/ui/Header';
import { SearchBar } from '@/components/ui/SearchBar';
import { ThreadCard } from '@/components/thread/ThreadCard';
import { SaveThreadModal } from '@/components/thread/SaveThreadModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ThreadListSkeleton } from '@/components/ui/Loading';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { createClient } from '@/lib/supabase/client';
import type { SavedThread, Tag, Profile } from '@/types/database';

type ThreadWithTags = SavedThread & { tags: Tag[] };
type SortOrder = 'newest' | 'oldest';

const ITEMS_PER_PAGE = 10;

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [threads, setThreads] = useState<ThreadWithTags[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const offsetRef = useRef(0);
  const supabase = createClient();

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

  const fetchProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProfile();
    fetchTags();
  }, [fetchProfile, fetchTags]);

  useEffect(() => {
    fetchThreads(true);
  }, [debouncedSearch, selectedTagId, sortOrder, fetchThreads]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchThreads(false);
    }
  };

  const handleSaveThread = async (url: string, memo: string, tagIds: string[] = []) => {
    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, memo, tagIds }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          showToast(t.thread.alreadySaved, 'info');
          return;
        }
        if (response.status === 429) {
          showToast(t.thread.maxReached, 'error');
          return;
        }
        throw new Error(result.error);
      }

      showToast(t.thread.saved, 'success');
      fetchThreads(true);
      fetchTags();
    } catch {
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

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header user={profile} onAddClick={() => setIsModalOpen(true)} />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={() => {}}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            {t.home.title}
            {total > 0 && (
              <span className="ml-2 text-sm font-normal text-[var(--color-text-muted)]">
                ({total})
              </span>
            )}
          </h2>

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
            title={searchQuery ? t.common.error : undefined}
            subtitle={searchQuery ? undefined : undefined}
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
            
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-6 py-2 text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border)] rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      로딩 중...
                    </div>
                  ) : (
                    `더 보기`
                  )}
                </button>
              </div>
            )}
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
