"use client";

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import the map to avoid SSR issues with Leaflet's window requirement
const Map = dynamic(() => import('@/components/ui/Map'), { 
  ssr: false,
  loading: () => <MapPlaceholder text="Loading Map..." />
});

// Extracted from the provided Google Maps link
const center: [number, number] = [16.203538, 79.794578]; 

function MapPlaceholder({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="w-full h-full bg-[#E8D0D8] flex items-center justify-center text-center p-4">
      <p className="font-sans text-[#800000]">{text}</p>
    </div>
  );
}

export default function VenueMap() {
  return (
    <section className="py-24 px-4 w-full bg-[#F9E0E8] relative flex flex-col items-center">
      <div className="absolute inset-0 bg-texture" />
      
      <motion.div 
        className="z-10 w-full max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-serif text-4xl md:text-5xl text-[#800000] text-center mb-12">Venue</h2>
        
        <div className="glass p-4 rounded-2xl shadow-xl">
          <div className="w-full h-[400px] rounded-xl overflow-hidden relative border border-[#D4AF37]/30">
            <Map center={center} />
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 px-4">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-2xl text-[#800000] mb-1">Vanikunta</h3>
              <p className="font-sans text-[#2A2A2A]">6Q3V+CR8 Vanikunta, Andhra Pradesh</p>
            </div>
            
            <a 
              href="https://www.google.com/maps/search/?api=1&query=16.203538,79.794578" 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#800000] text-white px-8 py-3 rounded-full font-sans hover:bg-[#A52A2A] transition-colors shadow-lg flex items-center gap-2"
            >
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
