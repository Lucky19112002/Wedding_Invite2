"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-play when component mounts (will likely be blocked by browser until interaction,
  // but we can try, or the user can click play)
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser", e));
    } else if (audioRef.current && !isPlaying) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex gap-3">
      {/* Background Music placeholder - you should add a real track in public/audio/ */}
      <audio ref={audioRef} loop src="/audio/background.mp3" />
      
      <motion.button
        className="w-12 h-12 rounded-full glass flex items-center justify-center text-[#800000] hover:bg-[#F9E0E8]/80 transition-colors shadow-lg"
        onClick={() => setIsPlaying(!isPlaying)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} className="ml-1" />}
      </motion.button>
      
      <motion.button
        className="w-12 h-12 rounded-full glass flex items-center justify-center text-[#800000] hover:bg-[#F9E0E8]/80 transition-colors shadow-lg"
        onClick={() => setIsMuted(!isMuted)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
      </motion.button>
    </div>
  );
}
