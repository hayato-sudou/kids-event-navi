import { addDays, addMonths } from 'date-fns';
import type { KidsEvent, EventKey } from '@/types';

type EventDefinition = {
  key: EventKey;
  name: string;
  description: string;
  computeDate: (birthDate: Date) => Date;
  colorScheme: KidsEvent['colorScheme'];
  icon: string;
};

const EVENT_DEFINITIONS: EventDefinition[] = [
  {
    key: 'omiyamairi',
    name: 'お宮参り',
    description: '生後約1ヶ月',
    computeDate: (birth) => addDays(birth, 30),
    colorScheme: {
      dot: '#a8b5a0',
      badgeBg: '#e8ede6',
      badgeText: '#3d4a39',
      iconBg: '#e8ede6',
    },
    icon: '⛩️',
  },
  {
    key: 'okuizome',
    name: 'お食い初め',
    description: '生後約100日',
    computeDate: (birth) => addDays(birth, 100),
    colorScheme: {
      dot: '#d4a5a0',
      badgeBg: '#f5ebe9',
      badgeText: '#5a2e29',
      iconBg: '#f5ebe9',
    },
    icon: '🍱',
  },
  {
    key: 'half',
    name: 'ハーフバースデー',
    description: '生後6ヶ月',
    computeDate: (birth) => addMonths(birth, 6),
    colorScheme: {
      dot: '#b0a8c8',
      badgeBg: '#eceaf4',
      badgeText: '#2e2a4a',
      iconBg: '#eceaf4',
    },
    icon: '🎂',
  },
  {
    key: 'birthday1',
    name: '1歳のお誕生日',
    description: '生後12ヶ月',
    computeDate: (birth) => addMonths(birth, 12),
    colorScheme: {
      dot: '#c8b888',
      badgeBg: '#f5f0e3',
      badgeText: '#4a3e18',
      iconBg: '#f5f0e3',
    },
    icon: '🎉',
  },
];

export function computeKidsEvents(birthDate: Date): KidsEvent[] {
  return EVENT_DEFINITIONS.map((def) => ({
    key: def.key,
    name: def.name,
    description: def.description,
    date: def.computeDate(birthDate),
    colorScheme: def.colorScheme,
    icon: def.icon,
  }));
}