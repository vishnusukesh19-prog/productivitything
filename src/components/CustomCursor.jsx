import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

export default function CustomCursor() {
  const { theme } = useTheme();
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Check for hoverable elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] mix-blend-difference"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
      }}
    >
      {/* Outer glow ring */}
      <motion.div
        className={`absolute inset-0 rounded-full ${
          theme === 'dark' ? 'bg-primary-500' : 'bg-primary-600'
        }`}
        style={{
          width: isHovering ? '24px' : '16px',
          height: isHovering ? '24px' : '16px',
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
          filter: 'blur(8px)',
          opacity: 0.6,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Main cursor dot */}
      <motion.div
        className={`rounded-full ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-primary-400 to-purple-500'
            : 'bg-gradient-to-br from-primary-500 to-indigo-600'
        }`}
        style={{
          width: isHovering ? '20px' : '12px',
          height: isHovering ? '20px' : '12px',
          boxShadow: `0 0 ${isHovering ? '20px' : '10px'} ${
            theme === 'dark' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(99, 102, 241, 0.6)'
          }`,
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Inner highlight */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white"
        style={{
          width: isHovering ? '8px' : '4px',
          height: isHovering ? '8px' : '4px',
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
          opacity: 0.8,
        }}
      />
    </motion.div>
  );
}
