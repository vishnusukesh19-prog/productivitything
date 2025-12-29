import { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export function useBlocker() {
  const { user } = useAuth();
  const [blocked, setBlocked] = useState(false);
  const [blockedTime, setBlockedTime] = useState(0);

  useEffect(() => {
    if (!user) return;
    const blockerRef = doc(db, 'user_settings', user.uid);
    // Ensure document exists and hydrate initial state
    getDoc(blockerRef).then(async (snap) => {
      if (!snap.exists()) {
        await setDoc(blockerRef, { blocked: false, blockedStart: null, blockedEnd: null, blockedSites: [] });
        return;
      }
      const data = snap.data();
      if (data?.blocked) {
        setBlocked(true);
        setBlockedTime(data.blockedStart || Date.now());
      }
    });
  }, [user]);

  const startBlock = async () => {
    if (!user) return;
    setBlocked(true);
    setBlockedTime(Date.now());
    const blockerRef = doc(db, 'user_settings', user.uid);
    await updateDoc(blockerRef, { 
      blocked: true, 
      blockedStart: Date.now(), 
      blockedSites: ['twitter.com', 'instagram.com', 'facebook.com', 'youtube.com'] 
    });

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'blocker-overlay';
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; 
      background: rgba(0,0,0,0.9); z-index: 99999; display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: white; font-size: 2em; text-align: center; font-family: sans-serif;
    `;
    overlay.innerHTML = `
      <div style="margin-bottom: 1em;">🧠 Focus Mode Active</div>
      <p style="font-size: 0.6em; opacity: 0.8;">Stay productive—distractions blocked!</p>
      <button id="escape-focus" style="margin-top: 1em; padding: 0.5em 1em; background: teal; color: white; border: none; border-radius: 0.5em; cursor: pointer;" onclick="document.getElementById('blocker-overlay').remove(); window.location.reload();">Emergency Exit</button>
    `;
    document.body.appendChild(overlay);

    // Block navigation
    const originalUnload = window.onbeforeunload;
    window.onbeforeunload = () => 'Focus mode active—stay on task!';
  };

  const stopBlock = async () => {
    setBlocked(false);
    const duration = ((Date.now() - blockedTime) / 1000 / 60).toFixed(1);  // Minutes
    const blockerRef = doc(db, 'user_settings', user.uid);
    await updateDoc(blockerRef, { 
      blocked: false, 
      blockedEnd: Date.now(), 
      sessionDuration: parseFloat(duration) 
    });

    const overlay = document.getElementById('blocker-overlay');
    if (overlay) overlay.remove();
    window.onbeforeunload = null;
  };

  return { blocked, startBlock, stopBlock };
}