import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const EMPTY_PROGRESS = {
  points: 0,
  streaks: {},
  badges: [],
  claimedQuests: [],
};

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(EMPTY_PROGRESS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress(EMPTY_PROGRESS);
      setLoading(false);
      return;
    }
    const progressRef = doc(db, 'user_progress', user.uid);
    const unsub = onSnapshot(
      progressRef,
      (snap) => {
        const data = snap.data() || EMPTY_PROGRESS;
        setProgress({
          points: data.points || 0,
          streaks: data.streaks || {},
          badges: data.badges || [],
          claimedQuests: data.claimedQuests || [],
        });
        setLoading(false);
      },
      (error) => {
        console.error('Progress sync error:', error);
        setLoading(false);
      }
    );
    return unsub;
  }, [user]);

  const ensureDoc = async () => {
    if (!user) return null;
    const progressRef = doc(db, 'user_progress', user.uid);
    const snap = await getDoc(progressRef);
    if (!snap.exists()) {
      await setDoc(progressRef, EMPTY_PROGRESS);
      return { ref: progressRef, data: EMPTY_PROGRESS };
    }
    return { ref: progressRef, data: snap.data() || EMPTY_PROGRESS };
  };

  const addPoints = async (amount, reason = '') => {
    if (!user) return;
    const existing = await ensureDoc();
    if (!existing) return;
    const currentPoints = existing.data.points || 0;
    await updateDoc(existing.ref, { points: currentPoints + amount });
    console.log(`${amount >= 0 ? '+' : ''}${amount} points for ${reason}`);
  };

  const updateStreak = async (habitId, completed = true) => {
    if (!user) return;
    const existing = await ensureDoc();
    if (!existing) return;
    const currentStreak = existing.data.streaks?.[habitId] || 0;
    const newStreak = completed ? currentStreak + 1 : 0;
    const progressRef = existing.ref;

    await updateDoc(progressRef, {
      [`streaks.${habitId}`]: newStreak,
    });

    if (newStreak > 0 && newStreak % 7 === 0) {
      // Weekly badge
      const existingBadges = existing.data.badges || [];
      await updateDoc(progressRef, {
        badges: [
          ...existingBadges,
          {
            id: `streak-${habitId}-week${Math.floor(newStreak / 7)}`,
            unlocked: new Date().toISOString(),
          },
        ],
      });
    }
    await addPoints(newStreak * 5, `Streak update for ${habitId}`);
  };

  const unlockBadge = async (badgeId) => {
    if (!user) return;
    const existing = await ensureDoc();
    if (!existing) return;
    const progressRef = existing.ref;
    const existingBadges = existing.data.badges || [];
    // Avoid duplicating the same badge
    if (existingBadges.some((b) => b.id === badgeId)) return;

    await updateDoc(progressRef, {
      badges: [
        ...existingBadges,
        { id: badgeId, unlocked: new Date().toISOString() },
      ],
    });
    await addPoints(50, `Badge unlocked: ${badgeId}`);
  };

  const claimQuest = async (questId, rewardPoints) => {
    if (!user) return;
    const existing = await ensureDoc();
    if (!existing) return;

    const alreadyClaimed =
      (existing.data.claimedQuests || []).includes(questId);
    if (alreadyClaimed) return;

    const progressRef = existing.ref;
    await updateDoc(progressRef, {
      claimedQuests: arrayUnion(questId),
      points: (existing.data.points || 0) + rewardPoints,
    });
  };

  return { progress, loading, addPoints, updateStreak, unlockBadge, claimQuest };
}