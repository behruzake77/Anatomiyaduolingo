import { useEffect, useState } from 'react';
import type { OrganId } from '../data/anatomy';

export interface LearningSession {
  organ: OrganId;
  date: string;
  xp: number;
  correct: number;
  total: number;
}

export interface LearningProgress {
  xp: number;
  streak: number;
  anatomy: number;
  achievements: number;
  completed: OrganId[];
  sessions: LearningSession[];
  lastStudyDate: string;
}

const storageKey = 'corpus-learning-v1';
const initialProgress: LearningProgress = {
  xp: 1240,
  streak: 7,
  anatomy: 68,
  achievements: 12,
  completed: ['brain', 'skeleton'],
  sessions: [],
  lastStudyDate: new Date().toISOString().slice(0, 10),
};

function readProgress(): LearningProgress {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved) as LearningProgress;
      if (Number.isFinite(data.xp) && Number.isFinite(data.streak) && Number.isFinite(data.anatomy) && Number.isFinite(data.achievements) && Array.isArray(data.completed) && Array.isArray(data.sessions) && typeof data.lastStudyDate === 'string') return data;
    }
  } catch { /* Private browsing can disable local storage. Learning still works. */ }
  return initialProgress;
}

export function useLearningProgress() {
  const [progress, setProgress] = useState<LearningProgress>(readProgress);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch { /* Keep the current session usable when storage is unavailable. */ }
  }, [progress]);

  function completeLesson(organ: OrganId, xp: number, correct: number, total: number) {
    setProgress((previous) => {
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      return {
        xp: previous.xp + xp,
        streak: previous.lastStudyDate === today ? previous.streak : previous.lastStudyDate === yesterday ? previous.streak + 1 : 1,
        anatomy: Math.min(100, previous.anatomy + Math.max(1, correct)),
        achievements: previous.achievements + ((previous.sessions.length + 1) % 3 === 0 ? 1 : 0),
        completed: Array.from(new Set([...previous.completed, organ])),
        sessions: [{ organ, xp, correct, total, date: new Date().toISOString() }, ...previous.sessions].slice(0, 30),
        lastStudyDate: today,
      };
    });
  }

  return { progress, completeLesson };
}