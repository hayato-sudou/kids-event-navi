'use client';

import { useState, type FormEvent } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { ChildProfile } from '@/types';
import DatePicker from './DatePicker';

interface Props {
  onSubmit: (profile: ChildProfile) => void;
  initialProfile?: ChildProfile | null;
}

export default function ChildForm({ onSubmit, initialProfile }: Props) {
  const isRegistered = !!initialProfile?.id;
  const [name, setName] = useState(initialProfile?.name ?? '');
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    initialProfile?.birthDate
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      setError('生年月日を入力してください');
      return;
    }
    setError('');
    onSubmit({
      ...initialProfile,
      name: name.trim() || 'お子さま',
      birthDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* 名前（常に編集可能） */}
      <div className="mb-4">
        <label
          htmlFor="child-name"
          className="block text-xs font-medium text-stone-500 mb-1.5"
        >
          お子さまの名前（ニックネーム）
        </label>
        <input
          id="child-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：はなちゃん"
          maxLength={20}
          className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-200
                     bg-stone-50 text-stone-700 placeholder:text-stone-300
                     focus:outline-none focus:ring-2 focus:ring-sage-300
                     focus:border-transparent transition"
        />
      </div>

      {/* 生年月日 */}
      <div className="mb-5">
        <label className="block text-xs font-medium text-stone-500 mb-1.5">
          生年月日
          {!isRegistered && (
            <span className="text-rose-400 ml-0.5" aria-hidden="true">*</span>
          )}
        </label>

        {isRegistered ? (
          // 登録済み：テキスト表示のみ
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-stone-100 bg-stone-50">
            <span className="text-sm text-stone-600">
              {format(birthDate!, 'yyyy年M月d日（E）', { locale: ja })}
            </span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-400">
              変更不可
            </span>
          </div>
        ) : (
          // 未登録：日付ピッカー
          <>
            <DatePicker
              value={birthDate}
              onChange={setBirthDate}
              required
            />
            {error && (
              <p role="alert" className="mt-1.5 text-xs text-rose-500">
                {error}
              </p>
            )}
          </>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl text-sm font-medium
                   bg-sage-100 text-sage-800 border border-sage-200
                   hover:bg-sage-200 active:scale-[0.98]
                   transition-all duration-150"
      >
        {isRegistered ? '名前を保存する' : 'イベントを生成する'}
      </button>
    </form>
  );
}