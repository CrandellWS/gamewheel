'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useWheelStore } from '../stores/wheelStore';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

// Color manipulation utilities
const hexToRgb = (hex: string): {r: number, g: number, b: number} | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const lighten = (color: string, percent: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * percent));
  const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * percent));
  const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * percent));

  return rgbToHex(r, g, b);
};

const darken = (color: string, percent: number): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const r = Math.floor(rgb.r * (1 - percent));
  const g = Math.floor(rgb.g * (1 - percent));
  const b = Math.floor(rgb.b * (1 - percent));

  return rgbToHex(r, g, b);
};

// Tier detection based on compass position
const getSliceTier = (centerAngle: number): 1 | 2 | 3 | 4 => {
  const normalized = centerAngle % 360;
  const tolerance = 0.1;

  // Tier 1: North (0°/360°)
  if (Math.abs(normalized) < tolerance || Math.abs(normalized - 360) < tolerance) {
    return 1;
  }

  // Tier 2: Cardinals (E: 90°, S: 180°, W: 270°)
  const cardinalAngles = [90, 180, 270];
  for (const angle of cardinalAngles) {
    if (Math.abs(normalized - angle) < tolerance) {
      return 2;
    }
  }

  // Tier 3: Intercardinals (NE: 45°, SE: 135°, SW: 225°, NW: 315°)
  const intercardinalAngles = [45, 135, 225, 315];
  for (const angle of intercardinalAngles) {
    if (Math.abs(normalized - angle) < tolerance) {
      return 3;
    }
  }

  // Tier 4: All others
  return 4;
};

// Tier visual configuration
const getTierVisuals = (tier: 1 | 2 | 3 | 4) => {
  switch (tier) {
    case 1: // North - MAXIMUM IMPACT
      return {
        borderWidth: 6,
        borderColors: ['#FFD700', '#FFF8DC'], // Gold + Light Gold
        doubleBorder: true,
        shadowBlur: 25,
        shadowColor: '#FFD700',
        glowIntensity: 1.0,
        patternType: 'radial-rays' as const,
        cornerMarker: 'star' as const,
        textScale: 2.0,
      };
    case 2: // Cardinals - DRAMATIC
      return {
        borderWidth: 5,
        borderColors: ['#C0C0C0', '#E8E8E8'], // Silver + Light Silver
        doubleBorder: false,
        shadowBlur: 20,
        shadowColor: '#C0C0C0',
        glowIntensity: 0.8,
        patternType: 'diagonal-stripes' as const,
        cornerMarker: 'circle' as const,
        textScale: 1.6,
      };
    case 3: // Intercardinals - ENHANCED
      return {
        borderWidth: 4,
        borderColors: ['#FFFFFF', '#F5F5F5'], // White
        doubleBorder: false,
        shadowBlur: 15,
        shadowColor: '#FFFFFF',
        glowIntensity: 0.6,
        patternType: 'none' as const,
        cornerMarker: 'none' as const,
        textScale: 1.3,
      };
    case 4: // Others - STANDARD
      return {
        borderWidth: 3,
        borderColors: ['#FFFFFF'],
        doubleBorder: false,
        shadowBlur: 10,
        shadowColor: '#FFFFFF',
        glowIntensity: 0.4,
        patternType: 'none' as const,
        cornerMarker: 'none' as const,
        textScale: 1.0,
      };
  }
};

