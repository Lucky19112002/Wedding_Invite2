"use client";

import { useState } from 'react';
import Envelope from '@/components/envelope/Envelope';
import CountdownSection from '@/components/sections/CountdownSection';
import EventTimeline from '@/components/sections/EventTimeline';
import VenueMap from '@/components/sections/VenueMap';

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center w-full relative">
      {!isOpened && <Envelope onOpen={() => setIsOpened(true)} />}
      
      {/* Main Content - Smooth fade in after envelope is opened */}
      <div 
        className={`w-full transition-opacity duration-1000 ${
          isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden pointer-events-none'
        }`}
      >
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center relative">
          <div className="absolute inset-0 bg-texture pointer-events-none" />
          <div className="glass p-8 md:p-12 rounded-3xl z-10 max-w-2xl w-full">
            <h1 className="font-serif text-5xl md:text-7xl text-[#800000] mb-4 tracking-wide">
              Kareena & Lucky
            </h1>
            <p className="font-sans text-lg md:text-xl text-[#2A2A2A] tracking-widest uppercase mb-8">
              Are getting married
            </p>
            <p className="font-serif text-2xl text-[#D4AF37] italic">
              "Every love story is beautiful, but ours is my favorite."
            </p>
          </div>
        </section>
        
        <CountdownSection />
        <EventTimeline />
        <VenueMap />
      </div>
    </main>
  );
}
