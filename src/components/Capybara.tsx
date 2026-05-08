"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export type AccessoryType = "none" | "flower" | "sunglasses" | "hat";

interface CapybaraProps {
  mood?: "normal" | "happy" | "sleepy" | "excited";
  accessory?: AccessoryType;
  onPet?: () => void;
  onTap?: () => void;
}

export const Capybara: React.FC<CapybaraProps> = ({ mood = "normal", accessory = "none", onPet, onTap }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPetted, setIsPetted] = useState(false);
  const [isTwitching, setIsTwitching] = useState(false);
  
  // For head tilting follow cursor
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const headX = useSpring(useTransform(mouseX, [-200, 200], [-4, 4]), springConfig);
  const headY = useSpring(useTransform(mouseY, [-200, 200], [-2, 2]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = clientX - window.innerWidth / 2;
      const y = clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Random blinking and twitching
  useEffect(() => {
    const blinkRandomly = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
      setTimeout(blinkRandomly, Math.random() * 5000 + 3000);
    };
    
    const twitchRandomly = () => {
      setIsTwitching(true);
      setTimeout(() => setIsTwitching(false), 200);
      setTimeout(twitchRandomly, Math.random() * 10000 + 7000);
    };

    const blinkTimeout = setTimeout(blinkRandomly, 3000);
    const twitchTimeout = setTimeout(twitchRandomly, 5000);
    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(twitchTimeout);
    };
  }, []);

  const handleInteraction = () => {
    if (onTap) onTap();
    setIsPetted(true);
    if (onPet) onPet();
    setTimeout(() => setIsPetted(false), 2000);
  };

  return (
    <div className="relative cursor-pointer select-none touch-none" onClick={handleInteraction}>
      <motion.div
        animate={{
          y: mood === "excited" ? [0, -12, 0] : [0, -5, 0],
        }}
        transition={{
          duration: mood === "excited" ? 0.4 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center justify-center"
      >
        <svg
          width="320"
          height="240"
          viewBox="0 0 240 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_20px_40px_rgba(75,54,33,0.15)]"
        >
          {/* Subtle Shadow */}
          <ellipse cx="120" cy="165" rx="60" ry="8" fill="rgba(75,54,33,0.1)" />

          {/* Legs (Short dark brown stumps) */}
          <rect x="75" y="140" width="16" height="22" rx="8" fill="#4D331F" />
          <rect x="155" y="140" width="16" height="22" rx="8" fill="#4D331F" />
          <rect x="95" y="145" width="16" height="22" rx="8" fill="#3D230F" />
          <rect x="135" y="145" width="16" height="22" rx="8" fill="#3D230F" />

          {/* The "Potato" Body */}
          <motion.path
            d="M30 90C30 50 60 40 120 40C180 40 210 50 210 100C210 150 180 160 120 160C60 160 30 140 30 90Z"
            fill="#A67C52"
            animate={{
              scaleY: [1, 1.01, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Facial Features Group */}
          <motion.g style={{ x: headX, y: headY }}>
            {/* Tiny Ear */}
            <path d="M150 45C150 40 160 40 160 45V52H150V45Z" fill="#7D5A3C" />

            {/* Snout */}
            <motion.g animate={{ x: isTwitching ? [0, 1.5, -1.5, 0] : 0 }}>
              <path
                d="M30 85C30 75 40 70 75 70C85 70 95 80 95 105C95 130 85 140 75 140C40 140 30 130 30 85Z"
                fill="#7D5A3C"
              />
              <circle cx="45" cy="85" r="1.5" fill="#1A1108" opacity="0.3" />
              <circle cx="60" cy="85" r="1.5" fill="#1A1108" opacity="0.3" />
              <path 
                d={mood === "happy" || isPetted ? "M45 125Q60 130 75 125" : "M50 128H70"} 
                stroke="#1A1108" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                opacity="0.2"
              />
            </motion.g>

            {/* Eyes */}
            {!isBlinking && mood !== "sleepy" ? (
              <circle cx="105" cy="85" r="3" fill="#1A1108" />
            ) : (
              <path d="M102 85H108" stroke="#1A1108" strokeWidth="2" strokeLinecap="round" />
            )}

            {/* Accessories */}
            {accessory === "sunglasses" && (
              <g transform="translate(100, 80)">
                <rect x="0" y="0" width="12" height="8" rx="2" fill="#1A1108" />
                <rect x="15" y="0" width="12" height="8" rx="2" fill="#1A1108" />
                <rect x="12" y="2" width="3" height="2" fill="#1A1108" />
              </g>
            )}

            {accessory === "flower" && (
              <g transform="translate(145, 40)">
                <circle cx="0" cy="0" r="4" fill="#FFB7C5" />
                <circle cx="6" cy="2" r="4" fill="#FFB7C5" />
                <circle cx="4" cy="8" r="4" fill="#FFB7C5" />
                <circle cx="-2" cy="6" r="4" fill="#FFB7C5" />
                <circle cx="2" cy="4" r="2" fill="#F1C40F" />
              </g>
            )}

            {accessory === "hat" && (
              <path 
                d="M140 45L155 15L170 45H140Z" 
                fill="#E74C3C" 
                stroke="#C0392B" 
                strokeWidth="1"
              />
            )}

            {/* Blush */}
            <AnimatePresence>
              {(isPetted || mood === "happy") && (
                <motion.circle
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.4, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  cx="110" cy="105" r="8" fill="#FFB7C5"
                />
              )}
            </AnimatePresence>
          </motion.g>

          {/* The Orange */}
          <motion.g style={{ x: headX, y: headY }}>
            <circle cx="130" cy="35" r="12" fill="#F39C12" />
            <path d="M130 23C132 18 138 18 135 23C132 28 130 23 130 23Z" fill="#27AE60" />
            <circle cx="125" cy="30" r="2.5" fill="white" opacity="0.4" />
          </motion.g>
        </svg>

        {/* Petting Feedback Hearts */}
        <AnimatePresence>
          {isPetted && (
            <div className="absolute top-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-xl"
                  initial={{ opacity: 0, scale: 0, y: 80, x: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.8],
                    y: -120 - Math.random() * 80,
                    x: (i - 2.5) * 45 + (Math.random() - 0.5) * 30
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  ❤️
                </motion.span>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
