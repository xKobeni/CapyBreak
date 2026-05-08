"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Capybara, AccessoryType } from "@/components/Capybara";
import { MoodSystem, MOOD_DATA, MoodType } from "@/components/MoodSystem";
import { FruitRain } from "@/components/FruitRain";
import { AmbientExperience } from "@/components/AmbientExperience";
import { MeditationSystem } from "@/components/MeditationSystem";
import { ComfortCounter, QuoteDisplay } from "@/components/UIElements";
import { Sparkles, Gift, Music, X } from "lucide-react";

export default function Home() {
  const [mood, setMood] = useState<MoodType>("normal");
  const [currentQuote, setCurrentQuote] = useState(MOOD_DATA.normal.quotes[0]);
  const [comfortLevel, setComfortLevel] = useState(0);
  const [isExcited, setIsExcited] = useState(false);
  const [accessory, setAccessory] = useState<AccessoryType>("none");
  const [isMeditating, setIsMeditating] = useState(false);
  const [showAmbientModal, setShowAmbientModal] = useState(false);

  // Load comfort level from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("capy-comfort");
    if (saved) setComfortLevel(parseInt(saved, 10));
  }, []);

  // Save comfort level
  useEffect(() => {
    localStorage.setItem("capy-comfort", comfortLevel.toString());
  }, [comfortLevel]);

  const [isHappy, setIsHappy] = useState(false);

  // Update quote and trigger reaction when mood changes
  useEffect(() => {
    const quotes = MOOD_DATA[mood].quotes;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
    
    // Trigger visual feedback
    setIsHappy(true);
    
    const timeout = setTimeout(() => {
      setIsHappy(false);
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [mood]);

  const handlePet = () => {
    setComfortLevel((prev) => prev + 1);
    
    // Occasionally change quote on pet
    if (Math.random() > 0.7) {
      const quotes = MOOD_DATA[mood].quotes;
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }
  };

  const handleFruitRain = () => {
    setIsExcited(true);
    setComfortLevel((prev) => prev + 10);
    setTimeout(() => setIsExcited(false), 5000);
  };

  const handleGift = () => {
    const accessories: AccessoryType[] = ["flower", "sunglasses", "hat"];
    const randomAccessory = accessories[Math.floor(Math.random() * accessories.length)];
    setAccessory(randomAccessory);
    setComfortLevel((prev) => prev + 5);
    setIsHappy(true);
    setTimeout(() => setIsHappy(false), 2000);
  };

  return (
    <main className={`h-screen h-[100dvh] overflow-hidden transition-colors duration-1000 flex flex-col items-center p-4 md:p-8 bg-gradient-to-b ${MOOD_DATA[mood].gradient}`}>
      
      {/* Top Right Controls */}
      {!isMeditating && (
        <div className="absolute top-4 right-4 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAmbientModal(true)}
            className="p-3 bg-white/40 backdrop-blur-md rounded-full border border-white/50 text-cozy-coffee shadow-sm"
          >
            <Music className="w-5 h-5" />
          </motion.button>
        </div>
      )}

      {/* Persistent Audio & Modal */}
      <AmbientExperience isVisible={showAmbientModal} onClose={() => setShowAmbientModal(false)} />

      {/* Meditation Overlay */}
      <AnimatePresence>
        {isMeditating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Header Info */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg flex flex-col items-center z-10"
      >
        <div className="flex items-center gap-2 px-3 py-1 bg-white/30 backdrop-blur-md rounded-full border border-white/40 mb-2">
          <Sparkles className="w-3 h-3 text-cozy-orange" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-cozy-coffee/70">Aika CapyBreak</span>
        </div>
        
        <div className="flex flex-col items-center">
          <ComfortCounter count={comfortLevel} />
          <h1 className="text-2xl md:text-5xl font-bold text-cozy-coffee text-center -mt-1 md:mt-0">
            {isMeditating ? "Just breathe..." : <>Pause for a <span className="text-cozy-orange">moment</span>.</>}
          </h1>
        </div>
      </motion.header>

      {/* Main Interaction Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative min-h-0 py-2 z-10">
        

        <div className="relative group transition-transform duration-500 max-h-full">
          <div className="scale-[0.7] md:scale-100 flex items-center justify-center">
            <Capybara 
              mood={isMeditating ? "sleepy" : isExcited ? "excited" : isHappy ? "happy" : mood === "stressful" ? "sleepy" : "normal"} 
              accessory={accessory}
              onPet={handlePet}
            />
          </div>
        </div>

        <div className="w-full mt-2">
          <QuoteDisplay quote={isMeditating ? "Breathe in... Breathe out..." : currentQuote} />
        </div>
      </div>

      {/* Controls Area */}
      <footer className="w-full max-w-lg flex flex-col gap-3 md:gap-6 items-center pb-2 mt-2 z-50">
        
        {!isMeditating && (
          <div className="w-full">
            <MoodSystem currentMood={mood} setMood={setMood} />
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <MeditationSystem 
            onMeditationStart={() => setIsMeditating(true)}
            onMeditationEnd={() => setIsMeditating(false)}
            onMeditationComplete={() => {
              setIsMeditating(false);
              setComfortLevel(prev => prev + 20);
              setIsHappy(true);
              setTimeout(() => setIsHappy(false), 2000);
            }}
          />
          
          {!isMeditating && (
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
              <div className="flex-1">
                <FruitRain onTrigger={handleFruitRain} />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGift}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 text-cozy-coffee font-bold text-sm uppercase tracking-widest shadow-sm"
              >
                <Gift className="w-4 h-4 text-pink-400" />
                <span>Gift</span>
              </motion.button>
            </div>
          )}
        </div>

        {!isMeditating && (
          <div className="hidden md:block mt-4 text-center">
            <p className="text-cozy-coffee/40 text-xs italic">
              “This tiny resting place was made for tired humans.”
            </p>
          </div>
        )}
      </footer>
    </main>
  );
}
