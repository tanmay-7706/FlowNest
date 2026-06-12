import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRobot, FaMagic, FaLightbulb, FaTasks, FaSpinner, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import OpenRouterService from '../services/OpenRouterService'
import { useTodos } from '../hooks/useFirestore'
import { useAuth } from '../context/AuthContext'

const AITaskAssistant = () => {
  const { currentUser } = useAuth()
  const { todos, addTodo, updateTodo } = useTodos()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [aiInsights, setAiInsights] = useState(null)

  const analyzeTasks = async () => {
    if (!todos.length) return

    setIsAnalyzing(true)
    try {
      // Get AI prioritization
      const prioritization = await OpenRouterService.prioritizeTasks(
        todos.map(t => ({ id: t.id, text: t.text, priority: t.priority, completed: t.completed })),
        { workStyle: 'focused', timeOfDay: new Date().getHours() }
      )

      // Generate productivity insights
      const insights = await OpenRouterService.generateProductivityInsights({
        totalTasks: todos.length,
        completedTasks: todos.filter(t => t.completed).length,
        pendingTasks: todos.filter(t => !t.completed).length,
        priorities: todos.reduce((acc, t) => {
          acc[t.priority] = (acc[t.priority] || 0) + 1
          return acc
        }, {})
      })

      setSuggestions(prioritization.prioritized || [])
      setAiInsights(insights.insights || [])
    } catch (error) {
      console.error('AI analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const applySuggestion = async (suggestion) => {
    try {
      const task = todos.find(t => t.id === suggestion.id)
      if (task) {
        await updateTodo(task.id, { 
          priority: suggestion.priority >= 8 ? 'high' : suggestion.priority >= 5 ? 'medium' : 'low',
          aiSuggested: true
        })
      }
    } catch (error) {
      console.error('Failed to apply suggestion:', error)
    }
  }

  return (
    <div>
      <div 
        className="cursor-pointer flex items-center justify-between mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <FaRobot className="h-5 w-5 text-purple-500 mr-2" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Task Assistant</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Smart prioritization & insights</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                analyzeTasks()
              }}
              disabled={isAnalyzing || !todos.length}
              className="btn-primary text-sm px-3 py-1 disabled:opacity-50"
            >
              {isAnalyzing ? <FaSpinner className="animate-spin" /> : <FaMagic />}
            </button>
          )}
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="border-t border-gray-200 dark:border-gray-700 mt-4">
            <div className="pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900 dark:text-white">AI Analysis</h4>
                <button
                  onClick={analyzeTasks}
                  disabled={isAnalyzing || !todos.length}
                  className="btn-secondary text-sm px-3 py-1 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <FaSpinner className="animate-spin mr-1" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FaMagic className="mr-1" />
                      Analyze Tasks
                    </>
                  )}
                </button>
              </div>

              {/* AI Suggestions */}
              {suggestions.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <FaTasks className="mr-1" />
                    Priority Suggestions
                  </h5>
                  {suggestions.slice(0, 3).map((suggestion) => {
                    const task = todos.find(t => t.id === suggestion.id)
                    return (
                      <div key={suggestion.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {task?.text}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {suggestion.reason}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              suggestion.priority >= 8 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                              suggestion.priority >= 5 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                              Priority: {suggestion.priority}/10
                            </span>
                            <button
                              onClick={() => applySuggestion(suggestion)}
                              className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* AI Insights */}
              {aiInsights && aiInsights.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <FaLightbulb className="mr-1" />
                    AI Insights
                  </h5>
                  {aiInsights.slice(0, 2).map((insight, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                      <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {insight.title}
                      </h6>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {insight.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {!todos.length && (
                <div className="text-center py-4">
                  <FaTasks className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add some tasks to get AI-powered insights!
                  </p>
                </div>
              )}
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AITaskAssistant