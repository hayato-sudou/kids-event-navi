import { addDays, addMonths } from 'date-fns';
import type { KidsEvent, EventKey } from '@/types';

type EventDefinition = {
  key: EventKey;
  name: string;
  description: string;
  detail: string;        // ← 追加
  computeDate: (birthDate: Date) => Date;
  colorScheme: KidsEvent['colorScheme'];
  icon: string;
};

const EVENT_DEFINITIONS: EventDefinition[] = [
  {
    key: 'omiyamairi',
    name: 'お宮参り',
    description: '生後約1ヶ月',
    detail: '赤ちゃんの誕生を氏神様に報告し、健やかな成長を祈る伝統行事。生後30日前後に両家の祖父母と両親で近くの神社へ参拝するのが一般的です。',
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
    detail: '「一生食べ物に困らないように」と願いを込めて行う儀式。生後100日頃に家族や祖父母が集まり、鯛・赤飯・汁物などの祝い膳を赤ちゃんに食べさせる真似をします。',
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
    detail: '生後半年を家族でお祝いする近年広まったイベント。寝相アートや飾り付けで写真を撮るのが定番で、離乳食が始まる時期とも重なり成長を実感できる節目です。',
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
    detail: '初めての誕生日を家族・親族みんなでお祝いする大切な節目。一升餅を背負わせたり、選び取りで将来を占う伝統的な風習も各地で行われています。',
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
    detail: def.detail,  // ← 追加
    date: def.computeDate(birthDate),
    colorScheme: def.colorScheme,
    icon: def.icon,
  }));
}