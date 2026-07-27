"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '1rem'
};

const center = {
  lat: 28.6139,
  lng: 77.2090
}; // Placeholder: New Delhi

function MapComponent({ apiKey }: { apiKey: string }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  if (!isLoaded) {
    return <MapPlaceholder text="Loading Map..." />;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      options={{
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
          }
        ],
        disableDefaultUI: true,
        zoomControl: true
      }}
    >
      <Marker position={center} />
    </GoogleMap>
  );
}

function MapPlaceholder({ text = "Map Integration Pending (Needs API Key)" }: { text?: string }) {
  return (
    <div className="w-full h-[400px] bg-[#E8D0D8] rounded-xl flex items-center justify-center text-center p-4">
      <p className="font-sans text-[#800000]">{text}</p>
    </div>
  );
}

export default function VenueMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <section className="py-24 px-4 w-full bg-[#F9E0E8] relative flex flex-col items-center">
      <div className="absolute inset-0 bg-texture opacity-20 mix-blend-multiply" />
      
      <motion.div 
        className="z-10 w-full max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-serif text-4xl md:text-5xl text-[#800000] text-center mb-12">Venue</h2>
        
        <div className="glass p-4 rounded-2xl shadow-xl">
          {apiKey ? <MapComponent apiKey={apiKey} /> : <MapPlaceholder />}
          
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 px-4">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-2xl text-[#800000] mb-1">The Grand Palace</h3>
              <p className="font-sans text-[#2A2A2A]">123 Wedding Lane, New Delhi, India</p>
            </div>
            
            <a 
              href="https://maps.google.com/?q=28.6139,77.2090" 
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
