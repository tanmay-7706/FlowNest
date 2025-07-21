import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaSync, FaDownload, FaCheckCircle, FaClock } from "react-icons/fa"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "../utils/firebase"
import { useAuth } from "../context/AuthContext"

const WeeklyDataSyncWidget = () => {
  const { currentUser } = useAuth()
  const [weeklyData, setWeeklyData] = useState({
    tasksCompleted: 0,
    tasksPending: 0,
    habitsCompleted: 0,
    habitsTotal: 0,
    goalsProgress: 0,
  })
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState(null)

  useEffect(() => {
    if (!currentUser) return

    const unsubscribes = []

    // Get start of current week -->
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    startOfWeek.setHours(0, 0, 0, 0)

    // Todos -->
    const todosQuery = query(collection(db, "todos"), where("userId", "==", currentUser.uid))
    const unsubscribeTodos = onSnapshot(todosQuery, (snapshot) => {
      let completed = 0
      let pending = 0

      snapshot.forEach((doc) => {
        const data = doc.data()
        const createdAt = new Date(data.createdAt)

        if (createdAt >= startOfWeek) {
          if (data.completed) {
            completed++
          } else {
            pending++
          }
        }
      })

      setWeeklyData((prev) => ({ ...prev, tasksCompleted: completed, tasksPending: pending }))
    })

    // Habits -->
    const habitsQuery = query(collection(db, "habits"), where("userId", "==", currentUser.uid))
    const unsubscribeHabits = onSnapshot(habitsQuery, (snapshot) => {
      let totalHabits = 0
      let completedHabits = 0

      snapshot.forEach((doc) => {
        const data = doc.data()
        if (data.days && Array.isArray(data.days)) {
          totalHabits += data.days.length
          completedHabits += data.days.filter((day) => day).length
        }
      })

      setWeeklyData((prev) => ({
        ...prev,
        habitsCompleted: completedHabits,
        habitsTotal: totalHabits,
      }))
    })

    // Goals -->
    const goalsQuery = query(collection(db, "goals"), where("userId", "==", currentUser.uid))
    const unsubscribeGoals = onSnapshot(goalsQuery, (snapshot) => {
      let totalProgress = 0
      let goalCount = 0

      snapshot.forEach((doc) => {
        const data = doc.data()
        if (data.targetValue && data.currentValue !== undefined) {
          totalProgress += Math.min((data.currentValue / data.targetValue) * 100, 100)
          goalCount++
        }
      })

      const avgProgress = goalCount > 0 ? Math.round(totalProgress / goalCount) : 0
      setWeeklyData((prev) => ({ ...prev, goalsProgress: avgProgress }))
    })

    unsubscribes.push(unsubscribeTodos, unsubscribeHabits, unsubscribeGoals)
    setLoading(false)
    setLastSync(new Date())

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [currentUser])

  const exportWeeklyData = () => {
    const exportData = {
      weekOf: new Date().toISOString().split("T")[0],
      summary: weeklyData,
      exportedAt: new Date().toISOString(),
      userId: currentUser?.uid,
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `weekly-summary-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  const getCompletionRate = () => {
    const totalTasks = weeklyData.tasksCompleted + weeklyData.tasksPending
    if (totalTasks === 0) return 0
    return Math.round((weeklyData.tasksCompleted / totalTasks) * 100)
  }

  const getHabitRate = () => {
    if (weeklyData.habitsTotal === 0) return 0
    return Math.round((weeklyData.habitsCompleted / weeklyData.habitsTotal) * 100)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaSync className="h-5 w-5 text-green-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Summary</h2>
        </div>
        <button
          onClick={exportWeeklyData}
          className="p-2 text-green-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          title="Export weekly data"
        >
          <FaDownload size={14} />
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Tasks Summary */}
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" size={16} />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Tasks</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {weeklyData.tasksCompleted} completed, {weeklyData.tasksPending} pending
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{getCompletionRate()}%</p>
            </div>
          </div>

          {/* Habits Summary */}
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center">
              <FaClock className="text-blue-500 mr-2" size={16} />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Habits</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {weeklyData.habitsCompleted} / {weeklyData.habitsTotal} completed
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{getHabitRate()}%</p>
            </div>
          </div>

          {/* Goals Progress */}
          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Goals</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Average progress</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{weeklyData.goalsProgress}%</p>
            </div>
          </div>

          {lastSync && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
              Last synced: {lastSync.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default WeeklyDataSyncWidget
