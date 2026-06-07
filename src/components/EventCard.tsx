'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { KidsEvent } from '@/types';
import TaskModal from './TaskModal';
import { loadTasks } from '@/lib/taskStorage';

interface Props {
  event: KidsEvent;
}

export default function EventCard({ event }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const isPast = event.date < new Date();
  const { colorScheme: cs } = event;

  // バッジ表示用にタスク件数をサマリー
  const tasks = loadTasks(event.key);
  const checkedCount = tasks.filter((t) => t.checked).length;
  const totalCount = tasks.length;

  return (
    <>
      <article
        aria-label={event.name}
        className={`rounded-2xl border border-stone-100 bg-white overflow-hidden
                    transition-opacity ${isPast ? 'opacity-60' : 'opacity-100'}`}
      >
        {/* ヘッダー */}
        <div className="flex items-center gap-3 p-3.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{ background: cs.iconBg }}
            aria-hidden="true"
          >
            {event.icon}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-stone-800 truncate">
              {event.name}
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {event.description}
              {isPast && ' · 完了'}
            </p>
          </div>

          <time
            dateTime={format(event.date, 'yyyy-MM-dd')}
            className="text-xs font-medium rounded-full px-2.5 py-1 flex-shrink-0"
            style={{ background: cs.badgeBg, color: cs.badgeText }}
          >
            {format(event.date, 'M/d（E）', { locale: ja })}
          </time>
        </div>

        {/* 日付フル表示 */}
        <div className="px-3.5 pb-3 -mt-1">
          <p className="text-xs text-stone-400">
            {format(event.date, 'yyyy年M月d日（E）', { locale: ja })}
          </p>
        </div>

        {/* イベント説明 ← 追加 */}
        <div className="px-3.5 pb-3.5">
          <p className="text-xs text-stone-500 leading-relaxed">
            {event.detail}
          </p>
        </div>

        {/* アクション行 */}
        <div className="border-t border-stone-100">
          {/* やることリスト */}
          <button
            onClick={() => setModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 border-b border-stone-100
                       hover:bg-stone-50 transition text-left"
            aria-label={`${event.name}のやることリストを開く`}
          >
            <span className="text-stone-400 text-sm" aria-hidden="true">☑</span>
            <span className="text-xs font-medium text-stone-600 flex-1">やることリスト</span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: cs.badgeBg, color: cs.badgeText }}
            >
              {checkedCount}/{totalCount}
            </span>
          </button>

          {/* AIアドバイス（未実装） */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5">
            <span className="text-stone-300 text-sm" aria-hidden="true">✦</span>
            <span className="text-xs font-medium text-stone-400 flex-1">AIアドバイス</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-400">
              準備中
            </span>
          </div>
        </div>
      </article>

      {modalOpen && (
        <TaskModal
          event={event}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}