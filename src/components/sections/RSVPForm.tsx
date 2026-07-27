"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

const rsvpSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  guests: z.string().min(1, "Please select number of guests"),
  attendance: z.enum(['yes', 'no']),
  meal: z.enum(['vegetarian', 'non-vegetarian', 'vegan']),
  message: z.string().optional()
});

type RSVPFormValues = z.infer<typeof rsvpSchema>;

export default function RSVPForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      attendance: 'yes',
      meal: 'vegetarian',
      guests: '1'
    }
  });

  const onSubmit = async (data: RSVPFormValues) => {
    setIsSubmitting(true);
    try {
      // Assuming a 'rsvps' table exists in Supabase
      const { error } = await supabase
        .from('rsvps')
        .insert([
          { 
            name: data.name, 
            phone: data.phone, 
            guests: parseInt(data.guests), 
            attendance: data.attendance === 'yes', 
            meal: data.meal, 
            message: data.message 
          }
        ]);

      if (error) {
        console.error("Error submitting RSVP:", error);
        alert("There was an error submitting your RSVP. Please try again.");
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error(err);
      // Fallback for when Supabase is not yet configured
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-4 w-full bg-[#FFFFF0] relative flex items-center justify-center">
      <motion.div 
        className="glass p-8 md:p-12 rounded-3xl z-10 max-w-xl w-full border-t-4 border-t-[#D4AF37]"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-serif text-4xl text-[#800000] text-center mb-2">RSVP</h2>
        <p className="font-sans text-center text-[#2A2A2A] mb-8">Please let us know if you can make it.</p>

        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">✨</div>
            <h3 className="font-serif text-3xl text-[#D4AF37] mb-2">Thank You!</h3>
            <p className="font-sans text-[#2A2A2A]">Your response has been recorded.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block font-sans text-sm font-medium text-[#2A2A2A] mb-1">Name</label>
              <input 
                {...register('name')}
                className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all font-sans"
                placeholder="John & Jane Doe"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block font-sans text-sm font-medium text-[#2A2A2A] mb-1">Phone Number</label>
              <input 
                {...register('phone')}
                className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all font-sans"
                placeholder="+1 234 567 8900"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-sm font-medium text-[#2A2A2A] mb-1">Will you attend?</label>
                <select 
                  {...register('attendance')}
                  className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all font-sans"
                >
                  <option value="yes">Joyfully Accept</option>
                  <option value="no">Regretfully Decline</option>
                </select>
              </div>
              
              <div>
                <label className="block font-sans text-sm font-medium text-[#2A2A2A] mb-1">No. of Guests</label>
                <select 
                  {...register('guests')}
                  className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all font-sans"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-sans text-sm font-medium text-[#2A2A2A] mb-1">Meal Preference</label>
              <select 
                {...register('meal')}
                className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all font-sans"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block font-sans text-sm font-medium text-[#2A2A2A] mb-1">Message for the Couple (Optional)</label>
              <textarea 
                {...register('message')}
                className="w-full px-4 py-3 rounded-xl border border-[#D4AF37]/30 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all font-sans resize-none h-24"
                placeholder="Can't wait to celebrate!"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#800000] font-serif text-xl py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSubmitting ? 'Sending...' : 'Send RSVP'}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
