"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer } from "lucide-react";

interface MeditationSystemProps {
  onMeditationStart: () => void;
  onMeditationEnd: () => void;
  onMeditationComplete: () => void;
}

export const MeditationSystem: React.FC<MeditationSystemProps> = ({ 
  onMeditationStart, 
  onMeditationEnd, 
  onMeditationComplete 
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const DURATION = 3000; // 3 seconds to complete

  const startMeditation = () => {
    setIsPressing(true);
    onMeditationStart();
    const startTime = Date.now();
    
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        onMeditationComplete();
        setIsPressing(false);
        setProgress(0);
      }
    }, 50);
  };

  const stopMeditation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPressing(false);
    setProgress(0);
    onMeditationEnd();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        onMouseDown={startMeditation}
        onMouseUp={stopMeditation}
        onMouseLeave={stopMeditation}
        onTouchStart={startMeditation}
        onTouchEnd={stopMeditation}
        whileTap={{ scale: 0.95 }}
        className="relative w-full md:w-64 h-14 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 overflow-hidden group transition-all duration-300 hover:bg-white/60"
      >
        {/* Progress Bar Background */}
        <motion.div 
          className="absolute inset-0 bg-cozy-orange/20"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
        
        <div className="absolute inset-0 flex items-center justify-center gap-3 text-cozy-coffee font-bold uppercase tracking-widest text-sm">
          <Timer className={`w-5 h-5 transition-transform ${isPressing ? "animate-spin" : ""}`} />
          <span>{isPressing ? "Breathe in..." : "Hold to Meditate"}</span>
        </div>
      </motion.button>
      <p className="text-[10px] text-cozy-coffee/40 uppercase tracking-widest">Hold for 3 seconds</p>
    </div>
  );
};
