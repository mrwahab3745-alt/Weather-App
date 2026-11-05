import React from 'react';
import { motion } from 'framer-motion';

export default function RainEffect({ condition }) {
  const normalizedCondition =
    typeof condition === 'string' ? condition.toLowerCase() : '';
  const isRaining =
    normalizedCondition.includes('rain') ||
    normalizedCondition.includes('drizzle');

  if (!isRaining) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Falling Rain Streaks */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -100, x: `${(i * 37) % 100}vw`, opacity: 0 }}
          animate={{
            y: '100vh',
            opacity: [0, 0.95, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.8 + (i % 5) * 0.12,
            ease: 'linear',
            delay: (i % 10) * 0.14,
          }}
          className="absolute w-[2px] h-16 bg-gradient-to-b from-transparent via-sky-200/90 to-white rounded-full shadow-[0_0_8px_rgba(147,197,253,0.9)] blur-[0.5px]"
        />
      ))}

      {/* Screen Glass Water Droplets */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`drop-${i}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.35, 0.95, 0.35],
            scale: [0.8, 1.1, 0.9],
            y: [0, 15, 30],
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + (i % 4) * 0.5,
            ease: 'easeInOut',
            delay: (i % 6) * 0.3,
          }}
          className="absolute w-4 h-4 bg-sky-100/60 backdrop-blur-md rounded-full border border-white/80 shadow-[0_0_12px_rgba(191,219,254,0.9)]"
          style={{
            top: `${10 + (i * 19) % 75}%`,
            left: `${5 + (i * 31) % 90}%`,
          }}
        />
      ))}
    </div>
  );
}