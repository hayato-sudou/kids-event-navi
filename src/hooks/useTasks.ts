import { useState, useEffect, useCallback } from 'react';
import type { EventKey, Task } from '@/types';
import { loadTasks, saveTasks } from '@/lib/taskStorage';

export function useTasks(eventKey: EventKey) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // 初回マウント時にlocalStorageから読み込む
  useEffect(() => {
    setTasks(loadTasks(eventKey));
  }, [eventKey]);

  // tasks変化のたびに永続化
  useEffect(() => {
    if (tasks.length === 0) return;
    saveTasks(eventKey, tasks);
  }, [eventKey, tasks]);

  const toggle = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
    );
  }, []);

  const add = useCallback((label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, label: trimmed, checked: false },
    ]);
  }, []);

  const remove = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const checkedCount = tasks.filter((t) => t.checked).length;

  return { tasks, toggle, add, remove, checkedCount };
}