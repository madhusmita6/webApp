/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, Activity, Cpu, History } from 'lucide-react';
import { EffectType, ActivityLog } from '../types';

interface ControlPanelProps {
  activeEffect: EffectType;
  timeLeft: number;
  particlesCount: number;
  logs: ActivityLog[];
  onTriggerSnowflakes: () => void;
  onTriggerBalloons: () => void;
  onClearLogs: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  activeEffect,
  timeLeft,
  particlesCount,
  logs,
  onTriggerSnowflakes,
  onTriggerBalloons,
  onClearLogs,
}) => {
  const percentageLeft = (timeLeft / 5.0) * 100;

  return (
    <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 z-30">
      {/* Upper Status Accent Line with sleek response transition */}
      <div 
        className={`h-1.5 w-full transition-all duration-500 ${
          activeEffect === 'snowflakes' 
            ? 'bg-blue-500' 
            : activeEffect === 'balloons' 
            ? 'bg-red-500' 
            : 'bg-slate-300'
        }`}
      />

      <div className="p-6 md:p-8 space-y-6">
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-500" />
              Aerospace Dynamics Console
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enterprise Ambient Controls & Particle Vector Deployer
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
            <span className={`w-2 h-2 rounded-full ${activeEffect ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
              {activeEffect ? 'SIMULATION ACTIVE' : 'SYSTEM READY'}
            </span>
          </div>
        </div>

        {/* Primary Controls (Sleek Interface Buttons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Snowflakes Trigger Button as a premium large vector card */}
          <button
            onClick={onTriggerSnowflakes}
            id="snowflake-trigger"
            disabled={activeEffect !== null}
            className={`group relative h-48 bg-white border rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden select-none outline-none ${
              activeEffect === 'snowflakes'
                ? 'border-blue-500 bg-blue-50/20 text-blue-700 shadow-inner'
                : activeEffect !== null
                ? 'opacity-40 cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400'
                : 'border-slate-200 hover:border-blue-500 text-slate-800 shadow-sm hover:shadow-xl active:scale-98 cursor-pointer'
            }`}
          >
            {/* Hover background splash */}
            {activeEffect === null && (
              <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
            
            <div 
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl z-10 transition-all duration-500 ${
                activeEffect === 'snowflakes' 
                  ? 'bg-blue-200 animate-spin text-blue-600 scale-110 shadow-md' 
                  : 'bg-blue-100 text-blue-500 group-hover:rotate-45 group-hover:scale-110'
              }`}
            >
              ❄️
            </div>
            <div className="flex flex-col items-center z-10">
              <span className="text-lg font-bold">Snowflakes</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Vector: Downward</span>
            </div>
          </button>

          {/* Balloons Trigger Button as a premium large vector card */}
          <button
            onClick={onTriggerBalloons}
            id="balloon-trigger"
            disabled={activeEffect !== null}
            className={`group relative h-48 bg-white border rounded-2xl transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden select-none outline-none ${
              activeEffect === 'balloons'
                ? 'border-red-500 bg-red-50/20 text-red-700 shadow-inner'
                : activeEffect !== null
                ? 'opacity-40 cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400'
                : 'border-slate-200 hover:border-red-500 text-slate-800 shadow-sm hover:shadow-xl active:scale-98 cursor-pointer'
            }`}
          >
            {/* Hover background splash */}
            {activeEffect === null && (
              <div className="absolute inset-0 bg-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
            
            <div 
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl z-10 transition-all duration-500 ${
                activeEffect === 'balloons' 
                  ? 'bg-red-200 animate-bounce text-red-600 scale-110 shadow-md' 
                  : 'bg-red-100 text-red-500 group-hover:-translate-y-1.5 group-hover:scale-110'
              }`}
            >
              🎈
            </div>
            <div className="flex flex-col items-center z-10">
              <span className="text-lg font-bold">Balloons</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Vector: Upward</span>
            </div>
          </button>
        </div>

        {/* Real-time Telemetry Dashboard Screen with Sleek CSS styling */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 font-mono">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-200 pb-2">
            <span className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
              <Activity className="w-3.5 h-3.5 text-blue-500" /> Vector Telemetry
            </span>
            <span className="text-[10px]">GRID_SCALE: VW_VH</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-400 uppercase">ACTIVE COORD:</div>
              <div className="font-bold text-slate-800">
                {activeEffect === 'snowflakes' && 'Y: [-10 → 112] (FALL)'}
                {activeEffect === 'balloons' && 'Y: [112 → -20] (RISE)'}
                {activeEffect === null && 'SYSTEM_IDLE'}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-slate-400 uppercase">ACTIVE NODES:</div>
              <div className="flex items-baseline gap-1 font-bold text-slate-800">
                <span className="text-sm">{particlesCount}</span>
                <span className="text-[10px] text-slate-400 font-normal">rendered</span>
              </div>
            </div>
          </div>

          {/* Active Countdown Progress Bar */}
          {activeEffect !== null && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 text-slate-400 text-[10px] uppercase font-bold">
                  <Clock className="w-3.5 h-3.5 text-slate-400 animate-spin" /> Spawning Vector Stream:
                </span>
                <span className="font-bold text-slate-800">{timeLeft.toFixed(2)}s</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-75 ${
                    activeEffect === 'snowflakes' ? 'bg-blue-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentageLeft}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Logbook (Matching Sleek Interface Aesthetics) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Simulation Run history
            </h3>
            {logs.length > 0 && (
              <button 
                onClick={onClearLogs}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 hover:underline cursor-pointer"
              >
                Clear History
              </button>
            )}
          </div>

          <div className="h-28 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2 text-[11px] font-mono scrollbar-thin">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 italic">
                No telemetry logs recorded. Trigger a vector to start logging.
              </div>
            ) : (
              [...logs].reverse().map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-center justify-between border-b border-slate-200 pb-1.5 last:border-0 last:pb-0"
                >
                  <span className="text-slate-400">[{log.timestamp}]</span>
                  <span className="flex items-center gap-1">
                    <span 
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        log.effect === 'snowflakes' ? 'bg-blue-500' : 'bg-red-500'
                      }`} 
                    />
                    <span className="font-bold text-slate-700">
                      {log.effect === 'snowflakes' ? 'Snowfall Downward' : 'Balloons Upward'}
                    </span>
                  </span>
                  <span className="text-slate-500 font-medium">
                    {log.count} nodes initialized
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
