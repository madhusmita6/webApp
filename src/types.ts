/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EffectType = 'snowflakes' | 'balloons' | null;

export interface Particle {
  id: string;
  x: number;          // Horizontal position percentage (0 to 100)
  startY: number;     // Starting vertical position percentage (-10 for top, 110 for bottom, or middle for pre-populating)
  endY: number;       // Ending vertical position percentage (110 for bottom, -10 for top)
  size: number;       // Size in pixels
  speed: number;      // Speed multiplier
  duration: number;   // Duration in seconds
  delay: number;      // Delay before starting animation in seconds
  sway: number;       // Maximum horizontal sway amplitude in pixels
  rotation: number;   // Spin rate or final angle
  color?: string;     // Color code for balloons
  char?: string;      // Character for snowflakes (e.g. ❄, ❅, ❆)
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  effect: 'snowflakes' | 'balloons';
  count: number;
}
