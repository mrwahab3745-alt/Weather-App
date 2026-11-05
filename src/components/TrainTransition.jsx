import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const trainVariants = {
  initial: {
    x: "100vw",
    filter: "blur(12px)",
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    x: 0,
    filter: "blur(0px)",
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 70, damping: 14, mass: 1 },
      filter: { duration: 0.4 },
      opacity: { duration: 0.3 },
    },
  },
  exit: {
    x: "-100vw",
    filter: "blur(12px)",
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

const speedLineVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: (i) => ({
    x: "-100%",
    opacity: [0, 0.8, 0],
    transition: {
      repeat: Infinity,
      duration: 0.25 + i * 0.05,
      ease: "linear",
    },
  }),
};

export default function TrainTransition({ children, activeKey }) {
  return (
    <div className="relative overflow-hidden w-full min-h-[400px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeKey}
          variants={trainVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full relative z-10"
        >
          <motion.div
            animate={{ y: [0, -4, 2, -1, 0] }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={speedLineVariants}
            initial="initial"
            animate="animate"
            className="h-[2px] bg-white rounded-full my-8 w-1/2"
            style={{ top: `${i * 20}%` }}
          />
        ))}
      </div>
    </div>
  );
}
