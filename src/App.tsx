/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Particle, EffectType, ActivityLog } from './types';
import { ControlPanel } from './components/ControlPanel';
import { ParticleLayer } from './components/ParticleLayer';

export default function App() {
  const [activeEffect, setActiveEffect] = useState<EffectType>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Keep references to active intervals for reliable cleanup
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const generateSnowflake = (isPrePopulated = false): Particle => {
    const chars = ['❄', '❅', '❆', '✦'];
    const size = 16 + Math.round(Math.random() * 12); // Medium size: 16px to 28px
    const duration = 4.2 + Math.random() * 2.0; // Travel duration: 4.2 to 6.2 seconds
    
    // Distribute vertically if pre-populated so they start visible; otherwise start above viewport
    const startY = isPrePopulated ? Math.random() * 95 : -10;
    
    // Scale duration proportionally for pre-populated items to keep movement rates smooth & consistent
    const remainingDistancePercent = (112 - startY) / 122;
    const adjustedDuration = isPrePopulated ? duration * remainingDistancePercent : duration;

    return {
      id: `snow_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
      x: Math.random() * 100,
      startY,
      endY: 112,
      size,
      speed: 1,
      duration: adjustedDuration,
      delay: 0,
      sway: 15 + Math.random() * 30, // Horizontal sway amplitude
      rotation: 120 + Math.random() * 240, // Degree spin rate
      char: chars[Math.floor(Math.random() * chars.length)],
    };
  };

  const generateBalloon = (isPrePopulated = false): Particle => {
    const colors = [
      '#EF4444', // Premium Crimson Red
      '#3B82F6', // Corporate Cobalt Blue
      '#10B981', // Sage Emerald Green
      '#F59E0B', // Amber Gold
      '#8B5CF6', // Amethyst Violet
      '#EC4899', // Elegant Rose Pink
      '#F97316', // Slate Orange
    ];
    const size = 32 + Math.round(Math.random() * 14); // Medium size balloon: 32px to 46px
    const duration = 4.8 + Math.random() * 2.2; // Travel duration: 4.8 to 7.0 seconds
    
    // Distribute vertically if pre-populated; otherwise start below viewport
    const startY = isPrePopulated ? 10 + Math.random() * 95 : 112;
    
    // Scale duration proportionally for pre-populated items
    const remainingDistancePercent = (startY - (-20)) / 132;
    const adjustedDuration = isPrePopulated ? duration * remainingDistancePercent : duration;

    return {
      id: `balloon_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
      x: 3 + Math.random() * 94, // Bound x inside viewport edges (3% - 97%)
      startY,
      endY: -20,
      size,
      speed: 1,
      duration: adjustedDuration,
      delay: 0,
      sway: 10 + Math.random() * 20, // Gentle drift lateral width
      rotation: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  };

  const handleTriggerSnowflakes = () => {
    triggerEffect('snowflakes');
  };

  const handleTriggerBalloons = () => {
    triggerEffect('balloons');
  };

  const triggerEffect = (effect: 'snowflakes' | 'balloons') => {
    // Prevent overlapping triggers
    if (activeEffect !== null) return;

    // Clear existing active particles to start pristine
    setParticles([]);
    setActiveEffect(effect);
    setTimeLeft(5.0);

    // 1. Instantly populate screen with initial particles for visual saturation
    const initialCount = effect === 'snowflakes' ? 18 : 14;
    const initialParticles: Particle[] = [];
    for (let i = 0; i < initialCount; i++) {
      initialParticles.push(effect === 'snowflakes' ? generateSnowflake(true) : generateBalloon(true));
    }
    setParticles(initialParticles);

    // Create a database historical log entry
    const timestamp = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    });
    const newLog: ActivityLog = {
      id: `log_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
      timestamp,
      effect,
      count: initialCount,
    };
    setLogs(prev => [...prev, newLog]);

    let extraSpawnedCount = 0;

    // 2. Setup periodic particle spawner (active for exactly 5000ms)
    const intervalRate = effect === 'snowflakes' ? 130 : 160;
    spawnIntervalRef.current = setInterval(() => {
      setParticles(prev => [
        ...prev,
        effect === 'snowflakes' ? generateSnowflake(false) : generateBalloon(false),
      ]);
      extraSpawnedCount++;
    }, intervalRate);

    // 3. Precision countdown updater (runs every 40ms for beautiful fluidity)
    const startTimeStamp = Date.now();
    countdownIntervalRef.current = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTimeStamp) / 1000;
      const remainingSeconds = Math.max(5.0 - elapsedSeconds, 0);
      setTimeLeft(remainingSeconds);

      if (remainingSeconds <= 0) {
        // Complete the spawning phase
        if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        setActiveEffect(null);

        // Update the log record with total finalized particles count
        setLogs(prev => prev.map(log => {
          if (log.id === newLog.id) {
            return { ...log, count: log.count + extraSpawnedCount };
          }
          return log;
        }));
      }
    }, 40);
  };

  const handleParticleComplete = (id: string) => {
    // Remove particles when they complete their journeys to ensure optimal rendering execution
    setParticles(prev => prev.filter(p => p.id !== id));
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-850 flex flex-col justify-between overflow-hidden font-sans select-none selection:bg-blue-100 selection:text-blue-900">
      {/* Interactive Floating Particle Layer */}
      <ParticleLayer
        particles={particles}
        effectType={activeEffect}
        onParticleComplete={handleParticleComplete}
      />

      {/* Decorative Elegant Ambient Grid/Soft Background Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Stratos Aerospace High-End Top Navigation Bar */}
      <nav className="h-16 bg-slate-900 flex items-center justify-between px-6 sm:px-10 text-white shrink-0 shadow-lg z-10 w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg text-white">
            S
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">STRATOS</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <span>DASHBOARD</span>
          <span>SIMULATIONS</span>
          <span>ANALYTICS</span>
          <span className="text-blue-400">OPERATIONS</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 text-white text-sm font-medium shadow">
            JD
          </div>
        </div>
      </nav>

      {/* Central Immersive Operational Console Desk */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10 w-full max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Atmospheric Interface
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Initiate localized particle distribution simulations. Select an environmental vector to deploy the corresponding aerial assets across the primary viewport grid.
          </p>
        </div>

        <ControlPanel
          activeEffect={activeEffect}
          timeLeft={timeLeft}
          particlesCount={particles.length}
          logs={logs}
          onTriggerSnowflakes={handleTriggerSnowflakes}
          onTriggerBalloons={handleTriggerBalloons}
          onClearLogs={handleClearLogs}
        />

        {/* Dynamic Interactive Stats Grid at the bottom of the workspace */}
        <div className="mt-12 w-full max-w-2xl grid grid-cols-3 gap-4 md:gap-8 border-t border-slate-200 pt-8">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-slate-900">
              {activeEffect ? 'SIM_ACTIVE' : '1,024'}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">
              {activeEffect ? 'System Loop' : 'Active Nodes'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-slate-900">99.9%</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">Simulation Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-slate-900">0.04ms</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">Latency Resp.</div>
          </div>
        </div>
      </main>

      {/* High-End Stratos Footer */}
      <footer className="h-12 bg-white border-t border-slate-200 flex items-center justify-between px-6 sm:px-10 text-[10px] sm:text-xs text-slate-400 shrink-0 z-10 w-full">
        <div>© {new Date().getFullYear()} STRATOS AEROSPACE DYNAMICS</div>
        <div className="flex gap-4">
          <span>SYSTEM STATUS: OPTIMAL</span>
          <span className="text-green-500">● ONLINE</span>
        </div>
      </footer>
    </div>
  );
}
