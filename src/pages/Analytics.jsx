import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "../utils/firebase"
import { useAuth } from "../context/AuthContext"
import {
  FaCalendarAlt,
  FaBullseye,
  FaClock,
  FaCheckCircle,
  FaChartLine,
  FaTasks,
  FaExclamationTriangle,
} from "react-icons/fa"

const Analytics = () => {
  const { currentUser } = useAuth()
  const [analyticsData, setAnalyticsData] = useState({
    tasks: [],
    habits: [],
    goals: [],
    reflections: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return

    const collections = ["todos", "habits", "goals", "reflections"]
    const unsubscribes = []

    collections.forEach((collectionName) => {
      const q = query(collection(db, collectionName), where("userId", "==", currentUser.uid))

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = []
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() })
        })

        setAnalyticsData((prev) => ({
          ...prev,
          [collectionName === "todos" ? "tasks" : collectionName]: data,
        }))
      })

      unsubscribes.push(unsubscribe)
    })

    setLoading(false)

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [currentUser])

  // Process data for charts
  const getTaskCompletionData = () => {
    const completed = analyticsData.tasks.filter((task) => task.completed).length
    const pending = analyticsData.tasks.filter((task) => !task.completed).length

    return [
      { name: "Completed", value: completed, color: "#4CAF50" },
      { name: "Pending", value: pending, color: "#FFC107" },
    ]
  }

  const getWeeklyHabitData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return days.map((day, index) => {
      const completedHabits = analyticsData.habits.reduce((acc, habit) => {
        return acc + (habit.days && habit.days[index] ? 1 : 0)
      }, 0)

      return {
        day,
        completed: completedHabits,
        total: analyticsData.habits.length,
      }
    })
  }

  const getPriorityDistribution = () => {
    const priorities = { high: 0, medium: 0, low: 0 }
    analyticsData.tasks.forEach((task) => {
      if (task.priority && priorities.hasOwnProperty(task.priority)) {
        priorities[task.priority]++
      }
    })

    return [
      { name: "High", value: priorities.high, color: "#F44336" },
      { name: "Medium", value: priorities.medium, color: "#FF9800" },
      { name: "Low", value: priorities.low, color: "#4CAF50" },
    ]
  }

  const getGoalProgress = () => {
    return analyticsData.goals.map((goal) => ({
      name: goal.title,
      progress: Math.min((goal.currentValue / goal.targetValue) * 100, 100),
      target: 100,
    }))
  }

  const hasTaskData = () => {
    return analyticsData.tasks.length > 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="rounded-full h-12 w-12 border-b-2 border-green-500"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex items-center mb-8">
            <FaChartLine className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Productivity Analytics</h1>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 text-center"
            >
              <FaCheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {analyticsData.tasks.filter((t) => t.completed).length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Completed Tasks</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 text-center"
            >
              <FaBullseye className="h-10 w-10 text-blue-500 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.goals.length}</h3>
              <p className="text-gray-600 dark:text-gray-400">Active Goals</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 text-center"
            >
              <FaCalendarAlt className="h-10 w-10 text-purple-500 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.habits.length}</h3>
              <p className="text-gray-600 dark:text-gray-400">Tracked Habits</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 text-center"
            >
              <FaClock className="h-10 w-10 text-orange-500 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{analyticsData.reflections.length}</h3>
              <p className="text-gray-600 dark:text-gray-400">Reflections</p>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Task Completion Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Task Completion</h2>
              {hasTaskData() ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={getTaskCompletionData()}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {getTaskCompletionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <FaTasks className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium mb-2">No tasks to display</p>
                    <p className="text-sm">Create some tasks to see completion trends.</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Weekly Habit Consistency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Weekly Habit Consistency</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={getWeeklyHabitData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                  <Bar dataKey="completed" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Priority Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Task Priority Distribution</h2>
              {hasTaskData() ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={getPriorityDistribution()}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {getPriorityDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <FaExclamationTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium mb-2">No tasks to display</p>
                    <p className="text-sm">Prioritize your tasks to view distribution.</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Goal Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Goal Progress</h2>
              {getGoalProgress().length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={getGoalProgress()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis domain={[0, 100]} stroke="#6B7280" />
                    <Tooltip
                      formatter={(value) => [`${value.toFixed(1)}%`, "Progress"]}
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F9FAFB",
                      }}
                    />
                    <Bar dataKey="progress" fill="#2196F3" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <FaBullseye className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium mb-2">No goals to display</p>
                    <p className="text-sm">Create some goals to see progress!</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics
