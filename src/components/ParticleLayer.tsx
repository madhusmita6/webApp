/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Particle } from '../types';

interface ParticleLayerProps {
  particles: Particle[];
  effectType: 'snowflakes' | 'balloons' | null;
  onParticleComplete: (id: string) => void;
}

export const ParticleLayer: React.FC<ParticleLayerProps> = ({
  particles,
  effectType,
  onParticleComplete,
}) => {
  if (!effectType || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map((particle) => {
        const isSnowflake = effectType === 'snowflakes';

        return (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: `${particle.startY}vh`,
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              y: `${particle.endY}vh`,
              opacity: [0, 1, 1, 0.8, 0], // Soft fade in and fade out at the boundaries
              scale: 1,
            }}
            onAnimationComplete={() => onParticleComplete(particle.id)}
            transition={{
              y: { duration: particle.duration, ease: 'linear', delay: particle.delay },
              opacity: { duration: particle.duration, ease: 'easeInOut', delay: particle.delay, times: [0, 0.15, 0.8, 0.9, 1] },
              scale: { duration: 0.3, ease: 'easeOut', delay: particle.delay },
            }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              willChange: 'transform, opacity',
            }}
          >
            {/* Sway motion wrapper */}
            <motion.div
              animate={{
                x: [0, particle.sway, -particle.sway, particle.sway, 0],
                rotate: isSnowflake ? [0, particle.rotation] : [-10, 10, -10],
              }}
              transition={{
                x: {
                  duration: isSnowflake ? 3 + Math.random() * 2 : 4 + Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                rotate: {
                  duration: isSnowflake ? 5 : 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            >
              {isSnowflake ? (
                // ❅ Snowflake Particle
                <div
                  className="font-sans select-none flex items-center justify-center filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)] text-sky-200/90 dark:text-sky-100/90"
                  style={{
                    fontSize: `${particle.size}px`,
                  }}
                >
                  {particle.char || '❄'}
                </div>
              ) : (
                // 🎈 Balloon Particle (Vibrant, high-contrast, beautiful reflection and dangling string)
                <div className="flex flex-col items-center select-none" style={{ width: `${particle.size}px` }}>
                  {/* Balloon main sphere */}
                  <div
                    className="relative rounded-[50%_50%_50%_50%_/_45%_45%_55%_55%] shadow-md filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
                    style={{
                      width: `${particle.size}px`,
                      height: `${particle.size * 1.25}px`,
                      backgroundColor: particle.color || '#EF4444',
                      boxShadow: 'inset -5px -6px 14px rgba(0,0,0,0.22), inset 3px 3px 10px rgba(255,255,255,0.45)',
                    }}
                  >
                    {/* Visual 3D Glossy reflection highlight */}
                    <div
                      className="absolute bg-white/50 rounded-full"
                      style={{
                        top: `${particle.size * 0.15}px`,
                        left: `${particle.size * 0.15}px`,
                        width: `${particle.size * 0.22}px`,
                        height: `${particle.size * 0.35}px`,
                        transform: 'rotate(18deg)',
                      }}
                    />
                  </div>
                  {/* Balloon String knot (matches color) */}
                  <div
                    className="w-0 h-0 border-l-transparent border-r-transparent -mt-[1px]"
                    style={{
                      borderLeftWidth: `${particle.size * 0.1}px`,
                      borderRightWidth: `${particle.size * 0.1}px`,
                      borderBottomWidth: `${particle.size * 0.15}px`,
                      borderBottomColor: particle.color || '#EF4444',
                    }}
                  />
                  {/* Real dangling balloon ribbon string */}
                  <motion.div
                    className="w-[1.5px] bg-slate-300 dark:bg-slate-600 origin-top"
                    style={{
                      height: `${particle.size * 1.1}px`,
                    }}
                    animate={{
                      rotate: [-8, 8, -8],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
