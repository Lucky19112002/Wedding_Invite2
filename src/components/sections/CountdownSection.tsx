"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Set wedding date here
const WEDDING_DATE = new Date('2026-12-05T10:00:00').getTime();

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = WEDDING_DATE - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <section className="py-24 px-4 w-full bg-[#F9E0E8] relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-texture" />
      
      <motion.div 
        className="z-10 text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-serif text-4xl md:text-5xl text-[#800000] mb-12">
          The Countdown Begins
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {timeBlocks.map((block, index) => (
            <motion.div 
              key={block.label}
              className="glass p-6 rounded-2xl w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.5, type: "spring" }}
            >
              <span className="font-serif text-3xl md:text-5xl text-[#D4AF37]">
                {String(block.value).padStart(2, '0')}
              </span>
              <span className="font-sans text-xs md:text-sm uppercase tracking-wider text-[#2A2A2A] mt-2">
                {block.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
