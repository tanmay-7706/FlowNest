import { useState, useEffect, useCallback } from 'react'

import { FaRobot, FaBrain, FaChartLine, FaLightbulb, FaClock, FaSync } from 'react-icons/fa'
import { LuTarget } from "react-icons/lu";
import OpenRouterService from '../services/OpenRouterService'
import AnalyticsService from '../services/AnalyticsService'
import { useAuth } from '../context/AuthContext'
import { useTodos, useHabits } from '../hooks/useFirestore'
import { LoadingSpinner } from '../components/Loading'
import AIScheduleOptimizer from '../components/AIScheduleOptimizer'

const AIInsights = () => {
  const { currentUser } = useAuth()
  const { todos } = useTodos()
  const { habits } = useHabits()
  const [insights, setInsights] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [productivityScore, setProductivityScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadAIInsights = useCallback(async () => {
    if (!currentUser) return

    setIsLoading(true)
    try {
      // Get productivity score
      const score = await AnalyticsService.getProductivityScore(currentUser.uid, 7)
      setProductivityScore(score)

      // Generate AI insights based on user data
      const analyticsData = {
        totalTasks: todos.length,
        completedTasks: todos.filter(t => t.completed).length,
        pendingTasks: todos.filter(t => !t.completed).length,
        totalHabits: habits.length,
        activeHabits: habits.filter(h => h.streak > 0).length,
        productivityScore: score,
        priorities: todos.reduce((acc, t) => {
          acc[t.priority] = (acc[t.priority] || 0) + 1
          return acc
        }, {}),
        habitCategories: habits.reduce((acc, h) => {
          acc[h.category || 'general'] = (acc[h.category || 'general'] || 0) + 1
          return acc
        }, {})
      }

      const aiInsights = await OpenRouterService.generateProductivityInsights(analyticsData)
      setInsights(aiInsights.insights || [])

      // Generate personalized recommendations
      const userProfile = {
        productivityScore: score,
        taskCompletionRate: todos.length > 0 ? (todos.filter(t => t.completed).length / todos.length) * 100 : 0,
        habitConsistency: habits.length > 0 ? (habits.filter(h => h.streak > 0).length / habits.length) * 100 : 0,
        preferences: {
          workStyle: 'focused',
          goals: ['productivity', 'growth']
        }
      }

      const habitRecs = await OpenRouterService.recommendHabits(userProfile, habits)
      setRecommendations(habitRecs.recommendations || [])

    } catch (error) {
      console.error('Failed to load AI insights:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentUser, todos, habits])

  useEffect(() => {
    if (currentUser) {
      loadAIInsights()
    }
  }, [currentUser, loadAIInsights])

  const refreshInsights = async () => {
    setIsRefreshing(true)
    await loadAIInsights()
    setIsRefreshing(false)
  }

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
      case 'success': return <LuTarget className="text-green-500" />
      case 'warning': return <FaLightbulb className="text-yellow-500" />
      case 'info': return <FaChartLine className="text-blue-500" />
      default: return <FaBrain className="text-purple-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <FaRobot className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">AI Insights Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Powered by advanced AI analysis</p>
              </div>
            </div>
            <button
              onClick={refreshInsights}
              disabled={isRefreshing}
              className="btn-secondary disabled:opacity-50"
            >
              {isRefreshing ? <FaSpinner className="animate-spin mr-2" /> : <FaSync className="mr-2" />}
              Refresh
            </button>
          </div>

          {/* Productivity Score Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${getScoreBg(productivityScore)} rounded-2xl p-8 mb-8 text-center`}
          >
            <div className="flex items-center justify-center mb-4">
              <FaBrain className={`h-12 w-12 ${getScoreColor(productivityScore)} mr-4`} />
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {productivityScore}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">AI Productivity Score</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Your AI-calculated productivity score based on task completion, habit consistency, and behavioral patterns.
            </p>
          </motion.div>

          {/* AI Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Insights Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaLightbulb className="mr-2 text-yellow-500" />
                AI Insights
              </h3>
              
              {insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {insight.message}
                          </p>
                          {insight.action && (
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                              💡 {insight.action}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaBrain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Keep using FlowNest to generate AI insights!
                  </p>
                </div>
              )}
            </motion.div>

            {/* Recommendations Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <LuTarget className="mr-2 text-green-500" />
                AI Recommendations
              </h3>
              
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {rec.name || rec.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {rec.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        {rec.difficulty && (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {rec.difficulty}
                          </span>
                        )}
                        {rec.category && (
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            {rec.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <LuTarget className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    AI recommendations will appear as you use the app more!
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* AI Schedule Optimizer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AIScheduleOptimizer />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default AIInsights