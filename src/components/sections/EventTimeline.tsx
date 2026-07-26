"use client";

import React from 'react';
import { motion } from 'framer-motion';

const events = [
  {
    id: 'engagement',
    title: 'Engagement',
    date: 'Dec 23, 2026',
    time: '10:00 AM',
    venue: 'The Grand Palace, New Delhi',
    icon: '💍'
  },
  {
    id: 'mehendi',
    title: 'Mehendi',
    date: 'Dec 24, 2026',
    time: '04:00 PM',
    venue: 'Bride\'s Residence',
    icon: '🌿'
  },
  {
    id: 'haldi',
    title: 'Haldi',
    date: 'Dec 25, 2026',
    time: '09:00 AM',
    venue: 'Bride\'s Residence',
    icon: '☀️'
  },
  {
    id: 'sangeet',
    title: 'Sangeet',
    date: 'Dec 25, 2026',
    time: '07:00 PM',
    venue: 'Royal Gardens',
    icon: '🎵'
  },
  {
    id: 'wedding',
    title: 'Wedding Ceremony',
    date: 'Dec 26, 2026',
    time: '08:00 PM',
    venue: 'The Grand Palace, New Delhi',
    icon: '✨'
  }
];

export default function EventTimeline() {
  return (
    <section className="py-24 px-4 w-full bg-[#FFFFF0] relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative">
        <motion.h2 
          className="font-serif text-4xl md:text-5xl text-[#800000] text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Event Timeline
        </motion.h2>

        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 top-[120px] bottom-0 w-px bg-[#D4AF37]/30 transform md:-translate-x-1/2 hidden sm:block" />

        <div className="flex flex-col gap-12 relative z-10">
          {events.map((event, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div 
                key={event.id}
                className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                  <div className="glass p-8 rounded-2xl w-full max-w-sm border-t-4 border-t-[#D4AF37] hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl mb-4 text-center">{event.icon}</div>
                    <h3 className="font-serif text-2xl text-[#800000] mb-2 text-center">{event.title}</h3>
                    <p className="font-sans text-[#2A2A2A] text-center font-medium">{event.date}</p>
                    <p className="font-sans text-[#555] text-center text-sm mb-4">{event.time}</p>
                    <p className="font-sans text-[#800000]/80 text-center text-sm italic">{event.venue}</p>
                  </div>
                </div>
                
                {/* Timeline Dot */}
                <div className="hidden sm:flex absolute left-4 md:left-1/2 w-8 h-8 bg-[#FFFFF0] border-4 border-[#D4AF37] rounded-full transform -translate-x-1/2 z-20 items-center justify-center">
                   <div className="w-2 h-2 bg-[#800000] rounded-full" />
                </div>
                
                <div className="hidden md:block w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
