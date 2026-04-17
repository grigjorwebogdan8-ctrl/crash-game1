import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket } from 'lucide-react';

interface RocketFlightProps {
  gameState: 'idle' | 'countdown' | 'in-progress' | 'crashed';
  multiplier: number;
  countdown: number;
}

export function RocketFlight({ gameState, multiplier, countdown }: RocketFlightProps) {
  // We'll generate a curved path for the rocket to follow visually
  // but simpler to just animate the rocket in a floating container and grow a line
  
  return (
    <div className="relative w-full h-64 overflow-hidden flex items-center justify-center">
      {/* Curved line background representing flight path */}
      <svg className="absolute bottom-0 left-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <pattern id="stars" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="25" r="0.6" fill="white" />
            <circle cx="75" cy="45" r="0.8" fill="white" />
            <circle cx="45" cy="75" r="0.5" fill="white" />
            <circle cx="85" cy="85" r="0.7" fill="white" />
            <circle cx="20" cy="10" r="0.5" fill="white" />
            <circle cx="80" cy="35" r="0.8" fill="white" />
            <circle cx="50" cy="30" r="0.4" fill="white" />
            <circle cx="10" cy="60" r="0.6" fill="white" />
            <circle cx="90" cy="50" r="0.5" fill="white" />
            <circle cx="70" cy="20" r="0.7" fill="white" />
            <circle cx="30" cy="15" r="0.9" fill="white" />
          </pattern>
        </defs>

        {/* Background Parallax Layer */}
        <motion.g 
          animate={{ y: gameState === 'in-progress' ? (multiplier - 1) * 5 : 0 }}
          transition={{ ease: "linear", duration: 0.1 }}
          opacity="0.5"
        >
          {/* Planets */}
          <circle cx="85" cy="-20" r="6" fill="#4B5563" />
          <ellipse cx="85" cy="-20" rx="10" ry="3" fill="none" stroke="#6B7280" strokeWidth="0.5" transform="rotate(-20 85 -20)" />
          
          <circle cx="20" cy="-120" r="3" fill="#374151" />
          
          <circle cx="75" cy="-250" r="5" fill="#1f2937" />
          <ellipse cx="75" cy="-250" rx="8" ry="2" fill="none" stroke="#374151" strokeWidth="0.5" transform="rotate(15 75 -250)" />
          
          <circle cx="15" cy="-400" r="4" fill="#4B5563" />
          
          {/* Infinite Stars Rectangle */}
          <rect x="0" y="-1000" width="100" height="1100" fill="url(#stars)" />
        </motion.g>

        {/* Second Static Star Layer for depth */}
        <rect x="0" y="0" width="100" height="100" fill="url(#stars)" opacity="0.3" />

        {gameState !== 'countdown' && gameState !== 'idle' && (
          <motion.path
            d={`M 0,100 Q ${50 - Math.min(1, (multiplier - 1) / 5) * 25},${90 - Math.min(1, (multiplier - 1) / 5) * 40} ${90 - Math.min(1, (multiplier - 1) / 5) * 40},${20 - Math.min(1, (multiplier - 1) / 5) * 20}`}
            fill="transparent"
            stroke="#eab308"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              gameState === 'in-progress' 
                ? { pathLength: 1, opacity: 1 } 
                : { opacity: 0 }
            }
            transition={{ duration: 5, ease: "linear" }}
          />
        )}
      </svg>

      {/* The Rocket */}
      <AnimatePresence>
        {gameState !== 'crashed' && gameState !== 'idle' && (
          <motion.div
            className="absolute z-10"
            initial={false}
            animate={
              gameState === 'countdown'
                ? { x: '-30vw', y: '10vh', rotate: 45 }
                : { 
                    x: ['-30vw', '10vw'], 
                    y: ['10vh', '-10vh'], 
                    rotate: [45, 45 + (Math.random() * 5 - 2.5)],
                  }
            }
            transition={
              gameState === 'countdown'
                ? { duration: 0.5, ease: 'easeOut' }
                : { duration: 5, ease: 'easeOut', yoyo: Infinity }
            }
          >
            <motion.div
              animate={
                gameState === 'in-progress'
                  ? { y: [0, -5, 0, 5, 0], x: [0, 2, 0, -2, 0] }
                  : { y: [0, -2, 0], x: 0 }
              }
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="relative"
            >
              <Rocket size={64} className="text-yellow-400 fill-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
              {/* Exhaust flame */}
              {gameState === 'in-progress' && (
                <motion.div 
                  className="absolute -bottom-6 -left-6 w-8 h-8 bg-orange-500 rounded-full blur-md opacity-80"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 0.2 }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explosion on Crash */}
      <AnimatePresence>
        {gameState === 'crashed' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-full h-full pointer-events-none">
            {/* Particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-red-500 rounded-full"
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: Math.cos(i * 30 * Math.PI / 180) * 150 * Math.random(),
                  y: Math.sin(i * 30 * Math.PI / 180) * 150 * Math.random(),
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            ))}
            {/* Core flash */}
            <motion.div
              className="absolute z-20 flex flex-col items-center justify-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.5, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="w-48 h-48 bg-orange-600 rounded-full blur-[40px] absolute -inset-8 mix-blend-screen opacity-80" />
              <div className="w-20 h-20 bg-white rounded-full blur-[20px] absolute inset-4 mix-blend-screen opacity-90" />
              <span className="relative z-30 text-white font-black text-3xl drop-shadow-[0_0_15px_rgba(255,0,0,0.8)] mt-24">
                КРАШ!
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Multiplier / Countdown Display */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-30 pointer-events-none">
        {gameState === 'idle' ? (
          <motion.div 
            key="idle"
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-lg uppercase tracking-widest text-slate-300 font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              Ждем ставок
            </span>
          </motion.div>
        ) : gameState === 'countdown' ? (
          <motion.div 
            key="countdown"
            className="flex flex-col items-center justify-center relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="#1e293b" strokeWidth="6" />
                <motion.circle
                  cx="50" cy="50" r="46" fill="none" stroke="#facc15" strokeWidth="6" strokeLinecap="round"
                  initial={{ strokeDasharray: "289", strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: 289 - (Math.max(0, countdown) / 5.0) * 289 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <div className="text-4xl font-black text-yellow-400 font-mono tracking-tighter drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                  {Math.max(0, countdown).toFixed(1)}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Взлет</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="multiplier"
            className={`text-6xl font-black tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] ${gameState === 'crashed' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-white'}`}
            animate={gameState === 'crashed' ? { scale: [1, 1.1, 1], x: [-5, 5, -5, 5, 0] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {multiplier.toFixed(2)}<span className="text-3xl ml-1 text-slate-300">x</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
