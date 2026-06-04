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

// イベント追加・変更時はここだけ修正する（Open/Closed原則）
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

/**
 * 生年月日からイベント一覧を生成する純粋関数
 */
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

import { describe, it, expect } from 'vitest';
import { computeKidsEvents } from './events';

describe('computeKidsEvents', () => {
  const BIRTH = new Date('2024-01-01');

  it('4つのイベントを返す', () => {
    expect(computeKidsEvents(BIRTH)).toHaveLength(4);
  });

  it('お宮参りは生後30日後', () => {
    const events = computeKidsEvents(BIRTH);
    const omiya = events.find((e) => e.key === 'omiyamairi')!;
    expect(omiya.date).toEqual(new Date('2024-01-31'));
  });

  it('お食い初めは生後100日後', () => {
    const events = computeKidsEvents(BIRTH);
    const okuizome = events.find((e) => e.key === 'okuizome')!;
    expect(okuizome.date).toEqual(new Date('2024-04-10'));
  });

  it('ハーフバースデーは生後6ヶ月後', () => {
    const events = computeKidsEvents(BIRTH);
    const half = events.find((e) => e.key === 'half')!;
    expect(half.date).toEqual(new Date('2024-07-01'));
  });

  it('1歳誕生日は生後12ヶ月後', () => {
    const events = computeKidsEvents(BIRTH);
    const birthday = events.find((e) => e.key === 'birthday1')!;
    expect(birthday.date).toEqual(new Date('2025-01-01'));
  });

  it('イベントは日付昇順になっている', () => {
    const events = computeKidsEvents(BIRTH);
    for (let i = 1; i < events.length; i++) {
      expect(events[i].date.getTime()).toBeGreaterThan(
        events[i - 1].date.getTime()
      );
    }
  });
});