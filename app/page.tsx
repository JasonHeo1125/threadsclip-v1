'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Header } from '@/components/ui/Header';
import { SearchBar } from '@/components/ui/SearchBar';
import { ThreadCard } from '@/components/thread/ThreadCard';
import { SaveThreadModal } from '@/components/thread/SaveThreadModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ThreadListSkeleton } from '@/components/ui/Loading';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import { AdBannerPlaceholder } from '@/components/ui/AdBanner';
import { createClient } from '@/lib/supabase/client';
import type { SavedThread, Tag, Profile } from '@/types/database';

type ThreadWithTags = SavedThread & { tags: Tag[] };

export default function HomePage() {
  const { t } = useTranslation();
  const [threads, setThreads] = useState<ThreadWithTags[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<ThreadWithTags[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const fetchThreads = useCallback(async () => {
    try {
      const response = await fetch('/api/threads');
      const { data } = await response.json();
      setThreads(data || []);
      setFilteredThreads(data || []);
    } catch (error) {
      console.error('Failed to fetch threads:', error);
      showToast(t.common.error, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [t.common.error]);

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
    fetchThreads();
  }, [fetchProfile, fetchThreads]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredThreads(threads);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = threads.filter(
      (thread) =>
        thread.memo?.toLowerCase().includes(query) ||
        thread.author_name?.toLowerCase().includes(query) ||
        thread.author_username?.toLowerCase().includes(query) ||
        thread.tags?.some((tag) => tag.name.toLowerCase().includes(query))
    );
    setFilteredThreads(filtered);
  }, [searchQuery, threads]);

  const handleSaveThread = async (url: string, memo: string) => {
    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, memo }),
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
      fetchThreads();
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
      setFilteredThreads((prev) => prev.filter((thread) => thread.id !== id));
      showToast(t.common.success, 'success');
    } catch {
      showToast(t.common.error, 'error');
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header user={profile} onAddClick={() => setIsModalOpen(true)} />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <AdBannerPlaceholder className="mb-6" />

        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            {t.home.title}
            {filteredThreads.length > 0 && (
              <span className="ml-2 text-sm font-normal text-[var(--color-text-muted)]">
                ({filteredThreads.length})
              </span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <ThreadListSkeleton count={3} />
        ) : filteredThreads.length === 0 ? (
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
          <div className="space-y-4">
            {filteredThreads.map((thread, index) => (
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
        )}

        <AdBannerPlaceholder className="mt-8" />
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
