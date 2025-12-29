import React from "react";

export default function Badge({ badgeId, size = 32 }) {
  const getBadgeSVG = (id) => {
    if (id.includes('pomodoro-marathon')) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="teal" />
          <text x="12" y="16" textAnchor="middle" fontSize="8" fill="white">🏆</text>
        </svg>
      );
    }
    // Add more badges
    return <div className="w-{size} h-{size} bg-gray-600 rounded" />;
  };

  return getBadgeSVG(badgeId);
}