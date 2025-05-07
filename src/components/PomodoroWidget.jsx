import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

const PomodoroWidget = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState("pomodoro") // pomodoro, shortBreak, longBreak
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current)
            setIsActive(false)
            // Play sound or notification here
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <h2 className="text-xl font-semibold mb-4">Pomodoro Timer</h2>

      <div className="flex justify-center mb-6">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => changeMode("pomodoro")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "pomodoro" ? "bg-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => changeMode("shortBreak")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "shortBreak" ? "bg-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Short Break
          </button>
          <button
            onClick={() => changeMode("longBreak")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "longBreak" ? "bg-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Long Break
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="text-6xl font-bold bg-blue-50 px-8 py-6 rounded-xl">{formatTime(timeLeft)}</div>
      </div>

      <div className="flex justify-center space-x-4">
        <button onClick={toggleTimer} className="btn-primary flex items-center justify-center">
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          <span className="ml-2">{isActive ? "Pause" : "Start"}</span>
        </button>
        <button
          onClick={resetTimer}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center"
        >
          <RotateCcw size={20} />
          <span className="ml-2">Reset</span>
        </button>
      </div>
    </motion.div>
  )
}

export default PomodoroWidget
