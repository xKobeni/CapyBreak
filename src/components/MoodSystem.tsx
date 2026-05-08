"use client";

import React from "react";
import { motion } from "framer-motion";

export type MoodType = "normal" | "tired" | "motivation" | "overloaded" | "stressful" | "compliment";

interface MoodSystemProps {
  currentMood: MoodType;
  setMood: (mood: MoodType) => void;
}

export const MOOD_DATA = {
  normal: {
    label: "Feeling okay",
    quotes: [
      "Kaya mo 'yan!",
      "Chill ka muna, 'wag masyadong seryoso.",
      "You're doing great, keep it up!",
      "Step by step lang."
    ],
    gradient: "from-cozy-beige to-cozy-cream",
    particles: "✨",
  },
  tired: {
    label: "I'm tired",
    quotes: [
      "Higa ka muna, deserve mo mag-rest.",
      "Take a breathe. You've done enough.",
      "Pagod is real, pero proud ako sa'yo.",
      "Bawi tayo bukas, pahinga muna ngayon."
    ],
    gradient: "from-cozy-beige to-orange-100",
    particles: "💤",
  },
  motivation: {
    label: "Need motivation",
    quotes: [
      "Kaya mo 'yan! Konti na lang.",
      "Galing mo talaga, bilib ako sa'yo.",
      "You've got this! Naniniwala ako sa'yo.",
      "Go lang nang go, andito lang ako."
    ],
    gradient: "from-cozy-beige to-yellow-100",
    particles: "🌱",
  },
  compliment: {
    label: "Need compliment",
    quotes: [
      "Ang ganda ng smile mo ngayon!",
      "You have such a kind heart.",
      "Ang cute mo.",
      "Cute mo parin kahit stressed ka."
    ],
    gradient: "from-cozy-beige to-pink-100",
    particles: "💖",
  },
  overloaded: {
    label: "Brain overloaded",
    quotes: [
      "Isa-isa lang, 'wag mong pilitin.",
      "Clear your mind. Snacks ka muna.",
      "Don't sweat it, take it easy.",
      "Okay lang mag-pause, relax ka muna."
    ],
    gradient: "from-cozy-beige to-blue-50",
    particles: "🧠",
  },
  stressful: {
    label: "Everything is stressful",
    quotes: [
      "Hingang malalim, kaya mo 'yan.",
      "Solid ka. Na-survive mo ang araw.",
      "You're stronger than you think.",
      "Relax ka lang, andito lang ang capy break mo."
    ],
    gradient: "from-cozy-beige to-rose-50",
    particles: "🌸",
  },
};

export const MoodSystem: React.FC<MoodSystemProps> = ({ currentMood, setMood }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-md mx-auto p-2 md:p-4">
      {Object.entries(MOOD_DATA).map(([key, data]) => (
        <motion.button
          key={key}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMood(key as MoodType)}
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
            currentMood === key
              ? "bg-cozy-orange text-white shadow-lg shadow-cozy-orange/20"
              : "bg-white/50 text-cozy-coffee hover:bg-white/80 glass"
          }`}
        >
          {data.label}
        </motion.button>
      ))}
    </div>
  );
};
