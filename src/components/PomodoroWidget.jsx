import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { FaPlay, FaPause, FaRedo } from "react-icons/fa"

const PomodoroWidget = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState("pomodoro") // pomodoro, shortBreak, longBreak
  const intervalRef = useRef(null)
  const [selectedSound, setSelectedSound] = useState("none")
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current)
            setIsActive(false)
            handleTimerCompletion()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isActive])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleTimerCompletion = () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Pomodoro Timer", {
          body: "Time's up!",
          icon: "/favicon.ico",
        })
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("Pomodoro Timer", {
              body: "Time's up!",
              icon: "/favicon.ico",
            })
          }
        })
      }
    }
    if (selectedSound !== "none" && audioRef.current) {
      audioRef.current.play()
    }
  }

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    clearInterval(intervalRef.current)
    setIsActive(false)

    switch (mode) {
      case "pomodoro":
        setTimeLeft(25 * 60)
        break
      case "shortBreak":
        setTimeLeft(5 * 60)
        break
      case "longBreak":
        setTimeLeft(15 * 60)
        break
      default:
        setTimeLeft(25 * 60)
    }
  }

  const changeMode = (newMode) => {
    setMode(newMode)
    setIsActive(false)

    switch (newMode) {
      case "pomodoro":
        setTimeLeft(25 * 60)
        break
      case "shortBreak":
        setTimeLeft(5 * 60)
        break
      case "longBreak":
        setTimeLeft(15 * 60)
        break
      default:
        setTimeLeft(25 * 60)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSoundChange = (e) => {
    setSelectedSound(e.target.value)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card h-fit">
      <h2 className="widget-title">Pomodoro Timer</h2>

      <div className="flex justify-center mb-6">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => changeMode("pomodoro")}
            className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              mode === "pomodoro"
                ? "bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => changeMode("shortBreak")}
            className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              mode === "shortBreak"
                ? "bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Short Break
          </button>
          <button
            onClick={() => changeMode("longBreak")}
            className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              mode === "longBreak"
                ? "bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Long Break
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="text-4xl sm:text-5xl font-bold bg-blue-50 dark:bg-blue-900/20 px-6 py-4 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <label htmlFor="sound" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ambient Sound:
          </label>
          <select id="sound" value={selectedSound} onChange={handleSoundChange} className="input-field text-sm w-32">
            <option value="none">None</option>
            <option value="rain">Rain</option>
            <option value="cafe">Cafe</option>
            <option value="whiteNoise">White Noise</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="volume" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Volume:
          </label>
          <input
            type="range"
            id="volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        loop
        src={
          selectedSound === "rain"
            ? "/sounds/rain.mp3"
            : selectedSound === "cafe"
              ? "/sounds/cafe.mp3"
              : selectedSound === "whiteNoise"
                ? "/sounds/whiteNoise.mp3"
                : null
        }
      />

      <div className="flex justify-center space-x-3">
        <button onClick={toggleTimer} className="btn-primary flex items-center justify-center px-6">
          {isActive ? <FaPause size={16} /> : <FaPlay size={16} />}
          <span className="ml-2">{isActive ? "Pause" : "Start"}</span>
        </button>
        <button
          onClick={resetTimer}
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center"
        >
          <FaRedo size={16} />
          <span className="ml-2">Reset</span>
        </button>
      </div>
    </motion.div>
  )
}

export default PomodoroWidget
