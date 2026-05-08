"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Disc, Headphones, Volume2, VolumeX, X } from "lucide-react";

type AmbienceType = "m1" | "m2" | "m3" | "none";

interface AmbientExperienceProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AmbientExperience: React.FC<AmbientExperienceProps> = ({ isVisible, onClose }) => {
  const [activeAmbience, setActiveAmbience] = useState<AmbienceType>("m1");
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initial source setup
  useEffect(() => {
    if (audioRef.current && !audioRef.current.src) {
      audioRef.current.src = `/music/${activeAmbience}.mp3`;
      audioRef.current.volume = 0.5;
    }
  }, []);

  // Play audio on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (hasInteracted) return;
      
      setHasInteracted(true);
      if (audioRef.current && activeAmbience !== "none" && !isMuted) {
        audioRef.current.play().catch(err => console.log("Play failed", err));
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);
    
    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [activeAmbience, isMuted, hasInteracted]);

  useEffect(() => {
    if (audioRef.current) {
      if (activeAmbience === "none" || isMuted) {
        audioRef.current.pause();
      } else {
        const newSrc = `/music/${activeAmbience}.mp3`;
        if (!audioRef.current.src.includes(newSrc)) {
          audioRef.current.src = newSrc;
        }
        
        if (hasInteracted) {
          audioRef.current.play().catch(err => console.log("Play failed", err));
        }
      }
    }
  }, [activeAmbience, isMuted, hasInteracted]);

  const toggleAmbience = (type: AmbienceType) => {
    setActiveAmbience(activeAmbience === type ? "none" : type);
  };

  return (
    <>
      {/* Persistent Audio Tag */}
      <audio ref={audioRef} loop preload="auto" playsInline />

      {/* Modal UI */}
      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-cozy-beige/90 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-2xl"
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-cozy-coffee/40 hover:text-cozy-coffee transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-cozy-coffee mb-1">Ambient Sounds</h2>
                <p className="text-sm text-cozy-coffee/60">Choose your lofi vibe</p>
              </div>

              <div className="flex flex-col gap-6 items-center">
                <div className="flex gap-3">
                  <AmbienceButton
                    icon={<Music className="w-5 h-5" />}
                    active={activeAmbience === "m1"}
                    onClick={() => toggleAmbience("m1")}
                    label="Lofi 1"
                  />
                  <AmbienceButton
                    icon={<Disc className="w-5 h-5" />}
                    active={activeAmbience === "m2"}
                    onClick={() => toggleAmbience("m2")}
                    label="Lofi 2"
                  />
                  <AmbienceButton
                    icon={<Headphones className="w-5 h-5" />}
                    active={activeAmbience === "m3"}
                    onClick={() => toggleAmbience("m3")}
                    label="Lofi 3"
                  />
                </div>
                
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-cozy-coffee/60 hover:text-cozy-coffee transition-colors flex items-center gap-2"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  <span className="text-xs uppercase tracking-widest font-bold">
                    {isMuted ? "Paused" : "Playing"}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const AmbienceButton: React.FC<{ 
  icon: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
  label: string;
}> = ({ icon, active, onClick, label }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all min-w-[70px] ${
      active 
        ? "bg-cozy-orange text-white shadow-lg shadow-cozy-orange/30" 
        : "bg-white/40 text-cozy-coffee/70 hover:bg-white/60"
    }`}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </motion.button>
);
