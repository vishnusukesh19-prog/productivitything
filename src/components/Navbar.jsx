import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import ThemeToggle from "./ThemeToggle";
import {
  CheckCircle2,
  Calendar,
  FileText,
  Clock,
  Flame,
  Trophy,
  UserCircle,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const brandName = "ProdHub";

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/");
    } catch (e) {
      console.error("Logout error", e);
    }
  }

  const navLinks = [
    { to: "/tasks", label: "Tasks", icon: CheckCircle2 },
    { to: "/calendar", label: "Calendar", icon: Calendar },
    { to: "/notes", label: "Notes", icon: FileText },
    { to: "/timer", label: "Timer", icon: Clock },
    { to: "/habits", label: "Habits", icon: Flame },
    { to: "/gamification", label: "Achievements", icon: Trophy },
  ];

  if (user) {
    return (
      <motion.nav
        className="navbar-bg sticky top-0 z-50 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/dashboard"
              className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-50 transition-all duration-300 group"
            >
              <motion.span
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 via-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg glow-primary"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                PH
              </motion.span>
              <span className="hidden sm:inline gradient-text font-heading text-2xl">
                {brandName}
              </span>
            </Link>
          </motion.div>

          <div className="flex items-center gap-3 md:gap-6 flex-wrap">
            <div className="hidden lg:flex items-center gap-1 text-sm md:text-base">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <motion.div key={link.to} whileHover={{ y: -2 }}>
                    <Link
                      to={link.to}
                      className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                        isActive
                          ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30"
                          : "text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary-500 dark:text-primary-400' : ''}`} />
                      <span>{link.label}</span>
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/profile"
                  className="text-sm md:text-base transition-all duration-300 flex items-center gap-2 font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="hidden xl:inline">Profile</span>
                </Link>
              </motion.div>
              <motion.span
                className="text-xs md:text-sm hidden md:block px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 text-primary-700 dark:text-primary-300 font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                {user.email.split("@")[0]}
              </motion.span>
              <motion.button
                onClick={handleLogout}
                className="btn-secondary text-sm px-4 md:px-5 py-2 font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>
    );
  }

  return (
    <motion.nav
      className="navbar-bg sticky top-0 z-50 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-50 transition-all duration-300"
          >
            <motion.span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 via-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg glow-primary"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              PH
            </motion.span>
            <span className="gradient-text font-heading text-2xl">
              {brandName}
            </span>
          </Link>
        </motion.div>

        <div className="flex gap-4 md:gap-6 items-center">
          <ThemeToggle />
          <motion.div className="hidden md:flex items-center gap-4">
            <Link
              to="/features"
              className="text-sm md:text-base transition-all duration-300 font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Features
            </Link>
            <Link
              to="/screenshots"
              className="text-sm md:text-base transition-all duration-300 font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Screenshots
            </Link>
            <Link
              to="/user-flow"
              className="text-sm md:text-base transition-all duration-300 font-semibold text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              User Flow
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/auth"
              className="btn-primary text-sm md:text-base px-5 md:px-6 py-2.5 font-bold"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
