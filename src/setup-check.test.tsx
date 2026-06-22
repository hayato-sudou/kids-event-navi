import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('vitest + jest-dom セットアップ', () => {
  it('toBeInTheDocument が型エラーなく実行できる', () => {
    render(<p>hello</p>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});