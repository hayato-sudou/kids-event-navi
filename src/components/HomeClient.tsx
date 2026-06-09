'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import ChildForm from '@/components/ChildForm';
import Timeline from '@/components/Timeline';
import { computeKidsEvents } from '@/lib/events';
import type { ChildProfile, KidsEvent } from '@/types';

interface Props {
  userName: string;
}

export default function HomeClient({ userName }: Props) {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [events, setEvents] = useState<KidsEvent[]>([]);

  const handleSubmit = (newProfile: ChildProfile) => {
    setProfile(newProfile);
    setEvents(computeKidsEvents(newProfile.birthDate));
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-stone-800 tracking-tight">
              🌿 キッズイベント・ナビ
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              生年月日からイベントを自動生成します
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500">{userName}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="text-xs px-3 py-1.5 rounded-lg border border-stone-200
                         text-stone-500 hover:bg-stone-50 transition"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:px-6">
        <div className="md:grid md:grid-cols-[320px_1fr] md:gap-8">
          <aside>
            <div className="md:sticky md:top-8">
              <div className="bg-white rounded-2xl border border-stone-100 p-5 mb-6 md:mb-0">
                <h2 className="text-sm font-medium text-stone-600 mb-4">
                  お子さまの情報
                </h2>
                <ChildForm onSubmit={handleSubmit} />
              </div>
              <div className="hidden md:block mt-4 p-4 bg-sage-100 rounded-2xl border border-sage-200">
                <p className="text-xs text-sage-800 leading-relaxed">
                  ✦ 今後追加予定の機能
                </p>
                <ul className="mt-2 space-y-1">
                  {['やることリスト', 'AIアドバイス', 'お店・サービス検索', 'リマインダー通知'].map((item) => (
                    <li key={item} className="text-xs text-sage-800 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-sage-300 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <section>
            {profile && events.length > 0 ? (
              <Timeline profile={profile} events={events} />
            ) : (
              <EmptyState />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center
                    min-h-[300px] md:min-h-[500px]
                    bg-white rounded-2xl border border-stone-100
                    text-center p-8">
      <div className="text-4xl mb-4">🌿</div>
      <p className="text-sm font-medium text-stone-500">
        イベントがここに表示されます
      </p>
      <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
        左のフォームに名前と生年月日を入力して<br />
        「イベントを生成する」を押してください
      </p>
    </div>
  );
}