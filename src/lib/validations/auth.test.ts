import { describe, it, expect } from 'vitest';
import { signUpSchema, signInSchema } from './auth';

describe('signUpSchema', () => {
  const valid = {
    name: 'テストユーザー',
    email: 'test@example.com',
    password: 'Password1',
  };

  it('正常な入力を許可する', () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true);
  });

  it('メールアドレスが不正な場合エラー', () => {
    const result = signUpSchema.safeParse({ ...valid, email: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('パスワードが8文字未満でエラー', () => {
    const result = signUpSchema.safeParse({ ...valid, password: 'Pass1' });
    expect(result.success).toBe(false);
  });

  it('パスワードに大文字がない場合エラー', () => {
    const result = signUpSchema.safeParse({ ...valid, password: 'password1' });
    expect(result.success).toBe(false);
  });

  it('パスワードに数字がない場合エラー', () => {
    const result = signUpSchema.safeParse({ ...valid, password: 'Password' });
    expect(result.success).toBe(false);
  });
});

describe('signInSchema', () => {
  it('正常な入力を許可する', () => {
    const result = signInSchema.safeParse({
      email: 'test@example.com',
      password: 'anypassword',
    });
    expect(result.success).toBe(true);
  });

  it('パスワードが空の場合エラー', () => {
    const result = signInSchema.safeParse({
      email: 'test@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});