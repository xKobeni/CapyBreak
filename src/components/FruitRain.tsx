"use client";

import React from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { Citrus } from "lucide-react";

export const FruitRain: React.FC<{ onTrigger?: () => void }> = ({ onTrigger }) => {
  const triggerRain = () => {
    if (onTrigger) onTrigger();

    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ffa500", "#ffcc00", "#ff6600"],
        shapes: ["circle"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ffa500", "#ffcc00", "#ff6600"],
        shapes: ["circle"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      onClick={triggerRain}
      className="flex items-center gap-2 px-6 py-3 bg-cozy-orange text-white rounded-full font-bold shadow-xl shadow-cozy-orange/30 transition-transform active:scale-95"
    >
      <Citrus className="w-6 h-6 animate-pulse" />
      <span>Emergency Orange 🍊</span>
    </motion.button>
  );
};
