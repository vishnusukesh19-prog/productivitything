import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const handleMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div
      ref={dotRef}
      className="custom-cursor"
      aria-hidden="true"
    />
  );
}


