"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <motion.a
        href="https://wa.me/1234567890" // Replace with real number
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaWhatsapp size={24} />
      </motion.a>
      
      <motion.a
        href="tel:+1234567890"
        className="w-12 h-12 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaPhoneAlt size={20} />
      </motion.a>
      
      <motion.a
        href="mailto:wedding@example.com"
        className="w-12 h-12 rounded-full bg-[#800000] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaEnvelope size={20} />
      </motion.a>
    </div>
  );
}
