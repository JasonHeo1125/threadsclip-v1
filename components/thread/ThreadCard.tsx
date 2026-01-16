'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { SavedThread, Tag } from '@/types/database';

interface ThreadCardProps {
  thread: SavedThread & { tags?: Tag[] };
  onDelete: (id: string) => void;
  onTagClick?: (tag: Tag) => void;
}

function getEmbedUrl(originalUrl: string): string {
  const url = new URL(originalUrl);
  const cleanPath = url.pathname.replace(/\/$/, '');
  return `https://www.threads.net${cleanPath}/embed`;
}

export function ThreadCard({ thread, onDelete, onTagClick }: ThreadCardProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const displayName = thread.author_name || (thread.author_username ? `@${thread.author_username}` : 'Threads');

  return (
    <article className="card group overflow-hidden">
      <div className="flex items-center justify-between gap-2 p-4 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-[var(--color-text)] truncate block">
              {displayName}
            </span>
            <time className="text-xs text-[var(--color-text-muted)]">
              {formatDate(thread.created_at)}
            </time>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-icon btn-ghost"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <a
            href={thread.original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-icon btn-ghost"
            title={t.home.viewOriginal}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button
            onClick={() => onDelete(thread.id)}
            className="btn btn-icon btn-ghost text-[var(--color-error)] hover:bg-red-50 dark:hover:bg-red-950"
            title={t.common.delete}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="relative bg-[var(--color-bg-elevated)]">
          {!embedLoaded && !embedError && (
            <div className="absolute inset-0 flex items-center justify-center min-h-[200px]">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
            </div>
          )}
          {embedError ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center min-h-[200px]">
              <svg className="w-12 h-12 text-[var(--color-text-muted)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-[var(--color-text-muted)] mb-2">콘텐츠를 불러올 수 없습니다</p>
              <a
                href={thread.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                원본 보기
              </a>
            </div>
          ) : (
            <iframe
              src={getEmbedUrl(thread.original_url)}
              className={`w-full border-0 transition-opacity ${embedLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ minHeight: '400px', maxHeight: '600px' }}
              onLoad={() => setEmbedLoaded(true)}
              onError={() => setEmbedError(true)}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          )}
        </div>
      )}

      {!isExpanded && (
        <div 
          className="px-4 py-3 cursor-pointer hover:bg-[var(--color-bg-elevated)] transition-colors"
          onClick={() => setIsExpanded(true)}
        >
          <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
            {thread.content_snippet || '클릭하여 게시물 보기'}
          </p>
        </div>
      )}

      {thread.tags && thread.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 px-4 pb-3">
          {thread.tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onTagClick?.(tag)}
              className="tag"
              style={{ 
                backgroundColor: `${tag.color}20`,
                color: tag.color,
              }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
