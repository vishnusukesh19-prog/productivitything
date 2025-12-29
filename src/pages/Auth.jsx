// src/pages/Auth.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PokerBackground from "../components/PokerBackground";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [register, setRegister] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      if (register) {
        await createUserWithEmailAndPassword(auth, email, pw);
      } else {
        await signInWithEmailAndPassword(auth, email, pw);
      }
      navigate(redirectTo, { replace: true });
    } catch (e) {
      setErr(e.message);
    }
  }

  async function googleSignIn() {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate(redirectTo, { replace: true });
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <PokerBackground />
      <motion.div 
        className="relative z-10 max-w-md w-full poker-card p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mb-6 text-center"
          style={{ color: 'var(--poker-text)' }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {register ? "Create your workspace" : "Sign in to FlowSuite"}
        </motion.h1>

        <form onSubmit={submit} className="space-y-4">
          <motion.input
            className="poker-input w-full"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          />
          <motion.input
            className="poker-input w-full"
            placeholder="🔒 Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            type="password"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          />
          {err && (
            <motion.div 
              className="text-red-400 text-sm p-3 rounded-lg"
              style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {err}
            </motion.div>
          )}
          <motion.div 
            className="flex gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button 
              type="submit"
              className="poker-button flex-1"
            >
              {register ? "Register" : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => setRegister(!register)}
              className="poker-input px-4 py-2 hover:opacity-80 transition"
            >
              {register ? "Have account?" : "Create account"}
            </button>
          </motion.div>
        </form>

        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={googleSignIn}
            className="poker-button secondary w-full"
          >
            🌐 Continue with Google
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
