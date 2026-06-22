'use server';

import { auth } from '@/lib/auth';
import {
  getChildProfile,
  saveChildProfile,
  getTasks,
  updateAvatarUrl,
  deleteAllTasks,
} from '@/lib/childProfile';
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

  // child_profiles を削除する前に、必ず event_memos を明示的に削除する。
  // DB側の外部キーに ON DELETE CASCADE が設定されていることに依存すると、
  // 設定漏れがあった場合に event_memos の行が孤立データとして残り続け、
  // 後で作成される新しいプロフィールに誤って参照される事故につながる。
  const tasksDeleted = await deleteAllTasks(profileId);
  if (!tasksDeleted) {
    console.error('reset error: event_memos の削除に失敗したため、child_profiles の削除を中止しました');
    return { success: false };
  }

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

export async function uploadAvatarAction(
  profileId: string,
  formData: FormData
): Promise<{ success: boolean; avatarUrl?: string; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '認証エラー' };

  const file = formData.get('avatar') as File | null;
  if (!file || file.size === 0) return { success: false, error: 'ファイルが選択されていません' };

  // バリデーション
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'JPEG・PNG・WebP のみ対応しています' };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { success: false, error: 'ファイルサイズは2MB以下にしてください' };
  }

  const ext = file.type.split('/')[1];
  const path = `${profileId}/avatar.${ext}`;
  const supabase = getSupabaseAdmin();

  const { error: uploadError } = await supabase.storage
    .from('child-avatars')
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    console.error('upload error:', uploadError);
    return { success: false, error: 'アップロードに失敗しました' };
  }

  const { data: urlData } = supabase.storage
    .from('child-avatars')
    .getPublicUrl(path);

  // キャッシュバスティング用クエリパラメータを付与
  const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

  const updated = await updateAvatarUrl(profileId, avatarUrl);
  if (!updated) return { success: false, error: 'URL保存に失敗しました' };

  return { success: true, avatarUrl };
}

export async function loadInitialDataAction(): Promise<{
  profile: ChildProfile | null;
  events: KidsEvent[];
  taskMap: Record<string, Task[]>;
}> {
  const session = await auth();
  if (!session?.user?.id) return { profile: null, events: [], taskMap: {} };

  const profile = await getChildProfile(session.user.id);
  if (!profile?.id) return { profile: null, events: [], taskMap: {} };

  const events = computeKidsEvents(profile.birthDate);
  const eventKeys: EventKey[] = ['omiyamairi', 'okuizome', 'half', 'birthday1'];

  const taskMap: Record<string, Task[]> = {};
  await Promise.all(
    eventKeys.map(async (key) => {
      // getTasks が例外を投げても、このイベントのみデフォルトタスクへ
      // フォールバックし、taskMap に必ずキーをセットする。
      // ここを省略すると Timeline 側で空配列にフォールバックしてしまい、
      // useTasks の自動保存により誤って空配列が保存される事故につながる。
      try {
        const tasks = await getTasks(profile.id!, key);
        taskMap[key] = tasks ?? getDefaultTasks(key);
      } catch (err) {
        console.error(`[loadInitialDataAction] getTasks(${key}) に失敗しました。デフォルトタスクにフォールバックします。`, err);
        taskMap[key] = getDefaultTasks(key);
      }
    })
  );

  return { profile, events, taskMap };
}