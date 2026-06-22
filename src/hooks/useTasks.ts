import { useState, useEffect, useCallback, useRef } from 'react';
import type { EventKey, Task } from '@/types';
import { saveTasksAction } from '@/app/actions/tasks';

export function useTasks(eventKey: EventKey, childProfileId: string, initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const hasUserInteractedRef = useRef(false);

  const toggle = useCallback((id: string) => {
    hasUserInteractedRef.current = true;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
    );
  }, []);

  const add = useCallback((label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    hasUserInteractedRef.current = true;
    setTasks((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, label: trimmed, checked: false },
    ]);
  }, []);

  const remove = useCallback((id: string) => {
    hasUserInteractedRef.current = true;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!childProfileId) return;
    if (!hasUserInteractedRef.current) return;

    const timer = setTimeout(() => {
      saveTasksAction(eventKey, tasks);
    }, 500);
    return () => clearTimeout(timer);
  }, [eventKey, childProfileId, tasks]);

  const checkedCount = tasks.filter((t) => t.checked).length;

  return { tasks, toggle, add, remove, checkedCount };
}