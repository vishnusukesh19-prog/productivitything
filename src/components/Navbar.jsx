import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useTheme } from "../hooks/useTheme";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme, themes } = useTheme();
  const brandName = "FlowSuite";

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/");
    } catch (e) {
      console.error("Logout error", e);
    }
  }

  if (user) {
    return (
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ background: 'rgba(7,11,24,0.7)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold flex items-center gap-2 text-white">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-xs font-semibold border border-white/20">FS</span>
            <span className="hidden sm:inline">{brandName}</span>
          </Link>
          <div className="flex items-center gap-3 md:gap-5 flex-wrap">
            <div className="hidden lg:flex items-center gap-4 text-sm md:text-base text-white/70">
              <Link to="/tasks" className="transition-colors hover:text-white">
                Tasks
              </Link>
              <Link to="/calendar" className="transition-colors hover:text-white">
                Calendar
              </Link>
              <Link to="/notes" className="transition-colors hover:text-white">
                Notes
              </Link>
              <Link to="/timer" className="transition-colors hover:text-white">
                Timer
              </Link>
              <Link to="/habits" className="transition-colors hover:text-white">
                Habits
              </Link>
              <Link to="/gamification" className="transition-colors hover:text-white">
                Achievements
              </Link>
            </div>
            <select 
              onChange={(e) => toggleTheme(e.target.value)} 
              value={theme} 
              className="poker-input text-sm px-3 py-2 bg-white/5 border border-white/10"
            >
              {themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <div className="flex items-center gap-2 md:gap-3">
              <Link to="/profile" className="text-sm md:text-base transition-all duration-300 flex items-center gap-1 text-white/80 hover:text-white">
                <span className="hidden xl:inline">Profile</span>
              </Link>
              <span className="text-xs md:text-sm hidden md:block text-white/60">
                {user.email.split('@')[0]}
              </span>
              <button 
                onClick={handleLogout} 
                className="poker-button secondary text-sm px-3 md:px-4 py-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10" style={{ background: 'rgba(7,11,24,0.7)' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-white">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-xs font-semibold border border-white/20">FS</span>
          {brandName}
        </Link>
        <div className="flex gap-4 md:gap-6 items-center text-white/70">
          <Link to="/features" className="text-sm md:text-base transition-colors hover:text-white">
            Features
          </Link>
          <Link to="/screenshots" className="text-sm md:text-base transition-colors hover:text-white">
            Screenshots
          </Link>
          <Link to="/user-flow" className="text-sm md:text-base transition-colors hover:text-white">
            User Flow
          </Link>
          <Link to="/auth" className="poker-button text-sm md:text-base px-4 md:px-6 py-2">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}