"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ComfortCounterProps {
  count: number;
}

export const ComfortCounter: React.FC<ComfortCounterProps> = ({ count }) => {
  return (
    <div className="text-center">
      <motion.p 
        key={count}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-cozy-coffee/60 text-[10px] md:text-sm font-medium uppercase tracking-widest"
      >
        Capybara comfort level
      </motion.p>
      <motion.p 
        key={`num-${count}`}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl md:text-4xl font-bold text-cozy-coffee"
      >
        {count.toLocaleString()}
      </motion.p>
    </div>
  );
};

export const QuoteDisplay: React.FC<{ quote: string }> = ({ quote }) => {
  return (
    <div className="min-h-[80px] md:min-h-[100px] flex items-center justify-center px-4 md:px-6 text-center py-2">
      <AnimatePresence mode="wait">
        <motion.p
          key={quote}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-lg md:text-2xl font-medium text-cozy-coffee/80 italic leading-relaxed"
        >
          “{quote}”
        </motion.p>
      </AnimatePresence>
    </div>
  );
};
