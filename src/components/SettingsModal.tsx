'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { ChildProfile } from '@/types';
import { resetChildProfileAction } from '@/app/actions/profile';

interface Props {
  profile: ChildProfile | null;
  onClose: () => void;
  onReset: () => void;
}

export default function SettingsModal({ profile, onClose, onReset }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!profile?.id) return;
    setIsLoading(true);
    const result = await resetChildProfileAction(profile.id);
    setIsLoading(false);
    if (result.success) {
      onReset();
      onClose();
    }
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="設定"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* ヘッダー */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h2 className="text-sm font-semibold text-stone-800">設定</h2>
            <button
              onClick={onClose}
              aria-label="閉じる"
              className="w-7 h-7 flex items-center justify-center rounded-lg
                         text-stone-400 hover:bg-stone-100 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* コンテンツ */}
          <div className="px-5 py-4">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">
              お子さまの情報
            </p>

            {profile ? (
              <div className="rounded-xl border border-stone-100 overflow-hidden">
                {/* プロフィール表示 */}
                <div className="flex items-center gap-3 px-4 py-3 bg-stone-50">
                  <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sm">
                    🧒
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-700">{profile.name}</p>
                    <p className="text-[11px] text-stone-400">
                      {profile.birthDate instanceof Date
                        ? profile.birthDate.toLocaleDateString('ja-JP')
                        : String(profile.birthDate)}
                      生まれ
                    </p>
                  </div>
                </div>

                {/* リセットボタン */}
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full flex items-center gap-2.5 px-4 py-3
                             text-left hover:bg-rose-50 transition border-t border-stone-100"
                >
                  <span className="text-rose-400 text-sm">⚠</span>
                  <span className="text-xs font-medium text-rose-500">
                    お子さまの情報をリセット
                  </span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-2">
                お子さまの情報が登録されていません
              </p>
            )}
          </div>

          {/* 警告確認パネル */}
          {showConfirm && (
            <div className="mx-5 mb-5 p-4 rounded-xl bg-rose-50 border border-rose-100">
              <p className="text-xs font-semibold text-rose-600 mb-1">
                ⚠️ リセットの確認
              </p>
              <p className="text-xs text-rose-500 leading-relaxed mb-4">
                お子さまの情報・やることリストのチェック状態がすべて削除されます。この操作は取り消せません。
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium
                             border border-stone-200 text-stone-600
                             hover:bg-stone-50 transition"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="flex-1 py-2 rounded-lg text-xs font-medium
                             bg-rose-500 text-white hover:bg-rose-600
                             disabled:opacity-50 transition"
                >
                  {isLoading ? '削除中...' : 'リセットする'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}