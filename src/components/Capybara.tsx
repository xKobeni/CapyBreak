"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

export type AccessoryType = "none" | "flower" | "sunglasses" | "hat";

export type CapyMood = 
  | "normal" 
  | "happy" 
  | "sleepy" 
  | "excited" 
  | "tired" 
  | "motivation" 
  | "overloaded" 
  | "stressful" 
  | "compliment";

interface CapybaraProps {
  mood?: CapyMood;
  accessory?: AccessoryType;
  onPet?: () => void;
  onTap?: () => void;
}

export const Capybara: React.FC<CapybaraProps> = ({ mood = "normal", accessory = "none", onPet, onTap }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPetted, setIsPetted] = useState(false);
  const [isTwitching, setIsTwitching] = useState(false);
  const [shake, setShake] = useState(0);
  
  // Trigger a little shake when mood changes
  useEffect(() => {
    setShake(5);
    const timeout = setTimeout(() => setShake(0), 500);
    return () => clearTimeout(timeout);
  }, [mood]);
  
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
      if (mood === "sleepy" || mood === "tired" || mood === "overloaded") return;
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 600);
      setTimeout(blinkRandomly, Math.random() * 15000 + 8000);
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
  }, [mood]);

  const handleInteraction = () => {
    if (onTap) onTap();
    setIsPetted(true);
    if (onPet) onPet();
    setTimeout(() => setIsPetted(false), 2000);
  };

  // Dynamic SVG components based on mood
  const renderEyes = () => {
    if (mood === "sleepy" || mood === "tired" || isBlinking) {
      return (
        <g>
          <path d="M100 85H110" stroke="#1A1108" strokeWidth="3" strokeLinecap="round" />
          {mood === "tired" && <path d="M102 89H108" stroke="#1A1108" strokeWidth="1" opacity="0.3" />}
        </g>
      );
    }
    if (mood === "overloaded") {
      return (
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "105px 85px" }}
        >
          <path 
            d="M101 85Q105 81 109 85T101 85" 
            stroke="#1A1108" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round"
          />
          <circle cx="105" cy="85" r="1.5" fill="#1A1108" />
        </motion.g>
      );
    }
    if (mood === "motivation" || mood === "excited") {
      return (
        <g>
          <circle cx="105" cy="85" r="5" fill="#1A1108" />
          <circle cx="107" cy="83" r="2" fill="white" />
        </g>
      );
    }
    if (mood === "stressful") {
      return (
        <g>
          <circle cx="105" cy="85" r="2.5" fill="#1A1108" />
          <path d="M100 80L110 82" stroke="#1A1108" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    }
    return <circle cx="105" cy="85" r="4" fill="#1A1108" />;
  };

  const renderMouth = () => {
    const isHappyState = mood === "happy" || mood === "compliment" || isPetted;
    if (isHappyState) {
      return (
        <motion.path 
          initial={{ d: "M50 128H70" }}
          animate={{ d: "M45 125Q60 135 75 125" }}
          stroke="#1A1108" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          opacity="0.6" 
        />
      );
    }
    if (mood === "stressful" || mood === "tired") {
      return <path d="M50 132Q60 128 70 132" stroke="#1A1108" strokeWidth="2" strokeLinecap="round" opacity="0.4" />;
    }
    if (mood === "overloaded") {
      return <circle cx="60" cy="128" r="3" stroke="#1A1108" strokeWidth="1.5" fill="none" opacity="0.4" />;
    }
    return <path d="M50 128H70" stroke="#1A1108" strokeWidth="2" strokeLinecap="round" opacity="0.3" />;
  };

  return (
    <div className="relative cursor-pointer select-none touch-none" onClick={handleInteraction}>
      <motion.div
        animate={{
          y: mood === "excited" ? [0, -15, 0] : [0, -5, 0],
          rotate: mood === "overloaded" ? [0, -2, 2, 0] : [0, -shake, shake, 0],
          scale: mood === "motivation" ? 1.05 : 1
        }}
        transition={{
          duration: mood === "excited" ? 0.3 : (shake > 0 ? 0.4 : 4),
          repeat: mood === "excited" || mood === "overloaded" ? Infinity : (shake > 0 ? 2 : Infinity),
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

          {/* Legs */}
          <rect x="75" y="140" width="16" height="22" rx="8" fill="#4D331F" />
          <rect x="155" y="140" width="16" height="22" rx="8" fill="#4D331F" />
          <rect x="95" y="145" width="16" height="22" rx="8" fill="#3D230F" />
          <rect x="135" y="145" width="16" height="22" rx="8" fill="#3D230F" />

          {/* The "Potato" Body */}
          <motion.path
            d="M30 90C30 50 60 40 120 40C180 40 210 50 210 100C210 150 180 160 120 160C60 160 30 140 30 90Z"
            fill={mood === "stressful" ? "#8B5E34" : mood === "motivation" ? "#C69C72" : "#A67C52"}
            animate={{
              scaleY: mood === "tired" ? [1, 0.98, 1] : [1, 1.01, 1],
              scaleX: mood === "tired" ? [1, 1.05, 1] : 1
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Facial Features Group */}
          <motion.g style={{ x: headX, y: headY }}>
            {/* Tiny Ear */}
            <motion.path 
              d="M110 38C110 33 120 33 120 38V46H110V38Z" 
              fill="#7D5A3C" 
              style={{ transformOrigin: "115px 46px" }}
              animate={{
                rotate: mood === "motivation" || mood === "excited" ? [0, -15, 0] : 0
              }}
              transition={{ repeat: Infinity, duration: 1 }}
            />

            {/* Snout */}
            <motion.g animate={{ x: isTwitching ? [0, 1.5, -1.5, 0] : 0 }}>
              <path
                d="M30 85C30 75 40 70 75 70C85 70 95 80 95 105C95 130 85 140 75 140C40 140 30 130 30 85Z"
                fill="#7D5A3C"
              />
              <circle cx="45" cy="85" r="1.5" fill="#1A1108" opacity="0.3" />
              <circle cx="60" cy="85" r="1.5" fill="#1A1108" opacity="0.3" />
              {renderMouth()}
              
              {/* Stress Sweat Drop */}
              {mood === "stressful" && (
                <motion.path
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], y: [0, 10] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  d="M40 75Q42 70 44 75T40 75"
                  fill="#3498DB"
                />
              )}
            </motion.g>

            {/* Eyes */}
            {renderEyes()}

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
              {(isPetted || mood === "happy" || mood === "compliment") && (
                <motion.circle
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.6, scale: 1.5 }}
                  exit={{ opacity: 0, scale: 0 }}
                  cx="110" cy="105" r="8" fill="#FFB7C5"
                />
              )}
            </AnimatePresence>
          </motion.g>

          {/* The Orange */}
          <motion.g style={{ x: headX, y: headY }}>
            <circle cx="145" cy="42" r="12" fill="#F39C12" />
            <path d="M145 30C147 25 153 25 150 30C147 35 145 30 145 30Z" fill="#27AE60" />
            <circle cx="140" cy="37" r="2.5" fill="white" opacity="0.4" />
          </motion.g>
        </svg>

        {/* Petting Feedback Hearts/Sparkles */}
        <AnimatePresence>
          {(isPetted || mood === "compliment" || mood === "motivation") && (
            <div className="absolute top-0 pointer-events-none">
              {[...Array(mood === "compliment" || mood === "motivation" ? 10 : 6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl"
                  initial={{ opacity: 0, scale: 0, y: 80, x: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0.5, 2, 1],
                    y: -150 - Math.random() * 100,
                    x: (i - 4) * 50 + (Math.random() - 0.5) * 40
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  {mood === "compliment" ? "✨" : mood === "motivation" ? "🌱" : "❤️"}
                </motion.span>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
