'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/app/auth/signup/actions';

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    const signInResult = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    setIsLoading(false);

    if (signInResult?.error) {
      router.push('/auth/signin');
      return;
    }

    router.push('/');
    router.refresh();
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6">
      <button
        onClick={handleGoogle}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4
                   rounded-xl border border-stone-200 text-sm font-medium text-stone-700
                   hover:bg-stone-50 transition disabled:opacity-50"
      >
        <GoogleIcon />
        Googleで登録
      </button>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-stone-100" />
        <span className="text-xs text-stone-400">または</span>
        <div className="flex-1 h-px bg-stone-100" />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="name" className="block text-xs font-medium text-stone-500 mb-1.5">
            お名前
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-200
                      bg-stone-50 text-stone-800 placeholder:text-stone-400
                      focus:outline-none focus:ring-2 focus:ring-sage-300
                      focus:border-transparent transition"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="block text-xs font-medium text-stone-500 mb-1.5">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-200
                        bg-stone-50 text-stone-800 placeholder:text-stone-400
                        focus:outline-none focus:ring-2 focus:ring-sage-300
                        focus:border-transparent transition"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block text-xs font-medium text-stone-500 mb-1.5">
            パスワード（8文字以上・大文字・数字を含む）
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-200
                      bg-stone-50 text-stone-800 placeholder:text-stone-400
                      focus:outline-none focus:ring-2 focus:ring-sage-300
                      focus:border-transparent transition"
          />
        </div>

        {error && (
          <p role="alert" className="mb-4 text-xs text-rose-500 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl text-sm font-medium
                     bg-sage-100 text-sage-800 border border-sage-200
                     hover:bg-sage-200 active:scale-[0.98]
                     transition-all duration-150 disabled:opacity-50"
        >
          {isLoading ? '登録中...' : 'アカウントを作成'}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-stone-400">
        すでにアカウントをお持ちの方は
        <Link href="/auth/signin" className="text-sage-800 underline ml-1">
          ログイン
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}