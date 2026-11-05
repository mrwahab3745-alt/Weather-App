import React from 'react';
import { motion } from 'framer-motion';

const stormVariants = {
  rest: { x: "0%", y: 0, rotate: 0, scale: 1 },
  scatter: {
    x: ["0%", "-6%", "8%", "-3%", "0%"],
    y: [0, -24, 8, -12, 0],
    rotate: [0, -4, 3, -2, 0],
    scale: [1, 0.98, 1.01, 0.99, 1],
    transition: {
      duration: 1.8,
      ease: "easeInOut",
      times: [0, 0.3, 0.6, 0.82, 1],
    },
  },
};

export default function StormScatter({ children, isWindy, windSpeed = 0 }) {
  const shouldScatter = Boolean(isWindy) || windSpeed > 10;

  return (
    <motion.div
      variants={stormVariants}
      initial="rest"
      animate={shouldScatter ? "scatter" : "rest"}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
