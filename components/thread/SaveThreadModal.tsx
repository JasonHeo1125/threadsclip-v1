'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { showToast } from '@/components/ui/Toast';
import type { Tag } from '@/types/database';

interface SaveThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string, memo: string, tagIds: string[]) => Promise<void>;
}

const LAST_TAGS_KEY = 'threadclip_last_tags';

export function SaveThreadModal({ isOpen, onClose, onSave }: SaveThreadModalProps) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [memo, setMemo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTags();
      const savedTags = localStorage.getItem(LAST_TAGS_KEY);
      if (savedTags) {
        try {
          setSelectedTagIds(JSON.parse(savedTags));
        } catch {
          setSelectedTagIds([]);
        }
      }
    }
  }, [isOpen]);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const { data } = await response.json();
      setTags(data || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) return;

    if (!url.includes('threads.net') && !url.includes('threads.com')) {
      showToast(t.thread.invalidUrl, 'error');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(url.trim(), memo.trim(), selectedTagIds);
      localStorage.setItem(LAST_TAGS_KEY, JSON.stringify(selectedTagIds));
      setUrl('');
      setMemo('');
      onClose();
    } catch {
      showToast(t.common.error, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setMemo('');
    setNewTagName('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-md card p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--color-text)]">
            {t.thread.saveTitle}
          </h2>
          <button
            onClick={handleClose}
            className="btn btn-icon btn-ghost"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              {t.thread.urlLabel || 'Threads URL'}
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t.thread.urlPlaceholder}
              className="input"
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              {t.thread.memoLabel || '메모 (검색용)'}
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder={t.thread.memoPlaceholder || '이 게시물에 대한 메모를 입력하세요. 나중에 검색할 때 사용됩니다.'}
              className="input min-h-[100px] resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              {t.thread.memoHint || '💡 키워드, 요약, 기억하고 싶은 내용 등을 입력하세요'}
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
                  disabled={isLoading}
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
                disabled={isLoading || isAddingTag}
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
                disabled={isLoading || isAddingTag || !newTagName.trim()}
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
              type="button"
              onClick={handleClose}
              className="btn btn-secondary flex-1"
              disabled={isLoading}
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t.thread.saving}
                </>
              ) : (
                t.common.save
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
