import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "../utils/firebase"
import { useAuth } from "../context/AuthContext"
import { Calendar, Target, Clock, CheckCircle } from "lucide-react"

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      <h1 className="text-3xl font-bold mb-8">Productivity Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">{analyticsData.tasks.filter((t) => t.completed).length}</h3>
          <p className="text-gray-600">Completed Tasks</p>
        </div>
        <div className="card text-center">
          <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">{analyticsData.goals.length}</h3>
          <p className="text-gray-600">Active Goals</p>
        </div>
        <div className="card text-center">
          <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">{analyticsData.habits.length}</h3>
          <p className="text-gray-600">Tracked Habits</p>
        </div>
        <div className="card text-center">
          <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">{analyticsData.reflections.length}</h3>
          <p className="text-gray-600">Reflections</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Completion Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Task Completion</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getTaskCompletionData()}
                cx="50%"
                cy="50%"
                outerRadius={80}
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
        </div>

        {/* Weekly Habit Consistency */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Weekly Habit Consistency</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getWeeklyHabitData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Task Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getPriorityDistribution()}
                cx="50%"
                cy="50%"
                outerRadius={80}
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
        </div>

        {/* Goal Progress */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Goal Progress</h2>
          {getGoalProgress().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getGoalProgress()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, "Progress"]} />
                <Bar dataKey="progress" fill="#2196F3" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No goals to display. Create some goals to see progress!</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Analytics
