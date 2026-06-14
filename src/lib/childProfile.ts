'use server';

import { getSupabaseAdmin } from '@/lib/db';
import type { ChildProfile, EventKey, Task } from '@/types';

// ----------------------------
// 子どもプロフィール
// ----------------------------

export async function getChildProfile(
  userId: string
): Promise<ChildProfile | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('child_profiles')
    .select('id, name, birth_date, avatar_url') 
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    birthDate: new Date(data.birth_date),
    avatarUrl: data.avatar_url ?? undefined,
  };
}

export async function saveChildProfile(
  userId: string,
  profile: ChildProfile
): Promise<string | null> {
  const supabase = getSupabaseAdmin();

  // 既存レコードがあればupsert
  if (profile.id) {
    const { error } = await supabase
      .from('child_profiles')
      .update({
        name: profile.name,
        birth_date: profile.birthDate.toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    if (error) {
      console.error('update child_profile error:', error);
      return null;
    }
    return profile.id;
  }

  // 新規作成
  const { data, error } = await supabase
    .from('child_profiles')
    .insert({
      user_id: userId,
      name: profile.name,
      birth_date: profile.birthDate.toISOString().split('T')[0],
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('insert child_profile error:', error);
    return null;
  }

  return data.id;
}

// ----------------------------
// タスク
// ----------------------------

export async function getTasks(
  childProfileId: string,
  eventKey: EventKey
): Promise<Task[] | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('event_memos')
    .select('tasks')
    .eq('child_profile_id', childProfileId)
    .eq('event_key', eventKey)
    .single();

  if (error || !data) return null;
  return data.tasks as Task[];
}

export async function saveTasks(
  childProfileId: string,
  eventKey: EventKey,
  tasks: Task[]
): Promise<void> {
  const supabase = getSupabaseAdmin();

  await supabase
    .from('event_memos')
    .upsert(
      {
        child_profile_id: childProfileId,
        event_key: eventKey,
        tasks,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'child_profile_id,event_key' }
    );
}

export async function updateAvatarUrl(
  profileId: string,
  avatarUrl: string
): Promise<boolean> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('child_profiles')
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq('id', profileId);

  if (error) {
    console.error('updateAvatarUrl error:', error);
    return false;
  }
  return true;
}