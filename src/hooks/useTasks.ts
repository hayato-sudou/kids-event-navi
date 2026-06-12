import { useState, useEffect, useCallback } from 'react';
import type { EventKey, Task } from '@/types';
import { getDefaultTasks } from '@/lib/defaultTasks';
import { saveTasksAction } from '@/app/actions/tasks';

export function useTasks(eventKey: EventKey, childProfileId: string, initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // タスク変化のたびにDBに保存（debounce）
  useEffect(() => {
    if (!childProfileId) return;
    const timer = setTimeout(() => {
      saveTasksAction(eventKey, tasks);
    }, 500);
    return () => clearTimeout(timer);
  }, [eventKey, childProfileId, tasks]);

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