'use server';

import { auth } from '@/lib/auth';
import { getChildProfile, saveTasks } from '@/lib/childProfile';
import type { EventKey, Task } from '@/types';

export async function saveTasksAction(
  eventKey: EventKey,
  tasks: Task[]
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const profile = await getChildProfile(session.user.id);
  if (!profile?.id) return;

  await saveTasks(profile.id, eventKey, tasks);
}