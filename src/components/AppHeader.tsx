'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import type { ChildProfile } from '@/types';

interface Props {
  userName: string;
  profile: ChildProfile | null;
  onAvatarClick: () => void;
}

export default function AppHeader({ userName, profile, onAvatarClick }: Props) {
  return (
    <header className="bg-white border-b border-stone-100 px-6 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">

        {/* 左：アプリ名 */}
        <div className="flex-shrink-0">
          <h1 className="text-base font-medium text-stone-800 tracking-tight">
            🌿 キッズイベント・ナビ
          </h1>
          <p className="text-[11px] text-stone-400 mt-0.5 hidden sm:block">
            生年月日からイベントを自動生成
          </p>
        </div>

        {/* 右：子どもの情報 ＋ ユーザー操作 */}
        <div className="flex items-center gap-3">
          {profile && (
            <button
              onClick={onAvatarClick}
              aria-label="子どもの設定を開く"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-stone-50 transition group"
            >
              {/* 丸型アイコン */}
              <div className="relative w-8 h-8 flex-shrink-0">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={`${profile.name}のアイコン`}
                    fill
                    sizes="32px"
                    className="rounded-full object-cover ring-2 ring-sage-200 group-hover:ring-sage-300 transition"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full bg-sage-100 ring-2 ring-sage-200 group-hover:ring-sage-300 transition flex items-center justify-center text-base"
                    aria-hidden="true"
                  >
                    🧒
                  </div>
                )}
                <div
                  className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

              {/* 名前・生年月日 */}
              <div className="text-left hidden sm:block">
                <p className="text-xs font-medium text-stone-700 leading-tight">
                  {profile.name}
                </p>
                <p className="text-[11px] text-stone-400 leading-tight mt-0.5">
                  {format(profile.birthDate, 'yyyy年M月d日生まれ', { locale: ja })}
                </p>
              </div>
            </button>
          )}

          {profile && <div className="w-px h-5 bg-stone-100" aria-hidden="true" />}

          <span className="text-xs text-stone-400 hidden md:block">{userName}</span>

          <button
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 transition"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}