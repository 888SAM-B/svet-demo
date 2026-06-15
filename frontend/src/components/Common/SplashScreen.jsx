import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Stage 1: Wait for 3.8 seconds, then trigger exit transition
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3800);

    // Stage 2: Wait for 4.3 seconds total, then call onComplete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4300);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Letter stagger animation config for SVET
  const logoContainer = {
    animate: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 1.0, // starts while the panels are splitting open
      }
    }
  };

  const logoLetter = {
    initial: { opacity: 0, y: 15 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#F9F7F7] flex flex-col items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(17, 45, 78, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(17, 45, 78, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center'
          }}
        >
          {/* Top-Left Diagonal Panel */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-30"
            style={{
              backgroundColor: '#112D4E',
              clipPath: 'polygon(0 0, 101% 0, 0 101%)',
              willChange: 'transform'
            }}
            initial={{ x: 0, y: 0 }}
            animate={{ x: '-101%', y: '-101%' }}
            transition={{ 
              delay: 0.65, 
              duration: 1.2, 
              ease: [0.76, 0, 0.24, 1] 
            }}
          />

          {/* Bottom-Right Diagonal Panel */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-30"
            style={{
              backgroundColor: '#112D4E',
              clipPath: 'polygon(100% -1%, 100% 100%, -1% 100%)',
              willChange: 'transform'
            }}
            initial={{ x: 0, y: 0 }}
            animate={{ x: '101%', y: '101%' }}
            transition={{ 
              delay: 0.65, 
              duration: 1.2, 
              ease: [0.76, 0, 0.24, 1] 
            }}
          />

          {/* Diagonal Split Lines (Overlaying the panels at z-40) */}
          <svg className="fixed inset-0 w-full h-full pointer-events-none z-40 overflow-visible">
            {/* Top-Left side of the line */}
            <motion.line
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
              stroke="#DBE2EF"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                x: [null, "-101%"],
                y: [null, "-101%"]
              }}
              transition={{
                pathLength: { delay: 0.1, duration: 0.5, ease: "easeOut" },
                x: { delay: 0.65, duration: 1.2, ease: [0.76, 0, 0.24, 1] },
                y: { delay: 0.65, duration: 1.2, ease: [0.76, 0, 0.24, 1] }
              }}
            />
            {/* Bottom-Right side of the line */}
            <motion.line
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
              stroke="#DBE2EF"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                x: [null, "101%"],
                y: [null, "101%"]
              }}
              transition={{
                pathLength: { delay: 0.1, duration: 0.5, ease: "easeOut" },
                x: { delay: 0.65, duration: 1.2, ease: [0.76, 0, 0.24, 1] },
                y: { delay: 0.65, duration: 1.2, ease: [0.76, 0, 0.24, 1] }
              }}
            />
          </svg>

          {/* Main Logo Container */}
          <div className="relative flex flex-col items-center justify-center select-none z-20">
            
            {/* SVET Letter Reveal */}
            <motion.div 
              variants={logoContainer}
              initial="initial"
              animate="animate"
              className="flex items-center gap-1"
            >
              {['S', 'V', 'E', 'T'].map((char, index) => (
                <motion.span
                  key={index}
                  variants={logoLetter}
                  className="font-display font-black text-7xl md:text-8xl tracking-wider text-primary-blue"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Trust Full Name */}
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.65, duration: 0.6, ease: "easeOut" }}
              className="font-sans font-extrabold text-xs md:text-sm uppercase tracking-[0.25em] text-secondary-text mt-5 text-center"
            >
              Sri Venkateshwara Educational Trust
            </motion.h2>

            {/* Sub-tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.25, duration: 0.6 }}
              className="font-display font-bold text-sm md:text-base uppercase tracking-[0.15em] text-secondary-blue mt-2.5 italic text-center"
            >
              Study Beyond Borders
            </motion.p>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
