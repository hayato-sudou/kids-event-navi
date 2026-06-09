import { z } from 'zod';

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, 'お名前を入力してください')
    .max(50, '50文字以内で入力してください'),
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('正しいメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(100, '100文字以内で入力してください')
    .regex(/[A-Z]/, '大文字を1文字以上含めてください')
    .regex(/[0-9]/, '数字を1文字以上含めてください'),
});

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('正しいメールアドレスを入力してください'),
  password: z
    .string()
    .min(1, 'パスワードを入力してください'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;