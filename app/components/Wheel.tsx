'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useWheelStore } from '../stores/wheelStore';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export function Wheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { entries, isSpinning, spin, winner, targetWinnerId, settings, confirmWinner, dismissWinner } = useWheelStore();
  const { width, height } = useWindowSize();

  const [rotation, setRotation] = useState(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highlightWinner, setHighlightWinner] = useState(false);
  const lastSegmentRef = useRef(-1);

  const activeEntries = entries.filter((e) => !e.removed);
  const canSpin = activeEntries.length > 0 && !isSpinning;

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
      const degreesPerSegment = 360 / activeEntries.length;
      const currentSegment = Math.floor((rotation % 360) / degreesPerSegment);

      if (currentSegment !== lastSegmentRef.current) {
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

      // Calculate the angle to land on the winner
      // Segments are drawn with centers at: i * degreesPerSegment - 90°
      // Pointer is at -90° (top of wheel)
      // After rotation R, segment i center is at: (i * deg - 90°) - R
      // To align with pointer: (i * deg - 90°) - R = -90°
      // Therefore: R = i * degreesPerSegment (modulo 360)
      const degreesPerSegment = 360 / numEntries;
      const desiredFinalAngle = targetWinnerIndex * degreesPerSegment;

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

    // Draw segments
    const anglePerSegment = (2 * Math.PI) / activeEntries.length;

    activeEntries.forEach((entry, index) => {
      // Offset by half segment so segment centers align with pointer at top
      const startAngle = index * anglePerSegment - Math.PI / 2 - anglePerSegment / 2;
      const endAngle = startAngle + anglePerSegment;
      // Calculate winner index from ID using current activeEntries
      const targetWinnerIndex = targetWinnerId !== null ? activeEntries.findIndex(e => e.id === targetWinnerId) : -1;
      const isWinningSegment = highlightWinner && index === targetWinnerIndex;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Gradient fill
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, entry.color);
      gradient.addColorStop(1, entry.color + 'DD');

      ctx.fillStyle = gradient;
      ctx.fill();

      // Border - highlight winner with gold glow
      if (isWinningSegment) {
        // Add glow effect for winner
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 6;
      } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
      }
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      // Make winning text larger and bolder
      if (isWinningSegment) {
        ctx.font = 'bold 22px Inter, sans-serif';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 8;
      } else {
        ctx.font = 'bold 18px Inter, sans-serif';
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
  }, [activeEntries, rotation, highlightWinner, targetWinnerId]);

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
        {winner && !isSpinning && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="mt-8 p-8 bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-100
                     dark:from-yellow-900 dark:via-amber-900 dark:to-yellow-900
                     rounded-2xl text-center shadow-2xl border-4 border-yellow-400
                     dark:border-yellow-600 relative overflow-hidden max-w-lg w-full"
          >
            {/* Animated background shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />

            <motion.p
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-7xl mb-3"
            >
              🎉
            </motion.p>

            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            >
              <p className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2 tracking-wider">
                ✨ WINNER ✨
              </p>
              <p className="text-4xl sm:text-5xl font-extrabold text-yellow-900 dark:text-yellow-100
                          drop-shadow-lg px-4 py-2 relative z-10 mb-6">
                {winner}
              </p>
            </motion.div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-center relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmWinner}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold
                         rounded-lg shadow-lg transition-colors duration-200
                         focus:outline-none focus:ring-4 focus:ring-green-300"
                aria-label="Confirm winner and continue"
              >
                ✓ Confirm {settings.removeWinners ? '& Remove' : ''}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={dismissWinner}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                         rounded-lg shadow-lg transition-colors duration-200
                         focus:outline-none focus:ring-4 focus:ring-blue-300"
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
