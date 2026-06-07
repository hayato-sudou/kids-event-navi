import type { EventKey, Task } from '@/types';
import { getDefaultTasks } from './defaultTasks';

const storageKey = (eventKey: EventKey) => `tasks:${eventKey}`;

export function loadTasks(eventKey: EventKey): Task[] {
  try {
    const raw = localStorage.getItem(storageKey(eventKey));
    if (!raw) return getDefaultTasks(eventKey);
    return JSON.parse(raw) as Task[];
  } catch {
    return getDefaultTasks(eventKey);
  }
}

export function saveTasks(eventKey: EventKey, tasks: Task[]): void {
  try {
    localStorage.setItem(storageKey(eventKey), JSON.stringify(tasks));
  } catch {
    // ストレージ容量超過などは無視
  }
}