import { motion } from 'framer-motion';
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FaClock, FaRobot, FaCalendarAlt, FaSpinner, FaDownload } from 'react-icons/fa'
import { GrOptimize } from "react-icons/gr";
import OpenRouterService from '../services/OpenRouterService'

const AIScheduleOptimizer = () => {
  const [schedule, setSchedule] = useState('')
  const [preferences, setPreferences] = useState({
    energyPeak: 'morning',
    workStyle: 'focused',
    breakFrequency: 'regular'
  })
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimization, setOptimization] = useState(null)
  const [showOptimization, setShowOptimization] = useState(false)

  const optimizeSchedule = async () => {
    if (!schedule.trim()) return

    setIsOptimizing(true)
    try {
      const result = await OpenRouterService.optimizeSchedule(
        schedule.split('\n').filter(line => line.trim()),
        preferences
      )
      setOptimization(result)
      setShowOptimization(true)
    } catch (error) {
      console.error('Schedule optimization failed:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const exportOptimizedSchedule = () => {
    const exportData = {
      originalSchedule: schedule,
      optimizedSchedule: optimization.optimized,
      tips: optimization.tips,
      preferences,
      generatedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `optimized-schedule-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-orange-200 dark:border-orange-800">
      <div className="flex items-center mb-4">
        <FaClock className="h-5 w-5 text-orange-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Schedule Optimizer</h3>
        <FaRobot className="h-4 w-4 text-purple-500 ml-2" />
      </div>

      <div className="space-y-4">
        {/* Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Energy Peak
            </label>
            <select
              value={preferences.energyPeak}
              onChange={(e) => setPreferences(prev => ({ ...prev, energyPeak: e.target.value }))}
              className="w-full text-sm input-field"
            >
              <option value="morning">Morning Person</option>
              <option value="afternoon">Afternoon Peak</option>
              <option value="evening">Night Owl</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Work Style
            </label>
            <select
              value={preferences.workStyle}
              onChange={(e) => setPreferences(prev => ({ ...prev, workStyle: e.target.value }))}
              className="w-full text-sm input-field"
            >
              <option value="focused">Deep Focus</option>
              <option value="collaborative">Collaborative</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Break Frequency
            </label>
            <select
              value={preferences.breakFrequency}
              onChange={(e) => setPreferences(prev => ({ ...prev, breakFrequency: e.target.value }))}
              className="w-full text-sm input-field"
            >
              <option value="frequent">Frequent Breaks</option>
              <option value="regular">Regular Breaks</option>
              <option value="minimal">Minimal Breaks</option>
            </select>
          </div>
        </div>

        {/* Schedule Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Schedule (one item per line)
          </label>
          <textarea
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            placeholder="9:00 AM - Team meeting&#10;10:30 AM - Code review&#10;12:00 PM - Lunch break&#10;1:00 PM - Deep work session&#10;3:00 PM - Client call"
            className="w-full h-32 input-field text-sm resize-none"
          />
        </div>

        <button
          onClick={optimizeSchedule}
          disabled={isOptimizing || !schedule.trim()}
          className="w-full btn-primary disabled:opacity-50"
        >
          {isOptimizing ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Optimizing Schedule...
            </>
          ) : (
            <>
              <GrOptimize className="mr-2" />
              Optimize with AI
            </>
          )}
        </button>

        <AnimatePresence>
          {showOptimization && optimization && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Optimized Schedule</h4>
                <button
                  onClick={exportOptimizedSchedule}
                  className="btn-secondary text-sm px-3 py-1"
                >
                  <FaDownload className="mr-1" />
                  Export
                </button>
              </div>

              {/* Optimized Schedule */}
              {optimization.optimized && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    Recommended Schedule
                  </h5>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                    <div className="space-y-1">
                      {Array.isArray(optimization.optimized) ? 
                        optimization.optimized.map((item, index) => (
                          <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                            {item}
                          </div>
                        )) :
                        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {optimization.optimized}
                        </div>
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Optimization Tips */}
              {optimization.tips && optimization.tips.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AI Recommendations
                  </h5>
                  <div className="space-y-2">
                    {optimization.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {tip}
                        </p>
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

export default AIScheduleOptimizer