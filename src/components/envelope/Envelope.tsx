"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeProps {
  onOpen: () => void;
}

export default function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleOpen = () => {
    setIsOpen(true);
    // Trigger onOpen callback after the animation completes
    setTimeout(() => {
      setIsVisible(false);
      onOpen();
    }, 2000); // 2 seconds for the sequence
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        initial={{ opacity: 1 }}
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 1, delay: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative w-full max-w-md aspect-[3/4] md:aspect-[4/3] mx-4 perspective-1000">
          <motion.div
            className="w-full h-full relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: isOpen ? 1.1 : 1, y: isOpen ? 50 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            {/* Envelope Back */}
            <div className="absolute inset-0 bg-texture bg-[#F9E0E8] shadow-2xl rounded-sm" />

            {/* Envelope Flap */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1/2 bg-[#F3E5AB] origin-top bg-texture shadow-lg z-20 rounded-b-[50%] border-b border-[#D4AF37]/30"
              initial={{ rotateX: 0 }}
              animate={{ rotateX: isOpen ? 180 : 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />

            {/* Wax Seal */}
            <AnimatePresence>
              {!isOpen && (
                <motion.button
                  onClick={handleOpen}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#800000] shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex items-center justify-center border-4 border-[#F3E5AB]/20 cursor-pointer hover:scale-105 transition-transform"
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white font-serif text-sm tracking-widest text-center shadow-sm">
                    Tap to<br/>Open
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Particles */}
        {isOpen && (
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[#D4AF37]"
                initial={{
                  x: "50vw",
                  y: "50vh",
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `calc(50vw + ${(Math.random() - 0.5) * 500}px)`,
                  y: `calc(50vh + ${(Math.random() - 0.5) * 500}px)`,
                  scale: Math.random() * 2 + 1,
                  opacity: 0
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                  delay: Math.random() * 0.2
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
