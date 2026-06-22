'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import 'react-day-picker/style.css';

interface Props {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  required?: boolean;
}

export default function DatePicker({ value, onChange, required }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // コンテナ外クリックで閉じる
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    if (date) setOpen(false);
  };

  const displayText = value
    ? format(value, 'yyyy年M月d日（E）', { locale: ja })
    : '生年月日を選択';

  return (
    <div ref={containerRef} className="relative">
      {/* トリガーボタン */}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-required={required}
        onClick={() => setOpen((v) => !v)}
        className={`w-full px-3 py-2.5 text-sm rounded-xl border text-left
                    bg-stone-50 transition
                    focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent
                    ${value
                      ? 'text-stone-700 border-stone-200'
                      : 'text-stone-300 border-stone-200'
                    }`}
      >
        <span className="flex items-center justify-between">
          {displayText}
          <svg
            className={`w-4 h-4 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* カレンダーポップオーバー */}
      {open && (
        <div
          role="dialog"
          aria-label="日付を選択"
          className="absolute z-50 mt-2 bg-white rounded-2xl border border-stone-100
                     shadow-lg shadow-stone-100/80 overflow-hidden"
        >
          <DayPicker
            mode="single"
            selected={value}
            onSelect={handleSelect}
            locale={ja}
            defaultMonth={value ?? new Date()}
            captionLayout="dropdown"
            startMonth={new Date(2020, 0)}
            endMonth={new Date()}
            classNames={{
              root:          'rdp-root p-4',
              months:        'rdp-months',
              month:         'rdp-month',
              month_caption: 'rdp-month_caption flex items-center justify-center gap-2 mb-3',

              // v10では caption_label が「実際に見えるテキスト」を担う。
              // v9以前のような hidden 指定をすると何も表示されなくなるため、
              // ここでドロップダウンの見た目（テキスト＋シェブロン）を定義する。
              caption_label: 'rdp-caption_label flex items-center gap-1 text-sm font-medium text-stone-700 px-2 py-1 rounded-lg bg-stone-50 border border-stone-200 pointer-events-none',

              // ドロップダウンのコンテナ（年・月それぞれを包む span）
              dropdowns:     'rdp-dropdowns flex items-center gap-1',
              dropdown_root: 'rdp-dropdown_root relative',

              // 実体の <select>。見た目はcaption_labelに譲り、
              // クリック・キーボード操作を受け付ける透明なヒットエリアとして重ねる。
              dropdown:      'rdp-dropdown absolute inset-0 w-full h-full opacity-0 cursor-pointer',

              nav:           'rdp-nav flex items-center justify-between mb-3',
              button_previous: 'rdp-button_previous w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 transition',
              button_next:   'rdp-button_next w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 transition',

              // month_grid は <table>、weeks は <tbody>、week は <tr>、day は <td>。
              // <tr>/<td> に display:flex を当てるとテーブルレイアウトの計算から外れ、
              // 高さが潰れて見えなくなることがあるため、テーブル本来の表示方式を維持する。
              // 中央寄せ等のレイアウトは day_button（中身の<button>）側で行う。
              month_grid:    'rdp-month_grid border-collapse',
              weeks:         'rdp-weeks',
              weekdays:      'rdp-weekdays',
              weekday:       'rdp-weekday w-9 text-center text-[11px] font-medium text-stone-400 pb-1',
              week:          'rdp-week',
              day:           'rdp-day w-9 h-9 text-center align-middle p-0',
              day_button:    'w-8 h-8 flex items-center justify-center rounded-full text-sm text-stone-600 hover:bg-sage-100 hover:text-sage-800 transition mx-auto',
              selected:      '[&>button]:!bg-sage-300 [&>button]:!text-sage-800 [&>button]:font-semibold',
              today:         '[&>button]:border [&>button]:border-sage-300 [&>button]:text-sage-800',
              outside:       '[&>button]:text-stone-300',
              disabled:      '[&>button]:opacity-30 [&>button]:cursor-not-allowed',
              hidden:        'invisible',
            }}
          />
        </div>
      )}
    </div>
  );
}