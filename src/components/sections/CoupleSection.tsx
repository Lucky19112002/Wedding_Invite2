"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function CoupleSection() {
  return (
    <section className="py-24 px-4 w-full bg-[#FFFFF0] relative overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 bg-texture opacity-10 pointer-events-none" />

      <motion.div
        className="z-10 w-full max-w-5xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-serif text-4xl md:text-5xl text-[#800000] text-center mb-16">
          The Happy Couple
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-8 lg:gap-16">
          {/* Bride */}
          <motion.div
            className="glass p-8 md:p-10 rounded-2xl w-full max-w-sm flex flex-col items-center text-center border-t-4 border-[#D4AF37]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-24 h-24 mb-6 rounded-full bg-[#F9E0E8] border-2 border-[#D4AF37] flex items-center justify-center text-3xl overflow-hidden">
              <img
                src="/Wedding_Invite2/BrideImaghe.jpeg"
                alt="Bride"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-serif text-3xl text-[#800000] mb-2">
              Dr. Sayed Kareena
            </h3>
            <p className="font-sans text-[#D4AF37] text-sm uppercase tracking-widest font-semibold mb-4">
              Bachelor of Physiotherapy <br /> Physiotherapist
            </p>
            <p className="font-sans text-[#555] text-sm leading-relaxed italic">
              Daughter of <br />
              <span className="font-semibold text-[#2A2A2A] not-italic">
                Mr. Nawabpasha Sayed
              </span>{" "}
              <br />
              & <br />
              <span className="font-semibold text-[#2A2A2A] not-italic">
                Mrs. Haji Mastani Sayed
              </span>
            </p>
          </motion.div>

          {/* Center Ampersand */}
          <motion.div
            className="font-serif text-6xl text-[#D4AF37] opacity-60 hidden md:block"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            &
          </motion.div>

          {/* Groom */}
          <motion.div
            className="glass p-8 md:p-10 rounded-2xl w-full max-w-sm flex flex-col items-center text-center border-t-4 border-[#D4AF37]"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-24 h-24 mb-6 rounded-full bg-[#F9E0E8] border-2 border-[#D4AF37] flex items-center justify-center text-3xl overflow-hidden">
              <img src="/Wedding_Invite2/groomepic.png" alt="Groom" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-serif text-3xl text-[#800000] mb-2">
              Er. Lucky Pathan
            </h3>
            <p className="font-sans text-[#D4AF37] text-sm uppercase tracking-widest font-semibold mb-4">
              B.Tech CSE <br /> Full Stack Developer
            </p>
            <p className="font-sans text-[#555] text-sm leading-relaxed italic">
              Son of <br />
              <span className="font-semibold text-[#2A2A2A] not-italic">
                Dr. ShanNawabKhan S.S Pathan
              </span>{" "}
              <br />
              & <br />
              <span className="font-semibold text-[#2A2A2A] not-italic">
                Mrs. Hasina Pathan
              </span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
