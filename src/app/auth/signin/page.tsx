import SignInForm from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-stone-800">🌿 キッズイベント・ナビ</h1>
          <p className="text-sm text-stone-400 mt-1">ログインしてください</p>
        </div>
        <SignInForm />
      </div>
    </main>
  );
}