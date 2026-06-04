'use client';

import { useState, type FormEvent } from 'react';
import type { ChildProfile } from '@/types';

interface Props {
  onSubmit: (profile: ChildProfile) => void;
}

export default function ChildForm({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      setError('生年月日を入力してください');
      return;
    }
    setError('');
    onSubmit({
      name: name.trim() || 'お子さま',
      birthDate: new Date(birthDate),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
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
                     bg-stone-50 focus:outline-none focus:ring-2 focus:ring-sage-300
                     focus:border-transparent transition"
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="birth-date"
          className="block text-xs font-medium text-stone-500 mb-1.5"
        >
          生年月日
          <span className="text-rose-400 ml-0.5" aria-hidden="true">*</span>
        </label>
        <input
          id="birth-date"
          type="date"
          required
          aria-required="true"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-200
                     bg-stone-50 focus:outline-none focus:ring-2 focus:ring-sage-300
                     focus:border-transparent transition"
        />
        {error && (
          <p role="alert" className="mt-1.5 text-xs text-rose-500">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl text-sm font-medium
                   bg-sage-100 text-sage-800 border border-sage-200
                   hover:bg-sage-200 active:scale-[0.98]
                   transition-all duration-150"
      >
        イベントを生成する
      </button>
    </form>
  );
}