import { motion } from 'framer-motion';
import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaSync, FaMagic, FaRobot } from "react-icons/fa"
import OpenRouterService from "../services/OpenRouterService"
import { LoadingSpinner } from "./Loading"
import { useAuth } from "../context/AuthContext"

const QuoteCarousel = () => {
    const [currentQuote, setCurrentQuote] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [isAIEnabled, setIsAIEnabled] = useState(false)

  useEffect(() => {
    loadInitialQuotes()
  }, [])

  const loadInitialQuotes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if OpenRouter is available
      const openRouterAvailable = import.meta.env.VITE_OPENROUTER_API_KEY && 
                                  import.meta.env.VITE_OPENROUTER_API_KEY !== 'your_openrouter_api_key_here'
      
      setIsAIEnabled(openRouterAvailable)
      
      if (openRouterAvailable) {
        // Generate AI-powered personalized quote
        const userContext = {
          mood: 'motivated',
          goals: 'productivity and growth',
          recentActivity: 'working on personal development'
        }
        
        const aiQuote = await OpenRouterService.generateMotivationalQuote(userContext)
        
        // Fallback quotes
        const fallbackQuotes = [
          {
            text: "The future depends on what you do today.",
            author: "Mahatma Gandhi",
          },
          {
            text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            author: "Winston Churchill",
          },
          {
            text: "The only way to do great work is to love what you do.",
            author: "Steve Jobs",
          }
        ]
        
        setQuotes([aiQuote, ...fallbackQuotes])
      } else {
        // Use fallback quotes only
        const fallbackQuotes = [
          {
            text: "The way to get started is to quit talking and begin doing.",
            author: "Walt Disney",
          },
          {
            text: "Don't let yesterday take up too much of today.",
            author: "Will Rogers",
          },
          {
            text: "You learn more from failure than from success.",
            author: "Unknown",
          },
          {
            text: "The future depends on what you do today.",
            author: "Mahatma Gandhi",
          }
        ]
        setQuotes(fallbackQuotes)
      }
    } catch (err) {
      setError(err.message)
      // Load fallback quotes on error
      const fallbackQuotes = [
        {
          text: "Every moment is a fresh beginning.",
          author: "T.S. Eliot",
        },
        {
          text: "The only impossible journey is the one you never begin.",
          author: "Tony Robbins",
        }
      ]
      setQuotes(fallbackQuotes)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAutoPlay && !loading && quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length)
      }, 6000) // Slower for AI quotes
      return () => clearInterval(interval)
    }
  }, [isAutoPlay, quotes.length, loading])

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length)
  }

  const prevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length)
  }

  const goToQuote = (index) => {
    setCurrentQuote(index)
  }

  const refreshQuotes = async () => {
    if (isRefreshing) return
    
    try {
      setIsRefreshing(true)
      setError(null)
      
      if (isAIEnabled) {
        // Generate new AI quotes with different contexts
        const contexts = [
          { mood: 'focused', goals: 'achieving excellence', recentActivity: 'deep work' },
          { mood: 'energetic', goals: 'personal growth', recentActivity: 'learning new skills' },
          { mood: 'determined', goals: 'overcoming challenges', recentActivity: 'problem solving' }
        ]
        
        const newQuotes = await Promise.all(
          contexts.map(context => OpenRouterService.generateMotivationalQuote(context))
        )
        
        setQuotes(prev => [...newQuotes, ...prev.slice(3)])
      } else {
        // Just shuffle existing quotes
        setQuotes(prev => [...prev].sort(() => Math.random() - 0.5))
      }
      
      setCurrentQuote(0)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsRefreshing(false)
    }
  }

  const retryLoad = () => {
    loadInitialQuotes()
  }

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <FaQuoteLeft className="text-blue-500 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI-Powered Inspiration</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Generating personalized motivation...</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 min-h-[200px] flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 min-h-[200px] flex flex-col items-center justify-center">
            <p className="text-red-600 dark:text-red-400 mb-4">Failed to load quotes</p>
            <button
              onClick={retryLoad}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaQuoteLeft className="text-blue-500 text-2xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI-Powered Inspiration</h2>
            {isAIEnabled && (
              <FaRobot className="text-purple-500 text-lg ml-2" title="Powered by GPT-3.5 Turbo" />
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {isAIEnabled ? 'Personalized motivation powered by advanced AI' : 'Curated wisdom to fuel your productivity'}
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={refreshQuotes}
          disabled={isRefreshing}
          className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
          title={isAIEnabled ? 'Generate new AI quotes' : 'Refresh quotes'}
        >
          {isRefreshing ? (
            <LoadingSpinner size="sm" />
          ) : isAIEnabled ? (
            <FaRobot size={16} />
          ) : (
            <FaSync size={16} />
          )}
        </button>

        <div className="relative">
          <div
            className="flex items-center justify-center mb-6"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <button
              onClick={prevQuote}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 mr-4 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaChevronLeft size={16} />
            </button>

            <div className="flex-1 max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 min-h-[200px] flex flex-col justify-center relative"
                >
                  {quotes[currentQuote]?.author === 'AI Coach' && (
                    <div className="absolute top-3 right-3">
                      <FaRobot className="text-purple-500 text-sm" title="AI Generated" />
                    </div>
                  )}
                  <blockquote className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed mb-4 text-center">
                    "{quotes[currentQuote]?.text}"
                  </blockquote>
                  <div className="text-center">
                    <cite className="text-base font-semibold text-blue-600 dark:text-blue-400">
                      — {quotes[currentQuote]?.author}
                    </cite>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={nextQuote}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 ml-4 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaChevronRight size={16} />
            </button>
          </div>

          {/* Quote indicators */}
          <div className="flex justify-center space-x-2">
            {quotes.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuote(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentQuote % 5
                    ? "bg-blue-500 scale-125"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-blue-300 dark:hover:bg-blue-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuoteCarousel
