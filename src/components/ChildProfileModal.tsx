'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ChildProfile } from '@/types';
import ChildForm from './ChildForm';

interface Props {
  onSubmit: (profile: ChildProfile) => Promise<void>;
}

export default function ChildProfileModal({ onSubmit }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // フォーカストラップ
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="お子さまの情報を登録"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden outline-none"
      >
        <div className="px-6 pt-6 pb-2">
          <div className="text-center mb-5">
            <span className="text-3xl" aria-hidden="true">🌿</span>
            <h2 className="text-base font-semibold text-stone-800 mt-2">
              お子さまの情報を登録
            </h2>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              名前と生年月日からイベントスケジュールを自動生成します
            </p>
          </div>
          <ChildForm onSubmit={onSubmit} />
        </div>
        <div className="px-6 pb-5 pt-1">
          <p className="text-[11px] text-stone-300 text-center">
            生年月日は登録後に変更できません
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}