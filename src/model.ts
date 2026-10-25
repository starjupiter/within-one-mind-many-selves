export type Session = {
  id: string;
  title: string;
  callSign: string;
  intention: string;
  observations: string;
  impressions: string;
  experience: string;
  revisit: boolean;
  tags: string[];
  startedAt: string;
  completedAt: string;
  plannedSeconds: number;
  elapsedSeconds: number;
  audioId?: string;
};

export type Settings = {
  sound: boolean;
  volume: number;
  motion: 'full' | 'subtle' | 'off';
  voice: boolean;
  duration: 1 | 3 | 5 | 10;
};

export const defaultSettings: Settings = {
  sound: false, volume: 25, motion: 'subtle', voice: false, duration: 3,
};

export type Stage = 'preparation' | 'intention' | 'focus' | 'expression' | 'reflection' | 'complete';

export type Draft = {
  title: string;
  callSign: string;
  intention: string;
  observations: string;
  impressions: string;
  experience: string;
  revisit: boolean;
  tags: string;
  duration: 1 | 3 | 5 | 10;
  startedAt: string;
  elapsedSeconds: number;
  audioId?: string;
};

export const freshDraft = (duration: Settings['duration']): Draft => ({
  title: '', callSign: '', intention: '', observations: '', impressions: '', experience: '',
  revisit: false, tags: '', duration, startedAt: '', elapsedSeconds: 0,
});
