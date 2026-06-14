import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FaBullseye, FaRobot, FaPlus, FaCheck, FaClock, FaSpinner } from 'react-icons/fa'
import OpenRouterService from '../services/OpenRouterService'
import { useAuth } from '../context/AuthContext'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../utils/firebase'

const AIGoalBreakdown = () => {
  const { currentUser } = useAuth()
  const [goalInput, setGoalInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [breakdown, setBreakdown] = useState(null)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const analyzeGoal = async () => {
    if (!goalInput.trim()) return

    setIsAnalyzing(true)
    try {
      const result = await OpenRouterService.breakdownGoal(goalInput)
      setBreakdown(result)
      setShowBreakdown(true)
    } catch (error) {
      console.error('Goal analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const createTasksFromSteps = async () => {
    if (!breakdown?.steps || !currentUser) return

    try {
      const promises = breakdown.steps.map(step => 
        addDoc(collection(db, 'todos'), {
          text: step.title || step.description || step,
          completed: false,
          priority: 'medium',
          userId: currentUser.uid,
          createdAt: new Date().toISOString(),
          aiGenerated: true,
          goalRelated: goalInput
        })
      )
      
      await Promise.all(promises)
      setGoalInput('')
      setBreakdown(null)
      setShowBreakdown(false)
    } catch (error) {
      console.error('Failed to create tasks:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <FaBullseye className="h-5 w-5 text-teal-500 mr-2" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Goal Breakdown</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Break goals into actionable steps</p>
        </div>
        <FaRobot className="h-4 w-4 text-purple-500 ml-auto" />
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="Enter your goal (e.g., 'Learn React in 3 months')"
            className="flex-1 input-field text-sm"
            onKeyPress={(e) => e.key === 'Enter' && analyzeGoal()}
          />
          <button
            onClick={analyzeGoal}
            disabled={isAnalyzing || !goalInput.trim()}
            className="btn-primary px-4 py-2 disabled:opacity-50"
          >
            {isAnalyzing ? <FaSpinner className="animate-spin" /> : <FaRobot />}
          </button>
        </div>

        <AnimatePresence>
          {showBreakdown && breakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">AI Breakdown</h4>
                <button
                  onClick={createTasksFromSteps}
                  className="btn-secondary text-sm px-3 py-1"
                >
                  <FaPlus className="mr-1" />
                  Create Tasks
                </button>
              </div>

              {breakdown.timeline && (
                <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                    <FaClock className="mr-1" />
                    Timeline: {breakdown.timeline}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Action Steps:</h5>
                {breakdown.steps?.map((step, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="flex-shrink-0 w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {typeof step === 'string' ? step : step.title || step.description}
                      </p>
                      {step.duration && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Duration: {step.duration}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {breakdown.metrics && breakdown.metrics.length > 0 && (
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Success Metrics:</h5>
                  <div className="space-y-1">
                    {breakdown.metrics.map((metric, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FaCheck className="mr-2 text-green-500" />
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AIGoalBreakdown