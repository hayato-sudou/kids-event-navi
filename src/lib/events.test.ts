import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadTasks, saveTasks } from './taskStorage';
import { getDefaultTasks } from './defaultTasks';

// localStorageをモック
const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();

beforeEach(() => {
  storageMock.clear();
  vi.stubGlobal('localStorage', storageMock);
});

describe('loadTasks', () => {
  it('未保存の場合はデフォルトタスクを返す', () => {
    const tasks = loadTasks('omiyamairi');
    expect(tasks).toEqual(getDefaultTasks('omiyamairi'));
  });

  it('保存済みデータを復元する', () => {
    const saved = [{ id: 'user-1', label: 'テスト', checked: true }];
    storageMock.setItem('tasks:omiyamairi', JSON.stringify(saved));
    expect(loadTasks('omiyamairi')).toEqual(saved);
  });

  it('不正なJSONの場合はデフォルトタスクにフォールバックする', () => {
    storageMock.setItem('tasks:omiyamairi', 'invalid json');
    expect(loadTasks('omiyamairi')).toEqual(getDefaultTasks('omiyamairi'));
  });
});

describe('saveTasks', () => {
  it('タスクをlocalStorageに保存する', () => {
    const tasks = [{ id: '1', label: 'テスト', checked: false }];
    saveTasks('okuizome', tasks);
    const raw = storageMock.getItem('tasks:okuizome');
    expect(JSON.parse(raw!)).toEqual(tasks);
  });
});