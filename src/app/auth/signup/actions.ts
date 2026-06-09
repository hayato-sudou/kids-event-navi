'use server';

import bcrypt from 'bcryptjs';
import { signUpSchema } from '@/lib/validations/auth';
import { getSupabaseAdmin } from '@/lib/db';

type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function registerUser(
  formData: FormData
): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? '入力内容を確認してください';
    return { success: false, error: message };
  }

  const { name, email, password } = parsed.data;
  const supabaseAdmin = getSupabaseAdmin();

  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    return { success: false, error: 'このメールアドレスはすでに使用されています' };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { error } = await supabaseAdmin.from('users').insert({
    name,
    email,
    password: hashedPassword,
  });

  if (error) {
    console.error('register error:', error);
    return { success: false, error: 'ユーザー登録に失敗しました' };
  }

  return { success: true };
}