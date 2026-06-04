export type EventKey = 'omiyamairi' | 'okuizome' | 'half' | 'birthday1';

export interface ChildProfile {
  name: string;
  birthDate: Date;
}

export interface KidsEvent {
  key: EventKey;
  name: string;
  description: string;
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