// Star drawing helper
const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  points: number,
  outerRadius: number,
  innerRadius: number
) => {
  const step = Math.PI / points;
  ctx.beginPath();
  for (let i = 0; i < 2 * points; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
};

export function Wheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    entries,
    isSpinning,
    spin,
    winner,
    winners,
    targetWinnerId,
    targetWinnerIds,
    isWaitingConfirmation,
    settings,
    confirmWinner,
    dismissWinner
  } = useWheelStore();
  const { width, height } = useWindowSize();

  const [rotation, setRotation] = useState(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highlightWinner, setHighlightWinner] = useState(false);
  const [pulseFrame, setPulseFrame] = useState(0);
  const lastSegmentRef = useRef(-1);

  const activeEntries = entries.filter((e) => !e.removed);
  const canSpin = activeEntries.length > 0 && !isSpinning && !isWaitingConfirmation;

  // Helper function to normalize angles to 0-360 range
  const normalizeAngle = (angle: number): number => {
    let normalized = angle % 360;
    if (normalized < 0) normalized += 360;
    return normalized;
  };

  // Get size multiplier based on compass position - DRAMATIC SCALING
  // North (0°/360°): 2.0x, Cardinal (90°, 180°, 270°): 1.6x, Intercardinal (45°, 135°, 225°, 315°): 1.3x
  const getSliceSizeMultiplier = (centerAngle: number): number => {
    const normalized = normalizeAngle(centerAngle);
    const tolerance = 0.1; // Small tolerance for floating point comparison

    // Check North (0° or 360°) - MAXIMUM IMPACT
    if (Math.abs(normalized) < tolerance || Math.abs(normalized - 360) < tolerance) {
      return 2.0;
    }

    // Check cardinal directions (E: 90°, S: 180°, W: 270°) - DRAMATIC
    const cardinalAngles = [90, 180, 270];
    for (const angle of cardinalAngles) {
      if (Math.abs(normalized - angle) < tolerance) {
        return 1.6;
      }
    }

    // Check intercardinal directions (NE: 45°, SE: 135°, SW: 225°, NW: 315°) - ENHANCED
    const intercardinalAngles = [45, 135, 225, 315];
    for (const angle of intercardinalAngles) {
      if (Math.abs(normalized - angle) < tolerance) {
        return 1.3;
      }
    }

    // Default size for all other positions
    return 1.0;
  };

  // Calculate slice configurations with dynamic sizing
  const calculateSliceAngles = () => {
    const numSlices = activeEntries.length;
    if (numSlices === 0) return [];

    // Base angle for equal probability (each slice represents equal probability)
    const baseAngle = 360 / numSlices;

    // Calculate size multiplier for each slice based on its center position
    const sliceConfigs = activeEntries.map((entry, index) => {
      // Calculate where the center of this slice would be with equal distribution
      const centerAngle = index * baseAngle;
      const multiplier = getSliceSizeMultiplier(centerAngle);
      const tier = getSliceTier(centerAngle);

      return {
        entry,
        index,
        centerAngle,
        multiplier,
        tier,
        visualAngle: baseAngle * multiplier, // Visual angle (affects display)
        probabilityAngle: baseAngle, // Probability angle (always equal)
      };
    });

    // Calculate total visual angle and normalize
    const totalVisualAngle = sliceConfigs.reduce((sum, config) => sum + config.visualAngle, 0);

    // Normalize visual angles to fit 360 degrees
    const normalizedConfigs = sliceConfigs.map(config => ({
      ...config,
      visualAngle: (config.visualAngle / totalVisualAngle) * 360,
    }));

    // Calculate cumulative angles for drawing
    let cumulativeAngle = 0;
    const finalConfigs = normalizedConfigs.map(config => {
      const startAngle = cumulativeAngle;
      const endAngle = startAngle + config.visualAngle;
      cumulativeAngle = endAngle;

      return {
        ...config,
        startAngle,
        endAngle,
      };
    });

    return finalConfigs;
  };

  // Reusable AudioContext for better performance
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    return audioContextRef.current;
  };

  // Web Audio API for tick sounds
  const playTickSound = useCallback(() => {
    if (!settings.soundEnabled) return;

    try {
      const audioContext = getAudioContext();
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {
      // Silently fail if Web Audio API is not supported
    }
  }, [settings.soundEnabled]);

  const playWinnerSound = useCallback(() => {
    if (!settings.soundEnabled) return;

    try {
      const audioContext = getAudioContext();
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      // Play a cheerful ascending tone
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // Silently fail
    }
  }, [settings.soundEnabled]);

  // Show confetti and highlight winner when announced
  useEffect(() => {
    if (winner && !isSpinning) {
      setHighlightWinner(true);
      playWinnerSound();
      if (settings.confettiEnabled) {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
      }
    } else {
      setHighlightWinner(false);
    }
  }, [winner, isSpinning, settings.confettiEnabled]);

  // Play tick sound when crossing segment boundaries
  useEffect(() => {
    if (isAnimating && activeEntries.length > 0) {
      const sliceConfigs = calculateSliceAngles();
      const currentRotation = normalizeAngle(rotation);

      // Find which slice the pointer is currently at
      let currentSegment = -1;
      for (let i = 0; i < sliceConfigs.length; i++) {
        const config = sliceConfigs[i];
        // Check if current rotation is within this slice's range
        if (currentRotation >= config.startAngle && currentRotation < config.endAngle) {
          currentSegment = i;
          break;
        }
      }

      // Handle wrap-around case (last slice to first slice)
      if (currentSegment === -1 && sliceConfigs.length > 0) {
        currentSegment = sliceConfigs.length - 1;
      }

      if (currentSegment !== lastSegmentRef.current && currentSegment !== -1) {
        playTickSound();
        lastSegmentRef.current = currentSegment;
      }
    }
  }, [rotation, isAnimating, activeEntries.length]);

  // Start spin animation
  useEffect(() => {
    if (isSpinning && !isAnimating && targetWinnerId !== null) {
      const numEntries = activeEntries.length;

      // Calculate index from the winner ID using CURRENT activeEntries
      const targetWinnerIndex = activeEntries.findIndex(e => e.id === targetWinnerId);

      if (targetWinnerIndex === -1) {
        console.error('Winner not found in active entries');
        return;
      }

      // Get slice configurations
      const sliceConfigs = calculateSliceAngles();

      // Find the center angle of the winning slice
      const winnerConfig = sliceConfigs[targetWinnerIndex];
      const winnerCenterAngle = winnerConfig.startAngle + winnerConfig.visualAngle / 2;

      // Calculate the angle to land on the winner
      // Pointer is at -90° (top of wheel)
      // We want the center of the winning slice to align with the pointer
      const desiredFinalAngle = winnerCenterAngle;

      // Add 5-8 full rotations for dramatic effect (integer only)
      const spins = 5 + Math.random() * 3;
      const numFullRotations = Math.floor(spins);

      // Calculate delta from current position to desired position
      const currentAngle = rotation % 360;
      let angleDelta = desiredFinalAngle - currentAngle;

      // Ensure we rotate backward (clockwise when negated in canvas)
      while (angleDelta > 0) angleDelta -= 360;

      const newTarget = rotation + numFullRotations * 360 + angleDelta;

      setTargetRotation(newTarget);
      setIsAnimating(true);
    }
  }, [isSpinning, targetWinnerId, rotation, settings.spinDuration, activeEntries.length]);

  // Smooth animation loop with cubic ease-out
  useEffect(() => {
    if (!isAnimating) return;

    let startTime: number | null = null;
    let startRotation = rotation;

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
        startRotation = rotation;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / settings.spinDuration, 1);

      // Cubic ease-out: fast at start, slow at end
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newRotation = startRotation + (targetRotation - startRotation) * easeOut;

      setRotation(newRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setRotation(targetRotation);
        setIsAnimating(false);
      }
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [isAnimating, targetRotation, settings.spinDuration]);

  // Draw wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeEntries.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Save context
    ctx.save();
    ctx.translate(centerX, centerY);
    // CRITICAL: Negate rotation to match arc() clockwise convention with rotate() counter-clockwise
    ctx.rotate((-rotation * Math.PI) / 180);

    // Get dynamic slice configurations
    const sliceConfigs = calculateSliceAngles();

    // Draw segments with DRAMATIC tier-based visual effects
    sliceConfigs.forEach((config, index) => {
      const entry = config.entry;
      const tierVisuals = getTierVisuals(config.tier);

      // Convert degrees to radians and offset for pointer position at top
      const startAngle = (config.startAngle - 90) * (Math.PI / 180);
      const endAngle = (config.endAngle - 90) * (Math.PI / 180);
      const centerAngle = (startAngle + endAngle) / 2;

      // Check if this entry is one of the winners
      const isWinningSegment = highlightWinner && targetWinnerIds.includes(entry.id);
      const isDimmed = highlightWinner && !isWinningSegment;

      // Pulsing effect - only during spin or when highlighting winner
      const shouldPulse = (isSpinning || highlightWinner) && isWinningSegment;
      const pulseIntensity = shouldPulse ? 0.5 + 0.5 * Math.sin(Date.now() / 300) : 0;

      // Draw segment base
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // DRAMATIC multi-stop gradient with lighten/darken
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      if (isDimmed) {
        // Dim non-winning slices
        gradient.addColorStop(0, entry.color + '66');
        gradient.addColorStop(1, entry.color + '44');
      } else {
        // Multi-stop gradient for depth
        const lightColor = lighten(entry.color, 0.3);
        const darkColor = darken(entry.color, 0.2);
        gradient.addColorStop(0, lightColor);
        gradient.addColorStop(0.5, entry.color);
        gradient.addColorStop(1, darkColor);
      }

      ctx.fillStyle = gradient;
      ctx.fill();

      // PATTERN OVERLAYS for Tier 1 & 2
      if (!isDimmed && tierVisuals.patternType !== 'none') {
        ctx.save();
        ctx.globalAlpha = 0.15;

        if (tierVisuals.patternType === 'radial-rays') {
          // Radial rays pattern for Tier 1
          const numRays = 12;
          const rayAngleStep = (endAngle - startAngle) / numRays;
          for (let i = 0; i < numRays; i++) {
            if (i % 2 === 0) continue; // Alternate rays
            const rayStart = startAngle + i * rayAngleStep;
            const rayEnd = rayStart + rayAngleStep;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, rayStart, rayEnd);
            ctx.closePath();
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
          }
        } else if (tierVisuals.patternType === 'diagonal-stripes') {
          // Diagonal stripes pattern for Tier 2
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, radius, startAngle, endAngle);
          ctx.closePath();
          ctx.clip();

          const stripeWidth = 15;
          const numStripes = Math.ceil(radius * 2 / stripeWidth);
          ctx.fillStyle = '#FFFFFF';
          for (let i = -numStripes; i < numStripes; i++) {
            ctx.fillRect(i * stripeWidth * 2, -radius, stripeWidth, radius * 2);
          }
        }

        ctx.restore();
      }

      // ENHANCED BORDERS with tier-based styling
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Border glow and shadow
      if (isWinningSegment && shouldPulse) {
        // Pulsing glow effect for winner
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15 + 10 * pulseIntensity;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 5 + 2 * pulseIntensity;
      } else if (isDimmed) {
        // Subtle border for dimmed slices
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff44';
        ctx.lineWidth = 2;
      } else {
        // Tier-based glow
        ctx.shadowColor = tierVisuals.shadowColor;
        ctx.shadowBlur = tierVisuals.shadowBlur * tierVisuals.glowIntensity;
        ctx.strokeStyle = tierVisuals.borderColors[0];
        ctx.lineWidth = tierVisuals.borderWidth;
      }
      ctx.stroke();

      // DOUBLE BORDER for Tier 1
      if (!isDimmed && tierVisuals.doubleBorder && !isWinningSegment) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.strokeStyle = tierVisuals.borderColors[1];
        ctx.lineWidth = tierVisuals.borderWidth - 2;
        ctx.stroke();
      }

      ctx.restore();

      // CORNER MARKERS (stars for Tier 1, circles for Tier 2)
      if (!isDimmed && tierVisuals.cornerMarker !== 'none') {
        ctx.save();

        // Calculate positions at the outer corners of the slice
        const markerRadius = radius * 0.92;
        const markerSize = 8;

        // Start corner
        const startX = markerRadius * Math.cos(startAngle);
        const startY = markerRadius * Math.sin(startAngle);

        // End corner
        const endX = markerRadius * Math.cos(endAngle);
        const endY = markerRadius * Math.sin(endAngle);

        ctx.fillStyle = tierVisuals.borderColors[0];
        ctx.shadowColor = tierVisuals.shadowColor;
        ctx.shadowBlur = 8;

        if (tierVisuals.cornerMarker === 'star') {
          // Draw stars at corners for Tier 1
          drawStar(ctx, startX, startY, 5, markerSize, markerSize * 0.4);
          ctx.fill();
          drawStar(ctx, endX, endY, 5, markerSize, markerSize * 0.4);
          ctx.fill();
        } else if (tierVisuals.cornerMarker === 'circle') {
          // Draw circles at corners for Tier 2
          ctx.beginPath();
          ctx.arc(startX, startY, markerSize * 0.6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(endX, endY, markerSize * 0.6, 0, 2 * Math.PI);
          ctx.fill();
        }

        ctx.restore();
      }

      // ENHANCED TEXT with NO CAPS on scaling
      ctx.save();
      ctx.rotate(centerAngle);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      // Calculate text size based on tier multiplier - NO CAPS!
      const baseFontSize = 18;
      const fontSize = baseFontSize * tierVisuals.textScale;

      // Make winning text larger and bolder
      if (isWinningSegment) {
        ctx.font = `bold ${fontSize + 4}px Inter, sans-serif`;
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 8;
      } else {
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
      }
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      const text = entry.name;
      const maxWidth = radius - 30;
      ctx.fillText(text, radius - 15, 0, maxWidth);

      ctx.restore();
    });

    ctx.restore();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
    const centerGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      50
    );
    centerGradient.addColorStop(0, '#6366f1');
    centerGradient.addColorStop(1, '#4f46e5');
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw pointer (at top) - larger and more visible
    ctx.beginPath();
    ctx.moveTo(centerX, 10);
    ctx.lineTo(centerX - 25, 55);
    ctx.lineTo(centerX + 25, 55);
    ctx.closePath();

    // Add shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;

    // Gradient for pointer
    const pointerGradient = ctx.createLinearGradient(centerX, 10, centerX, 55);
    pointerGradient.addColorStop(0, '#ef4444');
    pointerGradient.addColorStop(1, '#dc2626');
    ctx.fillStyle = pointerGradient;
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // White border for contrast
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [activeEntries, rotation, highlightWinner, targetWinnerId, targetWinnerIds, pulseFrame]);

  // Continuous animation for pulsing winner effect
  useEffect(() => {
    if (!highlightWinner) return;

    let frameId: number;
    const animate = () => {
      setPulseFrame(prev => prev + 1);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [highlightWinner]);

  const handleSpin = useCallback(() => {
    if (canSpin) {
      lastSegmentRef.current = -1; // Reset segment tracking
      spin();
    }
  }, [canSpin, spin]);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleSpin();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleSpin]);

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Accessibility: Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isSpinning && 'Spinning the wheel...'}
        {winner && !isSpinning && `Winner selected: ${winner}!`}
      </div>

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      {/* Dim overlay when waiting for confirmation */}
      <AnimatePresence>
        {isWaitingConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 pointer-events-none"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[500px] aspect-square" aria-busy={isSpinning}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ touchAction: 'none' }}
          role="img"
          aria-label={`Wheel with ${activeEntries.length} entries: ${activeEntries.map(e => e.name).join(', ')}`}
        />

        <button
          onClick={handleSpin}
          disabled={!canSpin}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                   w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700
                   text-white font-bold text-lg sm:text-xl shadow-2xl
                   hover:from-indigo-700 hover:to-indigo-800
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-300
                   hover:scale-110 active:scale-95
                   border-4 border-white z-10
                   focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2"
          aria-label={isSpinning ? 'Spinning...' : `Spin the wheel with ${activeEntries.length} entries`}
          title="Press Space or Enter to spin"
        >
          {isSpinning ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block text-2xl"
            >
              ⚡
            </motion.span>
          ) : (
            <span className="drop-shadow-lg">SPIN</span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {winner && !isSpinning && isWaitingConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="mt-8 p-6 sm:p-8 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50
                     dark:from-yellow-900 dark:via-amber-900 dark:to-orange-900
                     rounded-3xl text-center shadow-2xl border-4 border-yellow-400
                     dark:border-yellow-600 relative overflow-hidden max-w-2xl w-full
                     animate-pulse-glow z-20"
          >
            {/* Animated background shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"
              style={{ width: '200%' }}
            />

            {/* Trophy icon for celebration */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-7xl sm:text-8xl mb-4"
            >
              {winners.length > 1 ? '🏆' : '🎉'}
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            >
              <p className="text-xl sm:text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-4 tracking-wider uppercase">
                {winners.length > 1 ? '✨ WINNERS SELECTED ✨' : '✨ WINNER SELECTED ✨'}
              </p>

              {winners.length > 1 ? (
                <div className="space-y-3 mb-6 relative z-10 max-h-64 overflow-y-auto px-2">
                  {winners.map((winnerName, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white/50 dark:bg-black/30 rounded-lg p-3 backdrop-blur-sm"
                    >
                      <p className="text-2xl sm:text-3xl font-extrabold text-yellow-900 dark:text-yellow-100
                                  drop-shadow-lg break-words">
                        {index === 0 && '⭐ '}
                        <span className="animate-winner-pulse">{winnerName}</span>
                      </p>
                    </motion.div>
                  ))}
                  <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mt-3 bg-yellow-200/50 dark:bg-yellow-800/50 rounded-full px-4 py-2 inline-block">
                    {winners.length} winner{winners.length > 1 ? 's' : ''} selected
                  </p>
                </div>
              ) : (
                <div className="mb-6 relative z-10">
                  <div className="bg-white/50 dark:bg-black/30 rounded-xl p-6 backdrop-blur-sm">
                    <p className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-yellow-900 dark:text-yellow-100
                                drop-shadow-2xl break-words animate-winner-pulse">
                      {winner}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Prominent confirmation message */}
            <div className="mb-6 relative z-10">
              <p className="text-base sm:text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Please confirm to continue
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                {settings.removeWinners
                  ? `Winner${winners.length > 1 ? 's' : ''} will be removed from the wheel`
                  : `Winner${winners.length > 1 ? 's' : ''} will remain in the wheel`
                }
              </p>
            </div>

            {/* Action buttons - larger and more prominent */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmWinner}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700
                         hover:from-green-700 hover:to-green-800 text-white font-bold text-lg
                         rounded-xl shadow-2xl transition-all duration-200
                         focus:outline-none focus:ring-4 focus:ring-green-300
                         border-2 border-green-400"
                aria-label={`Confirm ${winners.length > 1 ? 'winners' : 'winner'} and continue`}
              >
                ✓ Confirm Winner{winners.length > 1 ? 's' : ''}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={dismissWinner}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700
                         hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg
                         rounded-xl shadow-2xl transition-all duration-200
                         focus:outline-none focus:ring-4 focus:ring-blue-300
                         border-2 border-blue-400"
                aria-label="Spin again without removing"
              >
                🔄 Spin Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeEntries.length === 0 && (
        <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-center">
          <p className="text-yellow-800 dark:text-yellow-200">
            Add some entries to spin the wheel!
          </p>
        </div>
      )}
    </div>
  );
}
