import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, FaPause, FaStop, FaExpand, FaCompress, 
  FaVolumeMute, FaVolumeUp, FaArrowLeft, FaMusic, FaCoffee, FaMoon, FaTree
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import AnalyticsService from '../services/AnalyticsService';
import '../styles/AmbientBackgrounds.css';

const BACKGROUNDS = [
  { id: 'deep-space', name: 'Deep Space', class: 'bg-deep-space', icon: FaMoon },
  { id: 'lofi-cafe', name: 'Lo-Fi Cafe', class: 'bg-lofi-cafe', icon: FaCoffee },
  { id: 'rainy-forest', name: 'Rainy Forest', class: 'bg-rainy-forest', icon: FaTree },
  { id: 'sunset-glow', name: 'Sunset Glow', class: 'bg-sunset-glow', icon: FaVolumeUp }, // Reusing icon for sunset
];

const QUOTES = [
  "Focus is the art of knowing what to ignore.",
  "Deep work is the superpower of the 21st century.",
  "You cannot do big things if you are distracted by small things.",
  "Starve your distractions, feed your focus.",
  "Where attention goes, energy flows."
];

const ZenFocusRoom = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentBg, setCurrentBg] = useState(BACKGROUNDS[0]);
  const [isIdle, setIsIdle] = useState(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
  
  // Audio State
  const [isMuted, setIsMuted] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);

  // Refs
  const idleTimerRef = useRef(null);
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const audioRef = useRef(null); // In a real app, bind to actual ambient URLs

  // --- Fullscreen Logic ---
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // --- Idle Detection for Cinematic Mode ---
  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setIsIdle(true), 3000);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keypress', resetIdleTimer);
    resetIdleTimer();
    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keypress', resetIdleTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // --- Quote Rotation ---
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, 60000); // Change quote every minute
    return () => clearInterval(quoteInterval);
  }, []);

  // --- Timer Logic ---
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }
    
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    
    // Play notification sound
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
    if (!isMuted) audio.play();

    // Log Focus Time
    if (mode === 'focus' && currentUser) {
      try {
        await AnalyticsService.logFocusSession(currentUser.uid, 25);
        console.log('Focus session logged to Firebase');
      } catch (err) {
        console.error('Failed to log focus session', err);
      }
    }

    // Auto-switch modes
    if (mode === 'focus') {
      setMode('shortBreak');
      setTimeLeft(5 * 60);
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    if (mode === 'focus') setTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const exitZenMode = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    navigate('/');
  };

  return (
    <div 
      ref={containerRef}
      className={`zen-mode-container ${currentBg.class} ${isIdle ? 'zen-idle' : ''}`}
    >
      {/* Top Navigation / Escape Hatch */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 zen-controls-container">
        <button 
          onClick={exitZenMode}
          className="flex items-center text-white hover:text-gray-300 transition-colors zen-glass-dark px-4 py-2 rounded-full"
        >
          <FaArrowLeft className="mr-2" /> Exit Zen
        </button>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:text-gray-300 transition-colors zen-glass-dark p-3 rounded-full"
            title={isMuted ? "Unmute Ambient Sounds" : "Mute"}
          >
            {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
          </button>
          <button 
            onClick={toggleFullscreen}
            className="text-white hover:text-gray-300 transition-colors zen-glass-dark p-3 rounded-full"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="zen-glass-dark px-6 py-2 rounded-full mb-8 flex space-x-2">
          <button 
            onClick={() => { setMode('focus'); setTimeLeft(25 * 60); setIsActive(false); }}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${mode === 'focus' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
          >
            Focus
          </button>
          <button 
            onClick={() => { setMode('shortBreak'); setTimeLeft(5 * 60); setIsActive(false); }}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${mode === 'shortBreak' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
          >
            Short Break
          </button>
        </div>

        <h1 className="text-9xl md:text-[12rem] font-bold text-white zen-timer-text tracking-tighter mb-8 drop-shadow-2xl">
          {formatTime(timeLeft)}
        </h1>

        <div className="flex items-center space-x-6 z-50 zen-controls-container">
          <button 
            onClick={toggleTimer}
            className="bg-white text-black hover:bg-gray-200 transition-transform hover:scale-105 rounded-full p-6 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            {isActive ? <FaPause size={32} /> : <FaPlay size={32} className="ml-2" />}
          </button>
          <button 
            onClick={resetTimer}
            className="zen-glass-dark text-white hover:bg-white/20 transition-transform hover:scale-105 rounded-full p-5"
          >
            <FaStop size={24} />
          </button>
        </div>
      </motion.div>

      {/* Background Selector */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4 z-50 zen-controls-container">
        {BACKGROUNDS.map(bg => {
          const Icon = bg.icon;
          return (
            <button
              key={bg.id}
              onClick={() => setCurrentBg(bg)}
              className={`p-3 rounded-full transition-all ${currentBg.id === bg.id ? 'bg-white text-black scale-110 shadow-lg' : 'zen-glass-dark text-white hover:bg-white/20'}`}
              title={bg.name}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      {/* Floating Motivation */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1.5 }}
          className="absolute top-32 text-center w-full text-white/70 text-lg md:text-xl font-medium tracking-wide px-4"
        >
          "{currentQuote}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default ZenFocusRoom;
