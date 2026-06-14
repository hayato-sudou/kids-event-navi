import type { EventKey, Task } from '@/types';
import { getDefaultTasks as getFromMaster } from './taskMaster';

export function getDefaultTasks(eventKey: EventKey): Task[] {
  return getFromMaster(eventKey);
}