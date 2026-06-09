import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import HomeClient from '@/components/HomeClient';

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect('/auth/signin');

  return <HomeClient userName={session.user?.name ?? 'お客様'} />;
}