import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { useAuth } from "../context/AuthContext"
import AnalyticsService from "../services/AnalyticsService"
import { LoadingSpinner } from "../components/Loading"
import {
  FaCalendarAlt,
  FaBullseye,
  FaClock,
  FaCheckCircle,
  FaChartLine,
  FaTasks,
  FaExclamationTriangle,
  FaBrain,
  FaFire,
  FaTrophy,
  FaLightbulb,
} from "react-icons/fa"

const Analytics = () => {
  const { currentUser } = useAuth()
  const [weeklyData, setWeeklyData] = useState(null)
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await AnalyticsService.getWeeklySummary(currentUser.uid)
      setWeeklyData(data)
      
      if (data) {
        const generatedInsights = AnalyticsService.getInsights(data)
        setInsights(generatedInsights)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) return
    loadAnalytics()
  }, [currentUser, loadAnalytics])

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    if (score >= 40) return 'text-orange-500'
    return 'text-red-500'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20'
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/20'
    return 'bg-red-100 dark:bg-red-900/20'
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success': return <FaTrophy className="text-green-500" />
      case 'warning': return <FaExclamationTriangle className="text-yellow-500" />
      case 'info': return <FaLightbulb className="text-blue-500" />
      default: return <FaBrain className="text-purple-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <FaExclamationTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button onClick={loadAnalytics} className="btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!weeklyData) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <FaChartLine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Data Available</h2>
            <p className="text-gray-600 dark:text-gray-400">Start using FlowNest to see your productivity analytics!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <FaChartLine className="h-8 w-8 text-blue-500 mr-3" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Productivity Analytics</h1>
            </div>
            <button onClick={loadAnalytics} className="btn-secondary text-sm">
              Refresh Data
            </button>
          </div>

          {/* Productivity Score Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${getScoreBg(weeklyData.productivityScore)} rounded-2xl p-8 mb-8 text-center`}
          >
            <div className="flex items-center justify-center mb-4">
              <FaFire className={`h-12 w-12 ${getScoreColor(weeklyData.productivityScore)} mr-4`} />
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {weeklyData.productivityScore}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">Productivity Score</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Your weekly productivity score based on completed tasks, habits, and focus time.
            </p>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bento-card text-center"
            >
              <FaClock className="h-10 w-10 text-blue-500 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {Math.round(weeklyData.focusTime.totalMinutes / 60)}h
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Focus Time</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {weeklyData.focusTime.sessions} sessions
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bento-card text-center"
            >
              <FaBullseye className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {weeklyData.goals.rate}%
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Goal Completion</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                {weeklyData.goals.completed}/{weeklyData.goals.total} goals
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bento-card text-center"
            >
              <FaCheckCircle className="h-10 w-10 text-purple-500 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {weeklyData.focusTime.averageDaily}m
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Daily Average</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Focus time per day
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bento-card text-center"
            >
              <FaTasks className="h-10 w-10 text-orange-500 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {Object.keys(weeklyData.trends).length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Active Days</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                This week
              </p>
            </motion.div>
          </div>

          {/* AI Insights */}
          {insights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-8 border border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-center mb-4">
                <FaBrain className="h-6 w-6 text-purple-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Insights & Recommendations</h2>
              </div>
              <div className="grid gap-4">
                {insights.map((insight, index) => (
                  <div key={index} className="bento-card p-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {insight.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {insight.message}
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                          💡 {insight.action}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daily Focus Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bento-card"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Daily Focus Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={Object.entries(weeklyData.focusTime.dailyBreakdown).map(([date, minutes]) => ({
                  date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                  minutes
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                  <Line type="monotone" dataKey="minutes" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6' }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Productivity Score Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bento-card"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Score Breakdown</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Habit Consistency</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.min((weeklyData.productivityScore / 2), 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {Math.round(weeklyData.productivityScore / 2)}/50
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Task Completion</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.min((weeklyData.productivityScore / 2), 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {Math.round(weeklyData.productivityScore / 2)}/50
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics
