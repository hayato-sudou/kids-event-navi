import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import HomeClient from '@/components/HomeClient';
import { getChildProfile, getTasks } from '@/lib/childProfile';
import { getDefaultTasks } from '@/lib/taskMaster';
import { computeKidsEvents } from '@/lib/events';
import type { EventKey, KidsEvent, Task } from '@/types';

export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin');

  const userId = session.user.id;
  const profile = await getChildProfile(userId);

  let events: KidsEvent[] = [];
  const taskMap: Record<string, Task[]> = {};

  if (profile?.id) {
    events = computeKidsEvents(profile.birthDate);
    const eventKeys: EventKey[] = ['omiyamairi', 'okuizome', 'half', 'birthday1'];
    await Promise.all(
      eventKeys.map(async (key) => {
        const tasks = await getTasks(profile.id!, key);
        taskMap[key] = tasks ?? getDefaultTasks(key);
      })
    );
  }

  return (
    <HomeClient
      userName={session.user?.name ?? 'お客様'}
      initialProfile={profile}
      initialEvents={events}
      initialTaskMap={taskMap}
    />
  );
}