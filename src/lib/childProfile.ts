'use server';

import { getSupabaseAdmin } from '@/lib/db';
import { EVENT_KEYS } from '@/types';
import type { ChildProfile, EventKey, Task } from '@/types';
import { getDefaultTasks } from '@/lib/taskMaster';

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

  // 新規プロフィール作成時、4イベント分のデフォルトタスクを
  // event_memos に明示的に INSERT しておく。
  // これを省略すると、event_memos に行が存在しない間は
  // getTasks() が null を返して getDefaultTasks() の表示用フォールバックで
  // 見た目だけ補完される状態になり、DB上の実体が無いまま
  // 何らかの理由（孤立データの参照、取得失敗など）で空配列が
  // 表示・保存されてしまう事故の温床になる。
  // ここで確実に DB へ初期データを書き込むことで、
  // 新規作成直後から event_memos に正しい初期状態が存在することを保証する。
  const initialTaskRows = EVENT_KEYS.map((key: EventKey) => ({
    child_profile_id: data.id,
    event_key: key,
    tasks: getDefaultTasks(key),
    updated_at: new Date().toISOString(),
  }));

  const { error: tasksInsertError } = await supabase
    .from('event_memos')
    .insert(initialTaskRows);

  if (tasksInsertError) {
    // タスクの初期化に失敗してもプロフィール自体の作成は成功しているため、
    // ここでは失敗を握りつぶさずログのみ残す。
    // 以降の getTasks は null を返し、表示は getDefaultTasks の
    // フォールバックに頼ることになるが、致命的ではない。
    console.error('insert initial event_memos error:', tasksInsertError);
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

  // サーバー側最終防御: tasks が undefined/null など不正な形で
  // 渡ってきた場合に既存データを破壊しないようガードする。
  // 通常のフローでは Array であることが保証されているが、
  // クライアント側のバグや想定外の呼び出し経路に備えて防御的にチェックする。
  if (!Array.isArray(tasks)) {
    console.error(
      `[saveTasks] eventKey=${eventKey} の保存をスキップしました: tasks が配列ではありません。`,
      tasks
    );
    return;
  }

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

// ----------------------------
// リセット
// ----------------------------

/**
 * 指定した child_profile_id に紐づく event_memos を明示的に全削除する。
 *
 * child_profiles 側の外部キーに ON DELETE CASCADE が設定されていない場合、
 * child_profiles だけを削除すると event_memos に孤立行が残り続け、
 * その孤立データが後続の新規プロフィールに誤って紐づいて参照される
 * （空配列のタスクが新規プロフィールでも表示・保存されてしまう）
 * 事故につながる。DB側の制約に依存せず、アプリケーション側で
 * 確実に削除しておくことで、リセット後は必ず event_memos が
 * クリーンな状態になることを保証する。
 */
export async function deleteAllTasks(childProfileId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from('event_memos')
    .delete()
    .eq('child_profile_id', childProfileId);

  if (error) {
    console.error('deleteAllTasks error:', error);
    return false;
  }
  return true;
}