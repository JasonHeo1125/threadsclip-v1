'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/client';
import { showToast, ToastContainer } from '@/components/ui/Toast';
import type { Tag } from '@/types/database';

export default function CategoriesPage() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const supabase = createClient();
  
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    await fetchTags();
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const { data } = await response.json();
      setTags(data || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      showToast(t.common.error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    
    setIsAdding(true);
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName.trim() }),
      });
      
      if (response.ok) {
        const { data } = await response.json();
        setTags(prev => [...prev, data]);
        setNewTagName('');
        showToast(language === 'ko' ? '카테고리가 추가되었습니다' : 'Category added', 'success');
      } else if (response.status === 409) {
        showToast(language === 'ko' ? '이미 존재하는 카테고리입니다' : 'Category already exists', 'error');
      }
    } catch {
      showToast(t.common.error, 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const startEditing = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
    setDeleteConfirmId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleUpdate = async (tagId: string) => {
    if (!editingName.trim()) {
      cancelEditing();
      return;
    }

    try {
      const response = await fetch('/api/tags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tagId, name: editingName.trim() }),
      });

      if (response.ok) {
        const { data } = await response.json();
        setTags(prev => prev.map(tag => tag.id === tagId ? data : tag));
        showToast(language === 'ko' ? '카테고리가 수정되었습니다' : 'Category updated', 'success');
      } else if (response.status === 409) {
        showToast(language === 'ko' ? '이미 존재하는 카테고리입니다' : 'Category already exists', 'error');
      }
    } catch {
      showToast(t.common.error, 'error');
    } finally {
      cancelEditing();
    }
  };

  const handleDelete = async (tagId: string) => {
    try {
      const response = await fetch(`/api/tags?id=${tagId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTags(prev => prev.filter(tag => tag.id !== tagId));
        showToast(language === 'ko' ? '카테고리가 삭제되었습니다' : 'Category deleted', 'success');
      }
    } catch {
      showToast(t.common.error, 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-40 bg-[var(--color-bg)]/80 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 -ml-2 hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--color-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-bold text-lg text-[var(--color-text)]">
              {language === 'ko' ? '카테고리 관리' : 'Manage Categories'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="card p-4 mb-6">
          <h2 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
            {language === 'ko' ? '새 카테고리 추가' : 'Add New Category'}
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder={language === 'ko' ? '카테고리 이름...' : 'Category name...'}
              className="input flex-1"
              disabled={isAdding}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <button
              onClick={handleAddTag}
              className="btn btn-primary px-4"
              disabled={isAdding || !newTagName.trim()}
            >
              {isAdding ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="p-4 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-medium text-[var(--color-text-secondary)]">
              {language === 'ko' ? `카테고리 목록 (${tags.length}개)` : `Categories (${tags.length})`}
            </h2>
          </div>

          {tags.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-text-muted)]">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <p>{language === 'ko' ? '아직 카테고리가 없습니다' : 'No categories yet'}</p>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {tags.map(tag => (
                <li key={tag.id} className="p-4">
                  {deleteConfirmId === tag.id ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-[var(--color-error)]/10 rounded-lg border border-[var(--color-error)]/20">
                        <p className="text-sm text-[var(--color-error)] font-medium mb-1">
                          {language === 'ko' ? '정말 삭제하시겠습니까?' : 'Delete this category?'}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {language === 'ko' 
                            ? '⚠️ 이 카테고리가 지정된 모든 게시물에서 카테고리가 제거됩니다. 게시물 자체는 삭제되지 않습니다.'
                            : '⚠️ This category will be removed from all posts. Posts themselves will not be deleted.'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="btn btn-secondary flex-1"
                        >
                          {t.common.cancel}
                        </button>
                        <button
                          onClick={() => handleDelete(tag.id)}
                          className="btn flex-1 bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90"
                        >
                          {language === 'ko' ? '삭제' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ) : editingId === tag.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="input flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdate(tag.id);
                          } else if (e.key === 'Escape') {
                            cancelEditing();
                          }
                        }}
                      />
                      <button
                        onClick={() => handleUpdate(tag.id)}
                        className="btn btn-primary px-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="btn btn-secondary px-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--color-text)] font-medium">{tag.name}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditing(tag)}
                          className="p-2 hover:bg-[var(--color-bg-elevated)] rounded-lg transition-colors text-[var(--color-text-secondary)]"
                          title={language === 'ko' ? '수정' : 'Edit'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(tag.id)}
                          className="p-2 hover:bg-[var(--color-error)]/10 rounded-lg transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-error)]"
                          title={language === 'ko' ? '삭제' : 'Delete'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs text-[var(--color-text-muted)] text-center mt-6">
          {language === 'ko' 
            ? '💡 카테고리를 삭제해도 저장된 게시물은 삭제되지 않습니다'
            : '💡 Deleting a category will not delete saved posts'}
        </p>
      </main>

      <ToastContainer />
    </div>
  );
}
