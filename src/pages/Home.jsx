"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import TodoWidget from "../components/TodoWidget"
import PomodoroWidget from "../components/PomodoroWidget"
import HabitTrackerWidget from "../components/HabitTrackerWidget"
import QuoteCarousel from "../components/QuoteCarousel"
import ReflectionWidget from "../components/ReflectionWidget"
import { Search } from "lucide-react"

const Home = ({ widgets }) => {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {/* Hero Section */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Build your day,
              <br />
              your way
            </motion.h1>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 mb-6"
            >
              Plan your day, your way. Learn more about productivity techniques that predict success.
            </motion.p>
            <motion.button
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="btn-primary"
            >
              Start Now
            </motion.button>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 p-6 rounded-xl shadow-md"
          >
            <img
              src="/placeholder.svg?height=300&width=400"
              alt="Productivity Dashboard"
              className="w-full h-auto rounded-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search tasks, habits, or reflections..."
          className="input-field pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Widgets Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Your Productivity Tools</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {widgets.todo && <TodoWidget />}
          {widgets.pomodoro && <PomodoroWidget />}
          {widgets.habit && <HabitTrackerWidget />}
          <ReflectionWidget />
        </div>
      </section>

      {/* Quote Carousel */}
      <QuoteCarousel />
    </motion.div>
  )
}

export default Home
