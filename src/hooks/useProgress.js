import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState({ points: 0, streaks: {}, badges: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress({ points: 0, streaks: {}, badges: [] });
      setLoading(false);
      return;
    }
    const progressRef = doc(db, 'user_progress', user.uid);
    const unsub = onSnapshot(progressRef, (snap) => {
      setProgress(snap.data() || { points: 0, streaks: {}, badges: [] });
      setLoading(false);
    }, (error) => console.error('Progress sync error:', error));
    return unsub;
  }, [user]);

  const addPoints = async (amount, reason = '') => {
    if (!user) return;
    const progressRef = doc(db, 'user_progress', user.uid);
    const snap = await getDoc(progressRef);
    if (!snap.exists()) {
      await setDoc(progressRef, { points: 0, streaks: {}, badges: [] });
    }
    await updateDoc(progressRef, { points: (snap.data()?.points || 0) + amount });
    console.log(`+${amount} points for ${reason}`);
  };

  const updateStreak = async (habitId, completed = true) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const currentStreak = progress.streaks[habitId] || 0;
    const newStreak = completed ? currentStreak + 1 : 0;
    const progressRef = doc(db, 'user_progress', user.uid);
    await updateDoc(progressRef, { 
      [`streaks.${habitId}`]: newStreak 
    });
    if (newStreak % 7 === 0) {  // Weekly badge
      await updateDoc(progressRef, { 
        badges: [...progress.badges, { id: `streak-${habitId}-week${Math.floor(newStreak/7)}`, unlocked: new Date().toISOString() }] 
      });
    }
    addPoints(newStreak * 5, `Streak update for ${habitId}`);
  };

  const unlockBadge = async (badgeId) => {
    if (!user) return;
    const progressRef = doc(db, 'user_progress', user.uid);
    const snap = await getDoc(progressRef);
    if (!snap.exists()) {
      await setDoc(progressRef, { points: 0, streaks: {}, badges: [] });
    }
    const existingBadges = snap.data()?.badges || [];
    await updateDoc(progressRef, { 
      badges: [...existingBadges, { id: badgeId, unlocked: new Date().toISOString() }] 
    });
    addPoints(50, `Badge unlocked: ${badgeId}`);
  };

  return { progress, loading, addPoints, updateStreak, unlockBadge };
}