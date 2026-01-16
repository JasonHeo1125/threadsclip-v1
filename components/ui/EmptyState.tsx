'use client';

import { useTranslation } from '@/lib/i18n';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: 'bookmark' | 'search' | 'tag';
}

export function EmptyState({ title, subtitle, action, icon = 'bookmark' }: EmptyStateProps) {
  const { t } = useTranslation();

  const icons = {
    bookmark: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
    search: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    tag: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="text-[var(--color-text-muted)] mb-6 opacity-50">
        {icons[icon]}
      </div>
      <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
        {title || t.home.empty}
      </h3>
      <p className="text-[var(--color-text-muted)] max-w-sm mb-6">
        {subtitle || t.home.emptySubtitle}
      </p>
      {action}
    </div>
  );
}
