'use client';

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import type { ChildProfile } from '@/types';
import { resetChildProfileAction, uploadAvatarAction } from '@/app/actions/profile';

interface Props {
  profile: ChildProfile | null;
  onClose: () => void;
  onReset: () => void;
  onAvatarUpdate: (avatarUrl: string) => void;
}

export default function SettingsModal({ profile, onClose, onReset, onAvatarUpdate }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = async () => {
    if (!profile?.id) return;
    setIsResetting(true);
    const result = await resetChildProfileAction(profile.id);
    setIsResetting(false);
    if (result.success) {
      onReset();
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // クライアント側プレビュー
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!profile?.id || !fileInputRef.current?.files?.[0]) return;
    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('avatar', fileInputRef.current.files[0]);

    const result = await uploadAvatarAction(profile.id, formData);
    setIsUploading(false);

    if (!result.success) {
      setUploadError(result.error ?? 'アップロードに失敗しました');
      return;
    }

    if (result.avatarUrl) {
      onAvatarUpdate(result.avatarUrl);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const currentAvatar = previewUrl ?? profile?.avatarUrl ?? null;

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
          <div className="px-5 py-4 space-y-5">

            {/* 写真セクション */}
            {profile && (
              <section aria-label="写真の変更">
                <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">
                  写真
                </p>
                <div className="flex items-center gap-4">
                  {/* プレビュー */}
                  <div className="relative w-16 h-16 flex-shrink-0">
                    {currentAvatar ? (
                      <Image
                        src={currentAvatar}
                        alt="プレビュー"
                        fill
                        sizes="64px"
                        className="rounded-full object-cover ring-2 ring-sage-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-sage-100 ring-2 ring-sage-200
                                      flex items-center justify-center text-2xl"
                        aria-hidden="true"
                      >
                        🧒
                      </div>
                    )}
                  </div>

                  {/* ファイル選択・アップロード */}
                  <div className="flex-1 min-w-0">
                    <input
                      ref={fileInputRef}
                      id="avatar-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="sr-only"
                      aria-label="写真を選択"
                    />
                    <label
                      htmlFor="avatar-input"
                      className="inline-block cursor-pointer text-xs px-3 py-1.5
                                 rounded-lg border border-stone-200 text-stone-600
                                 hover:bg-stone-50 transition"
                    >
                      写真を選択
                    </label>
                    <p className="text-[11px] text-stone-300 mt-1.5">
                      JPEG・PNG・WebP／2MB以下
                    </p>

                    {previewUrl && (
                      <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="mt-2 text-xs px-3 py-1.5 rounded-lg
                                   bg-sage-100 text-sage-800 border border-sage-200
                                   hover:bg-sage-200 disabled:opacity-50 transition"
                      >
                        {isUploading ? 'アップロード中...' : 'この写真を保存'}
                      </button>
                    )}

                    {uploadError && (
                      <p role="alert" className="mt-1.5 text-[11px] text-rose-500">
                        {uploadError}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* プロフィールセクション */}
            <section aria-label="お子さまの情報">
              <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">
                お子さまの情報
              </p>

              {profile ? (
                <div className="rounded-xl border border-stone-100 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-stone-50">
                    <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sm"
                      aria-hidden="true"
                    >
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

                  <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full flex items-center gap-2.5 px-4 py-3
                               text-left hover:bg-rose-50 transition border-t border-stone-100"
                  >
                    <span className="text-rose-400 text-sm" aria-hidden="true">⚠</span>
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
            </section>
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
                  disabled={isResetting}
                  className="flex-1 py-2 rounded-lg text-xs font-medium
                             bg-rose-500 text-white hover:bg-rose-600
                             disabled:opacity-50 transition"
                >
                  {isResetting ? '削除中...' : 'リセットする'}
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