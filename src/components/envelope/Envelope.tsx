"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Phase = 'idle' | 'cracking' | 'ribbonLoose' | 'flapOpen' | 'cardReveal' | 'done';

interface EnvelopeProps {
  onOpen: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; scale: number; delay: number }[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Pre-calculate particles to avoid layout shifts and ensure smooth first frame
  useLayoutEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 200;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        scale: 0.5 + Math.random() * 1.5,
        delay: Math.random() * 0.2
      };
    });
    setParticles(newParticles);
  }, []);

  const playCrackSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Synthesize "crack" noise
      const bufferSize = ctx.sampleRate * 0.15; // 150ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // High frequency noise with exponential decay
        const t = i / bufferSize;
        const env = Math.exp(-t * 15);
        data[i] = (Math.random() * 2 - 1) * env * 0.8;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Filter for "crispness"
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;

      noiseSource.connect(filter);
      filter.connect(ctx.destination);
      noiseSource.start();

      // Soft chime for magic dust
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1);

    } catch (e) {
      console.log('Audio playback failed', e);
    }
  };

  const handleOpen = () => {
    if (phase !== 'idle') return;

    setPhase('cracking');
    playCrackSound();

    // Cinematic timeline
    setTimeout(() => setPhase('ribbonLoose'), 600);
    setTimeout(() => setPhase('flapOpen'), 1400);
    setTimeout(() => setPhase('cardReveal'), 2400);
    setTimeout(() => {
      setPhase('done');
      onOpen();
    }, 4000);
  };

  if (phase === 'done') return null;

  const isCracked = phase !== 'idle';
  const isRibbonLoose = phase === 'ribbonLoose' || phase === 'flapOpen' || phase === 'cardReveal';
  const isFlapOpen = phase === 'flapOpen' || phase === 'cardReveal';
  const isCardRevealed = phase === 'cardReveal';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 perspective-1200"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'cardReveal' ? 0 : 1 }}
      transition={{ duration: 1.5, delay: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full h-[90vh] md:h-auto md:max-w-xl md:aspect-[4/3] mx-4 md:mx-auto transform-style-3d">
        <motion.div
          className="w-full h-full relative transform-style-3d will-change-transform"
          initial={{ scale: 0.95, y: 20 }}
          animate={{
            scale: isCardRevealed ? 1.2 : 1,
            y: isCardRevealed ? 150 : 0,
            rotateX: isCardRevealed ? 10 : 0
          }}
          transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* Envelope Body (Back) */}
          <div className="absolute inset-0 bg-[#A3B19B] envelope-linen shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-md overflow-hidden border border-[#8A9A82]/20">
            {/* Subtle inner shadow/border */}
            <div className="absolute inset-1 border-[1px] border-white/20 rounded-sm">
              <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none" />
            </div>

            {/* Decorative background lining (visible when flap opens) */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }} />
          </div>

          {/* Invitation Card (Inside) */}
          <motion.div
            className="absolute inset-[4px] bg-white rounded-sm z-10 flex flex-col items-center justify-center p-6 shadow-inner border border-gray-100"
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: isCardRevealed ? -160 : 0,
              opacity: isFlapOpen ? 1 : 0
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Leafy Wreath Graphic */}
            {/* <svg className="absolute top-8 w-48 h-32 text-[#7B906F]" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M 20 100 Q 20 30 100 20 Q 180 30 180 100" strokeDasharray="4 4" opacity="0.5"/>
              <path d="M 20 100 Q 40 40 100 30 Q 160 40 180 100" />
              Leaves left
              <path d="M 40 70 Q 30 60 40 50 Q 50 60 40 70" fill="currentColor" opacity="0.8"/>
              <path d="M 50 55 Q 45 40 60 40 Q 65 50 50 55" fill="currentColor" opacity="0.6"/>
              <path d="M 70 40 Q 60 30 75 25 Q 85 35 70 40" fill="currentColor" opacity="0.7"/>
              Leaves right
              <path d="M 160 70 Q 170 60 160 50 Q 150 60 160 70" fill="currentColor" opacity="0.8"/>
              <path d="M 150 55 Q 155 40 140 40 Q 135 50 150 55" fill="currentColor" opacity="0.6"/>
              <path d="M 130 40 Q 140 30 125 25 Q 115 35 130 40" fill="currentColor" opacity="0.7"/>
              Little red berries
              <circle cx="60" cy="65" r="2" fill="#D32F2F" stroke="none" />
              <circle cx="75" cy="50" r="2" fill="#D32F2F" stroke="none" />
              <circle cx="125" cy="50" r="2" fill="#D32F2F" stroke="none" />
              <circle cx="140" cy="65" r="2" fill="#D32F2F" stroke="none" />
            </svg> */}

            <div className="text-center w-full flex flex-col items-center gap-4 z-10 mt-12">
              <h2 className="font-serif text-3xl md:text-5xl text-[#3A4533] tracking-widest mt-2">K & L</h2>
              <p className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-[#7B906F] mt-2">Wedding Invite</p>
            </div>
          </motion.div>

          {/* Envelope Flap (Top) */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[65%] origin-top z-20 will-change-transform backface-hidden drop-shadow-xl"
            initial={{ rotateX: 0 }}
            animate={{
              rotateX: isFlapOpen ? -180 : 0,
              zIndex: isFlapOpen ? 5 : 20
            }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Front of Flap (Pointed downward) */}
            <div
              className="absolute inset-0 bg-[#A3B19B] envelope-linen backface-hidden flex items-center justify-center overflow-hidden border-b border-white/20"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            >
              {/* Decorative border matching the point */}
              <div className="absolute inset-0 border-[2px] border-white/20 opacity-50 pointer-events-none" style={{ clipPath: 'polygon(5% 5%, 95% 5%, 50% 90%)' }} />
            </div>

            {/* Back of Flap (Inner Lining visible when flipped) */}
            <div
              className="absolute inset-0 bg-[#8A9A82] shadow-inner border-t border-black/20 backface-hidden"
              style={{ transform: 'rotateX(180deg)', clipPath: 'polygon(0 100%, 100% 100%, 50% 0)' }}
            >
              {/* Pattern matching the inside body */}
              <div className="absolute inset-0 opacity-15" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
              }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </motion.div>

          {/* Ribbon Horizontal */}
          <motion.div
            className="absolute top-1/2 left-0 w-full h-4 bg-gradient-to-b from-[#8B0000] via-[#C41E3A] to-[#8B0000] z-25 shadow-md"
            animate={{
              opacity: isRibbonLoose ? 0 : 1,
              scaleX: isRibbonLoose ? 1.05 : 1
            }}
            transition={{ duration: 0.8 }}
          />

          {/* Ribbon Bow Left */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-16 h-12 -mt-6 -ml-16 origin-right z-30"
            animate={{
              x: isRibbonLoose ? -100 : 0,
              y: isRibbonLoose ? 50 : 0,
              rotate: isRibbonLoose ? -45 : 0,
              opacity: isRibbonLoose ? 0 : 1
            }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
              <path d="M100 50 C 60 20, 20 20, 0 50 C 20 80, 60 80, 100 50" fill="url(#ribbonGrad)" />
            </svg>
          </motion.div>

          {/* Ribbon Bow Right */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-16 h-12 -mt-6 origin-left z-30"
            animate={{
              x: isRibbonLoose ? 100 : 0,
              y: isRibbonLoose ? 50 : 0,
              rotate: isRibbonLoose ? 45 : 0,
              opacity: isRibbonLoose ? 0 : 1
            }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
              <defs>
                <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B0000" />
                  <stop offset="50%" stopColor="#C41E3A" />
                  <stop offset="100%" stopColor="#8B0000" />
                </linearGradient>
              </defs>
              <path d="M0 50 C 40 20, 80 20, 100 50 C 80 80, 40 80, 0 50" fill="url(#ribbonGrad)" />
            </svg>
          </motion.div>


          {/* Wax Seal Base & Fragments */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-40 w-24 h-24 perspective-1200">
            {!isCracked ? (
              // Intact Seal
              <motion.button
                onClick={handleOpen}
                className="w-full h-full rounded-full flex items-center justify-center cursor-pointer shadow-[0_5px_15px_rgba(0,0,0,0.4)] animate-seal-pulse relative overflow-hidden bg-cover bg-center bg-no-repeat border-2 border-[#D4AF37]"
                style={{ backgroundImage: "url('/waxseal.jpeg')" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            ) : (
              // Cracked Fragments
              <div className="w-full h-full relative">
                {[0, 60, 120, 180, 240, 300].map((rotation, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 origin-center"
                    initial={{ rotate: rotation, scale: 1, x: 0, y: 0, opacity: 1 }}
                    animate={{
                      scale: 0.8,
                      x: Math.cos(rotation * (Math.PI / 180)) * 100,
                      y: Math.sin(rotation * (Math.PI / 180)) * 100 + 100,
                      rotate: rotation + (Math.random() * 90 - 45),
                      opacity: 0
                    }}
                    transition={{ duration: 1.2, ease: "easeIn" }}
                  >
                    {/* Fragment Shape */}
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl text-[#8B0000]">
                      <path d="M50 50 L100 20 A50 50 0 0 1 100 80 Z" fill="currentColor" />
                      <path d="M50 50 L100 20 A50 50 0 0 1 100 80 Z" fill="url(#ribbonGrad)" opacity="0.6" />
                    </svg>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </motion.div>
      </div>

      {/* Magic Dust Particles */}
      {isCracked && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFF8DC] shadow-[0_0_10px_#D4AF37]"
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 1
              }}
              animate={{
                x: p.x,
                y: p.y,
                scale: p.scale,
                opacity: 0
              }}
              transition={{
                duration: 1.2 + Math.random() * 0.5,
                ease: "easeOut",
                delay: p.delay
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
