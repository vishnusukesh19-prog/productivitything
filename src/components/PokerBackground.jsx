import React from 'react';

export default function PokerBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden poker-table">
      <div className="absolute inset-0 felt-pattern opacity-40" />
    </div>
  );
}
