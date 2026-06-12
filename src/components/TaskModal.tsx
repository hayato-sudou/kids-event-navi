'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import type { KidsEvent, Task } from '@/types';
import { useTasks } from '@/hooks/useTasks';

interface Props {
  event: KidsEvent;
  childProfileId: string;
  initialTasks: Task[];
  onClose: () => void;
}

export default function TaskModal({ event, childProfileId, initialTasks, onClose }: Props) {
  const { tasks, toggle, add, remove, checkedCount } = useTasks(
    event.key,
    childProfileId,
    initialTasks
  );
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { colorScheme: cs } = event;

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAdd = () => {
    add(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
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
        aria-label={`${event.name}のやることリスト`}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
              style={{ background: cs.iconBg }}
              aria-hidden="true"
            >
              {event.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-stone-800">{event.name}</h2>
              <p className="text-[11px] text-stone-400 mt-0.5">
                やることリスト · {checkedCount}/{tasks.length} 完了
              </p>
            </div>
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

          <ul className="px-5 py-3 space-y-1 max-h-72 overflow-y-auto" aria-label="タスク一覧">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center gap-3 py-2 group">
                <button
                  role="checkbox"
                  aria-checked={task.checked}
                  onClick={() => toggle(task.id)}
                  className="w-5 h-5 rounded-md border-2 flex items-center justify-center
                             flex-shrink-0 transition"
                  style={{
                    borderColor: task.checked ? cs.dot : '#d6d3d1',
                    background: task.checked ? cs.dot : 'transparent',
                  }}
                  aria-label={task.label}
                >
                  {task.checked && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className={`flex-1 text-sm transition-colors ${task.checked ? 'line-through text-stone-300' : 'text-stone-700'}`}>
                  {task.label}
                </span>
                <button
                  onClick={() => remove(task.id)}
                  aria-label={`${task.label}を削除`}
                  className="w-6 h-6 flex items-center justify-center rounded-md
                             text-stone-300 hover:text-rose-400 hover:bg-rose-50
                             opacity-0 group-hover:opacity-100 transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          <div className="px-5 py-4 border-t border-stone-100">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="タスクを追加…"
                maxLength={50}
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-stone-200
                           bg-stone-50 text-stone-700 placeholder:text-stone-300
                           focus:outline-none focus:ring-2 focus:ring-sage-300
                           focus:border-transparent transition"
              />
              <button
                onClick={handleAdd}
                disabled={!inputValue.trim()}
                aria-label="タスクを追加"
                className="px-4 py-2 rounded-xl text-sm font-medium
                           bg-sage-100 text-sage-800 border border-sage-200
                           hover:bg-sage-200 disabled:opacity-40 disabled:cursor-not-allowed
                           transition"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}