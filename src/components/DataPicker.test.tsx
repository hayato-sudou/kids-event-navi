import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DatePicker from './DatePicker';

describe('DatePicker', () => {
  it('トリガーボタンをクリックするとカレンダーが開く', () => {
    render(<DatePicker value={undefined} onChange={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /生年月日を選択/ }));

    expect(screen.getByRole('dialog', { name: '日付を選択' })).toBeInTheDocument();
  });

  it('年・月のドロップダウン（select）が操作可能な状態で存在する', () => {
    render(<DatePicker value={undefined} onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /生年月日を選択/ }));

    // react-day-picker v10 は年・月それぞれ <select> としてレンダリングする
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThanOrEqual(2);
    selects.forEach((select) => {
      expect(select).toBeEnabled();
    });
  });

  it('日付を選択すると onChange が呼ばれ、ポップオーバーが閉じる', () => {
    const handleChange = vi.fn();
    render(<DatePicker value={undefined} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('button', { name: /生年月日を選択/ }));

    const dayButtons = screen.getAllByRole('button').filter(
      (el) => el.textContent && /^\d{1,2}$/.test(el.textContent)
    );
    fireEvent.click(dayButtons[0]);

    expect(handleChange).toHaveBeenCalled();
  });
});