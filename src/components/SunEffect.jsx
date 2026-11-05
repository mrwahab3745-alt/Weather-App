import { motion } from 'framer-motion';

const lensFlares = [
  { top: '18%', left: '78%', size: 34, shape: 'circle' },
  { top: '30%', left: '65%', size: 22, shape: 'hexagon' },
  { top: '43%', left: '52%', size: 42, shape: 'circle' },
  { top: '57%', left: '38%', size: 18, shape: 'hexagon' },
  { top: '70%', left: '24%', size: 28, shape: 'circle' },
];

const dustParticles = Array.from({ length: 18 }, (_, index) => ({
  top: `${8 + ((index * 37) % 82)}%`,
  left: `${8 + ((index * 53) % 84)}%`,
  size: 2 + (index % 3),
  duration: 9 + (index % 6) * 2,
  delay: (index % 7) * -1.7,
}));

export default function SunEffect({ condition }) {
  const normalizedCondition =
    typeof condition === 'string' ? condition.toLowerCase() : '';
  const isSunny =
    normalizedCondition.includes('clear') ||
    normalizedCondition.includes('sun');

  if (!isSunny) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute h-[130vmax] w-[130vmax] rounded-full"
        style={{
          top: 'calc(4rem - 65vmax)',
          left: 'calc(100% - 4rem - 65vmax)',
          transformOrigin: 'center',
          background:
            'conic-gradient(from 0deg, transparent 0deg, rgba(255,235,150,0.12) 9deg, transparent 18deg, rgba(255,211,105,0.2) 32deg, transparent 44deg, rgba(255,245,190,0.12) 58deg, transparent 72deg, rgba(255,211,105,0.18) 88deg, transparent 104deg, rgba(255,235,150,0.14) 122deg, transparent 140deg, rgba(255,211,105,0.2) 158deg, transparent 176deg, rgba(255,245,190,0.12) 194deg, transparent 212deg, rgba(255,211,105,0.18) 230deg, transparent 248deg, rgba(255,235,150,0.14) 266deg, transparent 284deg, rgba(255,211,105,0.2) 302deg, transparent 320deg, rgba(255,245,190,0.12) 338deg, transparent 360deg)',
          maskImage: 'radial-gradient(circle, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 70%)',
        }}
        animate={{ rotate: 360, opacity: [0.55, 0.9, 0.55] }}
        transition={{
          rotate: { duration: 100, repeat: Infinity, ease: 'linear' },
          opacity: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      <motion.div
        className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-amber-300/50 blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute right-8 top-8 h-28 w-28 rounded-full bg-gradient-to-br from-white via-yellow-100 to-amber-400 shadow-[0_0_35px_16px_rgba(255,211,91,0.65),0_0_110px_55px_rgba(255,174,45,0.3)]"
        animate={{ scale: [1, 1.04, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/90 to-amber-200/30 blur-sm" />
      </motion.div>

      {lensFlares.map((flare, index) => (
        <motion.div
          key={`flare-${index}`}
          className="absolute border border-amber-100/50 bg-amber-100/20 shadow-[0_0_22px_rgba(255,220,140,0.45)] backdrop-blur-[1px]"
          style={{
            top: flare.top,
            left: flare.left,
            width: flare.size,
            height: flare.size,
            borderRadius: flare.shape === 'circle' ? '50%' : '20%',
            clipPath:
              flare.shape === 'hexagon'
                ? 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%)'
                : undefined,
          }}
          animate={{ opacity: [0.18, 0.55, 0.2], scale: [0.9, 1.08, 0.9] }}
          transition={{
            duration: 5 + index,
            delay: index * 0.35,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {dustParticles.map((particle, index) => (
        <motion.div
          key={`dust-${index}`}
          className="absolute rounded-full bg-amber-100 shadow-[0_0_8px_2px_rgba(255,205,100,0.75)]"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: [0, index % 2 === 0 ? 24 : -20, 0],
            y: [0, -28 - (index % 4) * 8, 0],
            opacity: [0.1, 0.75, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
