import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FaLeaf, FaRobot, FaPlus, FaStar, FaSpinner, FaChartLine } from 'react-icons/fa'
import OpenRouterService from '../services/OpenRouterService'
import { useAuth } from '../context/AuthContext'
import { useHabits } from '../hooks/useFirestore'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../utils/firebase'

const AIHabitRecommendations = () => {
  const { currentUser } = useAuth()
  const { habits } = useHabits()
  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [userProfile, setUserProfile] = useState({
    goals: [],
    lifestyle: 'balanced',
    experience: 'beginner'
  })
  const [showRecommendations, setShowRecommendations] = useState(false)

  const generateRecommendations = async () => {
    setIsGenerating(true)
    try {
      const profile = {
        ...userProfile,
        currentHabits: habits.map(h => ({ name: h.name, streak: h.streak, frequency: h.frequency })),
        completionRate: habits.length > 0 ? habits.reduce((acc, h) => acc + (h.streak > 0 ? 1 : 0), 0) / habits.length : 0
      }

      const result = await OpenRouterService.recommendHabits(profile, habits)
      setRecommendations(result.recommendations || [])
      setShowRecommendations(true)
    } catch (error) {
      console.error('Habit recommendation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const addRecommendedHabit = async (habit) => {
    if (!currentUser) return

    try {
      await addDoc(collection(db, 'habits'), {
        name: habit.name || habit.title,
        description: habit.description || '',
        frequency: habit.frequency || 'daily',
        difficulty: habit.difficulty || 'easy',
        category: habit.category || 'general',
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        aiRecommended: true,
        streak: 0,
        completions: []
      })
    } catch (error) {
      console.error('Failed to add habit:', error)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <FaLeaf className="h-5 w-5 text-green-500 mr-2" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Habit Coach</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Personalized habit recommendations</p>
        </div>
        <FaRobot className="h-4 w-4 text-purple-500 ml-auto" />
      </div>

      <div className="space-y-4">
        {/* User Profile Setup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Primary Goal
            </label>
            <select
              value={userProfile.goals[0] || ''}
              onChange={(e) => setUserProfile(prev => ({ ...prev, goals: [e.target.value] }))}
              className="w-full text-sm input-field"
            >
              <option value="">Select goal</option>
              <option value="health">Health & Fitness</option>
              <option value="productivity">Productivity</option>
              <option value="learning">Learning & Growth</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="creativity">Creativity</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lifestyle
            </label>
            <select
              value={userProfile.lifestyle}
              onChange={(e) => setUserProfile(prev => ({ ...prev, lifestyle: e.target.value }))}
              className="w-full text-sm input-field"
            >
              <option value="busy">Busy Schedule</option>
              <option value="balanced">Balanced</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Experience
            </label>
            <select
              value={userProfile.experience}
              onChange={(e) => setUserProfile(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full text-sm input-field"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateRecommendations}
          disabled={isGenerating}
          className="w-full btn-primary disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Generating Recommendations...
            </>
          ) : (
            <>
              <FaRobot className="mr-2" />
              Get AI Recommendations
            </>
          )}
        </button>

        <AnimatePresence>
          {showRecommendations && recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                <FaStar className="mr-2 text-yellow-500" />
                Personalized Recommendations
              </h4>
              
              {recommendations.slice(0, 4).map((habit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {habit.name || habit.title}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {habit.description}
                      </p>
                    </div>
                    <button
                      onClick={() => addRecommendedHabit(habit)}
                      className="ml-2 btn-secondary text-sm px-3 py-1"
                    >
                      <FaPlus className="mr-1" />
                      Add
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(habit.difficulty)}`}>
                      {habit.difficulty || 'Easy'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {habit.frequency || 'Daily'}
                    </span>
                    {habit.category && (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {habit.category}
                      </span>
                    )}
                  </div>
                  
                  {habit.benefits && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <FaChartLine className="inline mr-1" />
                        Benefits: {habit.benefits}
                      </p>
                    </div>
                  )}
                  
                  {habit.implementation && (
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                      💡 {habit.implementation}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {habits.length === 0 && (
          <div className="text-center py-4">
            <FaLeaf className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start building habits to get personalized AI recommendations!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIHabitRecommendations