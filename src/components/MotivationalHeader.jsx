import React from "react";
import { motion } from "framer-motion";

const quotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Don't watch the clock; do what it does. Keep going.",
  "The only way to do great work is to love what you do.",
  "Excellence is not a skill, it's an attitude.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
];

export default function MotivationalHeader() {
  const today = new Date();
  const quoteIndex = today.getDate() % quotes.length;
  const quote = quotes[quoteIndex];

  return (
    <motion.div
      className="header-gradient"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.p
          className="text-white text-lg md:text-xl lg:text-2xl font-medium leading-relaxed px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          "{quote}"
        </motion.p>
      </div>
    </motion.div>
  );
}





