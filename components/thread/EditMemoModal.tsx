'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

interface EditMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memo: string) => Promise<void>;
  initialMemo: string;
}

export function EditMemoModal({ isOpen, onClose, onSave, initialMemo }: EditMemoModalProps) {
  const { t } = useTranslation();
  const [memo, setMemo] = useState(initialMemo);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMemo(initialMemo || '');
      setError('');
    }
  }, [isOpen, initialMemo]);

  const handleSave = async () => {
    if (memo.length > 1000) {
      setError('메모는 1000자를 초과할 수 없습니다.');
      return;
    }

    try {
      setIsSaving(true);
      await onSave(memo.trim());
      onClose();
    } catch (err) {
      console.error(err);
      setError(t.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-[var(--color-bg-card)] rounded-2xl shadow-xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">
          메모 수정
        </h3>

        <div className="mb-4">
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모를 입력하세요..."
            className="input min-h-[150px] resize-none"
            autoFocus
            maxLength={1000}
          />
          <div className="flex justify-between mt-2">
            {error ? (
              <p className="text-xs text-red-500">{error}</p>
            ) : (
              <span />
            )}
            <p className={`text-xs ${memo.length > 1000 ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`}>
              {memo.length}/1000
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="btn btn-ghost"
            disabled={isSaving}
          >
            {t.common.cancel}
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={isSaving || memo.length > 1000}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              t.common.save
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
