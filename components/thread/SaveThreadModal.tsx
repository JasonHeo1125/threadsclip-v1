'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { showToast } from '@/components/ui/Toast';

interface SaveThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string, memo: string) => Promise<void>;
}

export function SaveThreadModal({ isOpen, onClose, onSave }: SaveThreadModalProps) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [memo, setMemo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      await onSave(url.trim(), memo.trim());
      setUrl('');
      setMemo('');
      onClose();
    } catch {
      showToast(t.common.error, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md card p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--color-text)]">
            {t.thread.saveTitle}
          </h2>
          <button
            onClick={onClose}
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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
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
