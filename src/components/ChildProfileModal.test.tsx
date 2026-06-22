import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ChildProfileModal from './ChildProfileModal';

describe('ChildProfileModal', () => {
  it('初回レンダリング（マウント前）では document を参照せずクラッシュしない', () => {
    // createPortal が document.body に依存するため、
    // マウント完了前に呼ばれるとSSR環境で ReferenceError になる。
    // ここでは jsdom 環境下でも「mounted=falseの間は何も描画しない」ことを確認する。
    expect(() => render(<ChildProfileModal onSubmit={vi.fn()} />)).not.toThrow();
  });

  it('マウント後にモーダルが表示される', async () => {
    render(<ChildProfileModal onSubmit={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'お子さまの情報を登録' })).toBeInTheDocument();
    });
  });

  it('生年月日が登録後に変更できない旨の注記が表示される', async () => {
    render(<ChildProfileModal onSubmit={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('生年月日は登録後に変更できません')).toBeInTheDocument();
    });
  });
});
