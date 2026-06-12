'use server';

import { auth } from '@/lib/auth';
import { getChildProfile, saveChildProfile, getTasks } from '@/lib/childProfile';
import { computeKidsEvents } from '@/lib/events';
import { getDefaultTasks } from '@/lib/defaultTasks';
import { getSupabaseAdmin } from '@/lib/db';
import type { ChildProfile, KidsEvent, Task, EventKey } from '@/types';

export async function saveChildProfileAction(
  profile: ChildProfile
): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return saveChildProfile(session.user.id, profile);
}

export async function resetChildProfileAction(
  profileId: string
): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('child_profiles')
    .delete()
    .eq('id', profileId)
    .eq('user_id', session.user.id);

  if (error) {
    console.error('reset error:', error);
    return { success: false };
  }

  return { success: true };
}

export async function loadInitialDataAction(): Promise<{
  profile: ChildProfile | null;
  events: KidsEvent[];
  taskMap: Record<string, Task[]>;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { profile: null, events: [], taskMap: {} };
  }

  const profile = await getChildProfile(session.user.id);
  if (!profile?.id) {
    return { profile: null, events: [], taskMap: {} };
  }

  const events = computeKidsEvents(profile.birthDate);
  const eventKeys: EventKey[] = ['omiyamairi', 'okuizome', 'half', 'birthday1'];

  const taskMap: Record<string, Task[]> = {};
  await Promise.all(
    eventKeys.map(async (key) => {
      const tasks = await getTasks(profile.id!, key);
      taskMap[key] = tasks ?? getDefaultTasks(key);
    })
  );

  return { profile, events, taskMap };
}