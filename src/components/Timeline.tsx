import EventCard from './EventCard';
import type { ChildProfile, KidsEvent, Task } from '@/types';

interface Props {
  profile: ChildProfile;
  events: KidsEvent[];
  taskMap: Record<string, Task[]>;
}

export default function Timeline({ profile, events, taskMap }: Props) {
  return (
    <section aria-label={`${profile.name}のイベントスケジュール`}>
      <p className="text-[11px] font-medium text-stone-400 uppercase tracking-widest mb-4">
        {profile.name}のイベントスケジュール
      </p>
      <div className="relative pl-7">
        <div
          className="absolute left-2.5 top-3 bottom-3 w-px bg-stone-100"
          aria-hidden="true"
        />
        {events.map((event) => (
          <div key={event.key} className="relative mb-4 last:mb-0">
            <span
              className="absolute -left-4.5 top-3.5 w-2.5 h-2.5 rounded-full border-2"
              style={{
                background: event.colorScheme.dot,
                borderColor: event.colorScheme.dot,
              }}
              aria-hidden="true"
            />
            <EventCard
              event={event}
              childProfileId={profile.id!}
              initialTasks={taskMap[event.key] ?? []}
            />
          </div>
        ))}
      </div>
    </section>
  );
}