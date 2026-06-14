'use client';

import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import ChildForm from '@/components/ChildForm';
import Timeline from '@/components/Timeline';
import SettingsModal from '@/components/SettingsModal';
import ChildProfileModal from '@/components/ChildProfileModal';
import { computeKidsEvents } from '@/lib/events';
import type { ChildProfile, KidsEvent, Task } from '@/types';
import { saveChildProfileAction } from '../app/actions/profile';

interface Props {
  userName: string;
  initialProfile: ChildProfile | null;
  initialEvents: KidsEvent[];
  initialTaskMap: Record<string, Task[]>;
}

export default function HomeClient({
  userName,
  initialProfile,
  initialEvents,
  initialTaskMap,
}: Props) {
  const [profile, setProfile] = useState<ChildProfile | null>(initialProfile);
  const [events, setEvents] = useState<KidsEvent[]>(initialEvents);
  const [taskMap] = useState<Record<string, Task[]>>(initialTaskMap);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // プロフィール未登録時は自動でモーダルを表示
  const [registrationOpen, setRegistrationOpen] = useState(!initialProfile);

  const handleProfileSubmit = async (newProfile: ChildProfile) => {
    const id = await saveChildProfileAction(newProfile);
    const saved = { ...newProfile, id: id ?? undefined };
    setProfile(saved);
    setEvents(computeKidsEvents(saved.birthDate));
    setRegistrationOpen(false);
  };

  const handleReset = () => {
    setProfile(null);
    setEvents([]);
    setRegistrationOpen(true);
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    setProfile((prev) => prev ? { ...prev, avatarUrl } : prev);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <AppHeader
        userName={userName}
        profile={profile}
        onAvatarClick={() => setSettingsOpen(true)}
      />

      <main className="max-w-5xl mx-auto px-4 py-8 md:px-6">
        {profile && events.length > 0 ? (
          <Timeline profile={profile} events={events} taskMap={taskMap} />
        ) : (
          // プロフィール登録済みでイベントがない場合のフォールバック
          !registrationOpen && <EmptyState />
        )}
      </main>

      {/* 初回登録モーダル */}
      {registrationOpen && (
        <ChildProfileModal onSubmit={handleProfileSubmit} />
      )}

      {/* 設定モーダル */}
      {settingsOpen && (
        <SettingsModal
          profile={profile}
          onClose={() => setSettingsOpen(false)}
          onReset={handleReset}
          onAvatarUpdate={handleAvatarUpdate}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center
                    min-h-[400px] bg-white rounded-2xl border border-stone-100
                    text-center p-8">
      <div className="text-4xl mb-4">🌿</div>
      <p className="text-sm font-medium text-stone-500">イベントがここに表示されます</p>
      <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
        お子さまの情報を登録してください
      </p>
    </div>
  );
}