import { motion } from "framer-motion";

const stars = Array.from({ length: 20 }, (_, index) => ({
  top: `${5 + ((index * 37) % 88)}%`,
  left: `${4 + ((index * 53) % 92)}%`,
  size: 2 + (index % 3),
  duration: 2 + (index % 4) * 0.6,
  delay: (index % 7) * -0.5,
}));

export default function MoonEffect({ condition, isNight }) {
  const normalizedCondition =
    typeof condition === "string" ? condition.toLowerCase() : "";
  const isClear = normalizedCondition.includes("clear");

  if (!isNight || !isClear) return null;

  return (
    <div
      className="fixed inset-0 z-40 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {stars.map((star, index) => (
        <motion.div
          key={`star-${index}`}
          className="absolute rounded-full bg-white shadow-[0_0_8px_2px_rgba(219,234,254,0.75)]"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.25, 1, 0.25],
            scale: [0.75, 1.2, 0.75],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className="absolute right-8 top-8 h-28 w-28 rounded-full bg-gradient-to-br from-white via-blue-100 to-slate-300 shadow-[0_0_35px_16px_rgba(191,219,254,0.35),0_0_110px_55px_rgba(129,165,220,0.16)]"
        animate={{ opacity: [0.88, 1, 0.88], scale: [1, 1.03, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/70 to-slate-300/20" />
      </motion.div>
    </div>
  );
}
