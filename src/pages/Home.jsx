import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import TodoWidget from "../components/TodoWidget"
import PomodoroWidget from "../components/PomodoroWidget"
import HabitTrackerWidget from "../components/HabitTrackerWidget"
import QuoteCarousel from "../components/QuoteCarousel"
import ReflectionWidget from "../components/ReflectionWidget"
import GoalTracker from "../components/GoalTracker"
import DailyMotivationWidget from "../components/DailyMotivationWidget"
import RecentActivityWidget from "../components/RecentActivityWidget"
import TimeBlockingWidget from "../components/TimeBlockingWidget"
import FocusScoreWidget from "../components/FocusScoreWidget"
import WeeklyDataSyncWidget from "../components/WeeklyDataSyncWidget"
import {
  FaSearch,
  FaArrowRight,
  FaBook,
  FaClock,
  FaCheckSquare,
  FaLightbulb,
  FaCalendarCheck,
  FaStickyNote,
  FaBullseye,
} from "react-icons/fa"

const Home = ({ widgets }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const scrollToProductivityTools = () => {
    const element = document.getElementById("productivity-tools")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleLearnMore = () => {
    navigate("/about")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Hero Section */}
          <section className="mb-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="text-center lg:text-left">
                <motion.h1
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
                >
                  Build your day,
                  <br />
                  <span className="text-green-600 dark:text-green-400">your way</span>
                </motion.h1>
                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0"
                >
                  Plan your day, your way. Learn more about productivity techniques that predict success.
                </motion.p>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <button
                    onClick={scrollToProductivityTools}
                    className="btn-primary text-lg px-8 py-4 flex items-center justify-center hover:scale-105 transition-transform duration-200"
                  >
                    Start Now
                    <FaArrowRight className="ml-2" size={16} />
                  </button>
                  <button
                    onClick={handleLearnMore}
                    className="btn-secondary text-lg px-8 py-4 flex items-center justify-center hover:scale-105 transition-transform duration-200"
                  >
                    <FaBook className="mr-2" size={16} />
                    Learn More
                  </button>
                </motion.div>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-800"
              >
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Productivity Dashboard"
                  className="w-full h-auto rounded-xl"
                />
              </motion.div>
            </div>
          </section>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search tasks, habits, or reflections..."
                className="w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 text-center sm:text-left"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Productivity Tools Section - 3x4 Grid with Consistent Styling */}
          <section id="productivity-tools" className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Your Productivity Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Row 1 */}
              {/* Goal Tracker - Teal Theme */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-teal-200 dark:border-teal-800 h-full">
                  <GoalTracker />
                </div>
              </motion.div>

              {/* Pomodoro Timer - Red Theme */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-red-200 dark:border-red-800 h-full">
                  <div className="flex items-center mb-4">
                    <FaClock className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pomodoro Timer</h3>
                  </div>
                  <PomodoroWidget />
                </div>
              </motion.div>

              {/* Weekly Data Sync - Emerald Theme */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-emerald-200 dark:border-emerald-800 h-full">
                  <WeeklyDataSyncWidget />
                </div>
              </motion.div>

              {/* Row 2 */}
              {/* To-Do List - Green Theme */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <div className="bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-900/20 dark:to-lime-900/20 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-green-200 dark:border-green-800 h-full">
                  <div className="flex items-center mb-4">
                    <FaCheckSquare className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">To-Do List</h3>
                  </div>
                  <TodoWidget />
                </div>
              </motion.div>

              {/* Daily Reflection - Purple Theme */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-purple-200 dark:border-purple-800 h-full">
                  <div className="flex items-center mb-4">
                    <FaLightbulb className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Reflection</h3>
                  </div>
                  <ReflectionWidget />
                </div>
              </motion.div>

              {/* Habit Tracker - Blue Theme */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-blue-200 dark:border-blue-800 h-full">
                  <div className="flex items-center mb-4">
                    <FaCalendarCheck className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Habit Tracker</h3>
                  </div>
                  <HabitTrackerWidget />
                </div>
              </motion.div>

              {/* Row 3 */}
              {/* Time Blocking - Now with Slate Theme (self-contained) */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <TimeBlockingWidget />
              </motion.div>

              {/* Daily Motivation - Now with Pink Theme (self-contained) */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <DailyMotivationWidget />
              </motion.div>

              {/* Recent Activity - Amber Theme */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-amber-200 dark:border-amber-800 h-full">
                  <RecentActivityWidget />
                </div>
              </motion.div>

              {/* Row 4 */}
              {/* Focus Score - Indigo Theme */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-indigo-200 dark:border-indigo-800 h-full">
                  <FocusScoreWidget />
                </div>
              </motion.div>

              {/* Quick Notes - Rose Theme */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-rose-200 dark:border-rose-800 h-full">
                  <div className="flex items-center mb-4">
                    <FaStickyNote className="h-5 w-5 text-rose-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Notes</h3>
                  </div>
                  <textarea
                    placeholder="Jot down quick thoughts..."
                    className="w-full h-32 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </motion.div>

              {/* Today's Focus - Orange Theme */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-orange-200 dark:border-orange-800 h-full">
                  <div className="flex items-center mb-4">
                    <FaBullseye className="h-5 w-5 text-orange-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Focus</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-orange-200 dark:border-orange-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300">Complete project proposal</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-orange-200 dark:border-orange-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300">Review team feedback</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-orange-200 dark:border-orange-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300">Plan tomorrow's tasks</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Quote Carousel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
            <QuoteCarousel />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
