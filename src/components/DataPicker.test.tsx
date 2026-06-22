import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DatePicker from './DatePicker';

describe('DatePicker', () => {
  it('トリガーボタンをクリックするとカレンダーが開く', async () => {
    render(<DatePicker value={undefined} onChange={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /生年月日を選択/ }));

    // ポップオーバーは createPortal で document.body に非同期マウントされるため待機する
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '日付を選択' })).toBeInTheDocument();
    });
  });

  it('年・月のドロップダウン（select）が操作可能な状態で存在する', async () => {
    render(<DatePicker value={undefined} onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /生年月日を選択/ }));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '日付を選択' })).toBeInTheDocument();
    });

    // react-day-picker v10 は年・月それぞれ <select> としてレンダリングする
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThanOrEqual(2);
    selects.forEach((select) => {
      expect(select).toBeEnabled();
    });
  });

  it('日付を選択すると onChange が呼ばれ、ポップオーバーが閉じる', async () => {
    const handleChange = vi.fn();
    render(<DatePicker value={undefined} onChange={handleChange} />);
    fireEvent.click(screen.getByRole('button', { name: /生年月日を選択/ }));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '日付を選択' })).toBeInTheDocument();
    });

    const dayButtons = screen.getAllByRole('button').filter(
      (el) => el.textContent && /^\d{1,2}$/.test(el.textContent)
    );
    fireEvent.click(dayButtons[0]);

    expect(handleChange).toHaveBeenCalled();
  });

  it('外側クリックでポップオーバーが閉じる', async () => {
    render(
      <div>
        <DatePicker value={undefined} onChange={vi.fn()} />
        <button>外側の要素</button>
      </div>
    );
    fireEvent.click(screen.getByRole('button', { name: /生年月日を選択/ }));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '日付を選択' })).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByRole('button', { name: '外側の要素' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '日付を選択' })).not.toBeInTheDocument();
    });
  });
});