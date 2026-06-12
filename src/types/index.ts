export type EventKey = 'omiyamairi' | 'okuizome' | 'half' | 'birthday1';

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

export interface Task {
  id: string;
  label: string;
  checked: boolean;
}