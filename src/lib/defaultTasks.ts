import type { EventKey, Task } from '@/types';

const RAW: Record<EventKey, string[]> = {
  omiyamairi: [
    '神社・お寺を予約する',
    '祝い着（産着）を用意する',
    '写真館を予約する',
    '食事会の場所を決める',
    '両家祖父母に連絡する',
    'ご祈祷の初穂料を準備する',
  ],
  okuizome: [
    'お食い初めの食器セットを用意する',
    '歯固め石を準備する',
    'メニューを決める（鯛・赤飯・汁物など）',
    '料理を作る or 仕出しを注文する',
    '写真・動画を撮る準備をする',
    '両家祖父母を招待する',
  ],
  half: [
    'ハーフバースデーの飾り付けを用意する',
    '寝相アートの構成を考える',
    'カメラ・スマホの充電をする',
    '離乳食の進み具合を記録する',
    '半年間の成長をアルバムにまとめる',
  ],
  birthday1: [
    '一升餅を注文する',
    '選び取りカードを準備する',
    'バースデーケーキを予約する',
    '会場・自宅の飾り付けを用意する',
    '招待客に連絡する',
    '写真館を予約する',
    'プレゼントを用意する',
  ],
};

export function getDefaultTasks(eventKey: EventKey): Task[] {
  return RAW[eventKey].map((label, i) => ({
    id: `default-${i}`,
    label,
    checked: false,
  }));
}