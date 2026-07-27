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
          <div className="absolute inset-0 bg-[#F8F0DC] envelope-linen shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-md overflow-hidden border border-[#D4AF37]/20">
            {/* Gold foil trim */}
            <div className="absolute inset-2 border-[1.5px] border-[#D4AF37]/40 rounded-sm">
              <div className="absolute inset-0 animate-shimmer opacity-50 pointer-events-none" />
            </div>
            
            {/* Floral motifs (SVG) */}
            <svg className="absolute top-4 left-4 w-12 h-12 text-[#D4AF37]/30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C9.5 2 7 4 7 7c0 2 1.5 3.5 3.5 3.5 0 2-2 4-4 4-1.5 0-2.5-1-2.5-2 0-2 2-3 2-3s-1-2-3-2c-1.5 0-3 1.5-3 3.5C0 14.5 3 16 6 16c2.5 0 4-1.5 5.5-3 .5 1 .5 2 .5 2s-1.5 2-1.5 3.5c0 1.5 1 2.5 2.5 2.5 1.5 0 2.5-1 2.5-2.5 0-1.5-1.5-2.5-1.5-3.5 0 0 0-1 .5-2 1.5 1.5 3 3 5.5 3 3 0 6-1.5 6-4 0-2-1.5-3-3-3s-2.5 1-2.5 2c0 1-2-1-2-1-2 0-4-2-4-4 0-1.5 1.5-2.5 3.5-3.5 1.5 0 3-1.5 3-3.5 0-2-2-4-4.5-4z"/>
            </svg>
            <svg className="absolute bottom-4 right-4 w-12 h-12 text-[#D4AF37]/30 rotate-180" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C9.5 2 7 4 7 7c0 2 1.5 3.5 3.5 3.5 0 2-2 4-4 4-1.5 0-2.5-1-2.5-2 0-2 2-3 2-3s-1-2-3-2c-1.5 0-3 1.5-3 3.5C0 14.5 3 16 6 16c2.5 0 4-1.5 5.5-3 .5 1 .5 2 .5 2s-1.5 2-1.5 3.5c0 1.5 1 2.5 2.5 2.5 1.5 0 2.5-1 2.5-2.5 0-1.5-1.5-2.5-1.5-3.5 0 0 0-1 .5-2 1.5 1.5 3 3 5.5 3 3 0 6-1.5 6-4 0-2-1.5-3-3-3s-2.5 1-2.5 2c0 1-2-1-2-1-2 0-4-2-4-4 0-1.5 1.5-2.5 3.5-3.5 1.5 0 3-1.5 3-3.5 0-2-2-4-4.5-4z"/>
            </svg>
          </div>

          {/* Invitation Card (Inside) */}
          <motion.div 
            className="absolute inset-[4px] bg-[#FFFFF0] rounded-sm z-10 flex flex-col items-center justify-center p-8 shadow-inner border border-gray-200/50"
            initial={{ y: 0, opacity: 0 }}
            animate={{ 
              y: isCardRevealed ? -120 : 0,
              opacity: isFlapOpen ? 1 : 0
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="w-full h-full border border-[#D4AF37]/30 rounded p-4 flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-texture opacity-20" />
               <div className="z-10 text-center">
                  <h2 className="font-serif text-3xl md:text-5xl text-[#800000] mb-2 tracking-wide">K & L</h2>
                  <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#D4AF37]">The Wedding</p>
               </div>
            </div>
          </motion.div>

          {/* Envelope Flap (Top) */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[55%] origin-top z-20 will-change-transform backface-hidden"
            initial={{ rotateX: 0 }}
            animate={{ 
              rotateX: isFlapOpen ? -180 : 0,
              zIndex: isFlapOpen ? 5 : 20
            }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Front of Flap */}
            <div className="absolute inset-0 bg-[#F8F0DC] envelope-linen shadow-[0_10px_20px_rgba(0,0,0,0.2)] rounded-b-[45%] border-b border-[#D4AF37]/30 backface-hidden">
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
            </div>
            {/* Back of Flap (Inner Lining) */}
            <div className="absolute inset-0 bg-[#1B4332] rounded-b-[45%] shadow-inner border-t border-black/20 backface-hidden" style={{ transform: 'rotateX(180deg)' }}>
               {/* Chevron pattern for inner lining */}
               <div className="absolute inset-0 opacity-20" style={{
                 backgroundImage: 'linear-gradient(45deg, #D4AF37 25%, transparent 25%, transparent 75%, #D4AF37 75%, #D4AF37), linear-gradient(45deg, #D4AF37 25%, transparent 25%, transparent 75%, #D4AF37 75%, #D4AF37)',
                 backgroundSize: '20px 20px',
                 backgroundPosition: '0 0, 10px 10px'
               }} />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-[45%]" />
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
                 style={{ backgroundImage: "url('/Wedding_Invite2/waxseal.jpeg')" }}
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
