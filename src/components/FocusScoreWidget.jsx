import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaBrain, FaFire } from "react-icons/fa"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "../utils/firebase"
import { useAuth } from "../context/AuthContext"

const FocusScoreWidget = () => {
  const { currentUser } = useAuth()
  const [focusScore, setFocusScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return

    const unsubscribes = []

    // Listen to todos
    const todosQuery = query(collection(db, "todos"), where("userId", "==", currentUser.uid))
    const unsubscribeTodos = onSnapshot(todosQuery, (snapshot) => {
      calculateFocusScore(snapshot, "todos")
    })

    // Listen to habits
    const habitsQuery = query(collection(db, "habits"), where("userId", "==", currentUser.uid))
    const unsubscribeHabits = onSnapshot(habitsQuery, (snapshot) => {
      calculateFocusScore(snapshot, "habits")
    })

    unsubscribes.push(unsubscribeTodos, unsubscribeHabits)
    setLoading(false)

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [currentUser])

  const calculateFocusScore = (snapshot, type) => {
    let score = 0
    let currentStreak = 0

    if (type === "todos") {
      const todos = []
      snapshot.forEach((doc) => todos.push(doc.data()))

      const completedTodos = todos.filter((todo) => todo.completed)
      const totalTodos = todos.length

      if (totalTodos > 0) {
        score += Math.round((completedTodos.length / totalTodos) * 50)
      }

      // Calculate streak based on recent completions
      const recentCompletions = completedTodos.filter((todo) => {
        const completedDate = new Date(todo.completedAt || todo.createdAt)
        const daysDiff = Math.floor((new Date() - completedDate) / (1000 * 60 * 60 * 24))
        return daysDiff <= 7
      })
      currentStreak = Math.min(recentCompletions.length, 7)
    }

    if (type === "habits") {
      const habits = []
      snapshot.forEach((doc) => habits.push(doc.data()))

      let totalHabitDays = 0
      let completedHabitDays = 0

      habits.forEach((habit) => {
        if (habit.days && Array.isArray(habit.days)) {
          totalHabitDays += habit.days.length
          completedHabitDays += habit.days.filter((day) => day).length
        }
      })

      if (totalHabitDays > 0) {
        score += Math.round((completedHabitDays / totalHabitDays) * 50)
      }
    }

    setFocusScore((prev) => Math.min(Math.max(score, 0), 100))
    setStreak(currentStreak)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-blue-500"
    if (score >= 40) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Work"
  }

  const getMotivationalMessage = (score) => {
    if (score >= 80) return "You're crushing it! 🚀"
    if (score >= 60) return "Great progress! Keep it up! 💪"
    if (score >= 40) return "You're getting there! 📈"
    return "Every step counts! 🌱"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800"
    >
      <div className="flex items-center mb-4">
        <FaBrain className="h-5 w-5 text-blue-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Focus Score</h2>
      </div>

      {loading ? (
        <div className="animate-pulse text-center">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
      ) : (
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200 dark:text-gray-700"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={getScoreColor(focusScore)}
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${focusScore}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${getScoreColor(focusScore)}`}>{focusScore}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className={`font-medium ${getScoreColor(focusScore)}`}>{getScoreLabel(focusScore)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{getMotivationalMessage(focusScore)}</p>

            {streak > 0 && (
              <div className="flex items-center justify-center space-x-1 mt-3 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <FaFire className="text-orange-500" size={14} />
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">{streak} day streak!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default FocusScoreWidget
