export interface ChildProfile {
  id?: string;          // DB保存後に付与
  name: string;
  birthDate: Date;
}

export interface KidsEvent {
  key: EventKey;
  name: string;
  description: string;
  detail: string;
  date: Date;
  colorScheme: EventColorScheme;
  icon: string;
}

export interface EventColorScheme {
  dot: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
}
export const EVENT_KEYS = ['omiyamairi', 'okuizome', 'half', 'birthday1'] as const;
export type EventKey = (typeof EVENT_KEYS)[number];

export interface Task {
  id: string;
  label: string;          // 概要
  description?: string;   // 詳細（ユーザー追加タスクは持たない）
  checked: boolean;
}

/** タスクマスタの1項目 */
export interface TaskMasterItem {
  key: string;            // イベント内で一意な安定キー
  label: string;          // 概要
  description: string;    // 詳細
}