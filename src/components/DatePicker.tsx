'use client';

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
// react-day-picker の公式 style.css は import しない。
// 公式CSSは .rdp-nav { position: absolute } や .rdp-day { width: 44px } など
// 構造に強く依存したスタイルを rdp- 接頭辞のクラスに当てており、
// 下記 classNames で同じ rdp- 接頭辞を使うと二重適用で競合する
// （ポップオーバーの高さ計算が崩れ、スクロール不能・選択不能の原因になっていた）。
// そのため classNames は rdp- を含まない独自クラス名のみを使い、
// レイアウトは完全にTailwindユーティリティで制御する。

interface Props {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  required?: boolean;
}

export default function DatePicker({ value, onChange, required }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // createPortal は document.body を必要とするため、
  // クライアントでのマウント完了後にのみポータルを描画する
  useEffect(() => {
    setMounted(true);
  }, []);

  // トリガーボタンの座標からポップオーバーの表示位置を計算する。
  // ChildProfileModal 等の親コンテナが overflow-hidden を持つため、
  // ポップオーバーは document.body に直接ポータルし、
  // position: fixed で画面座標を直接指定して独立させる。
  const updatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });
  }, []);

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, updatePosition]);

  // 開いている間はスクロール・リサイズに追従して位置を更新する
  useEffect(() => {
    if (!open) return;
    const handle = () => updatePosition();
    window.addEventListener('scroll', handle, true);
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle, true);
      window.removeEventListener('resize', handle);
    };
  }, [open, updatePosition]);

  // トリガーボタン・ポップオーバーの外側クリックで閉じる
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

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
        ref={triggerRef}
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

      {/* カレンダーポップオーバー：document.body にポータルし、
          親の overflow-hidden / position 制約から完全に独立させる */}
      {open && mounted && position && createPortal(
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="日付を選択"
          style={{ position: 'fixed', top: position.top, left: position.left }}
          className="z-50 bg-white rounded-2xl border border-stone-100
                     shadow-lg shadow-stone-100/80"
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
              root:          'dp-root relative p-4',
              months:        'dp-months',
              month:         'dp-month',
              month_caption: 'dp-month_caption flex items-center justify-center mb-3',

              // v10では caption_label が「実際に見えるテキスト」を担う。
              // v9以前のような hidden 指定をすると何も表示されなくなるため、
              // ここでドロップダウンの見た目（テキスト＋シェブロン）を定義する。
              caption_label: 'dp-caption_label flex items-center gap-1 text-sm font-medium text-stone-700 px-2 py-1 rounded-lg bg-stone-50 border border-stone-200 pointer-events-none',

              // ドロップダウンのコンテナ（年・月それぞれを包む span）
              dropdowns:     'dp-dropdowns flex items-center justify-center gap-1 relative',
              dropdown_root: 'dp-dropdown_root relative inline-flex items-center',

              // 実体の <select>。見た目はcaption_labelに譲り、
              // クリック・キーボード操作を受け付ける透明なヒットエリアとして重ねる。
              dropdown:      'dp-dropdown absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10',

              // 公式CSSの .rdp-nav は position:absolute が前提のため、
              // 同じ役割を独自クラスで作り直し、通常のflexレイアウトに乗せる。
              nav:           'dp-nav flex items-center justify-center gap-2 mb-3',
              button_previous: 'dp-button_previous w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 transition',
              button_next:   'dp-button_next w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 transition',

              // month_grid は <table>、weeks は <tbody>、week は <tr>、day は <td>。
              // <tr>/<td> に display:flex を当てるとテーブルレイアウトの計算から外れ、
              // 高さが潰れて見えなくなることがあるため、テーブル本来の表示方式を維持する。
              // 中央寄せ等のレイアウトは day_button（中身の<button>）側で行う。
              month_grid:    'dp-month_grid border-collapse',
              weeks:         'dp-weeks',
              weekdays:      'dp-weekdays',
              weekday:       'dp-weekday w-9 text-center text-[11px] font-medium text-stone-400 pb-1',
              week:          'dp-week',
              day:           'dp-day w-9 h-9 text-center align-middle p-0',
              day_button:    'dp-day_button w-8 h-8 flex items-center justify-center rounded-full text-sm text-stone-600 hover:bg-sage-100 hover:text-sage-800 transition mx-auto',
              selected:      'dp-selected [&>button]:!bg-sage-300 [&>button]:!text-sage-800 [&>button]:font-semibold',
              today:         'dp-today [&>button]:border [&>button]:border-sage-300 [&>button]:text-sage-800',
              outside:       'dp-outside [&>button]:text-stone-300',
              disabled:      'dp-disabled [&>button]:opacity-30 [&>button]:cursor-not-allowed',
              hidden:        'dp-hidden invisible',
            }}
          />
        </div>,
        document.body
      )}
    </div>
  );
}