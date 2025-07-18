import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaHeart, FaSync } from "react-icons/fa"

const DailyMotivationWidget = () => {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)

  const motivationalQuotes = [
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
      text: "It's not whether you get knocked down, it's whether you get up.",
      author: "Vince Lombardi",
    },
    {
      text: "If you are working on something that you really care about, you don't have to be pushed.",
      author: "Steve Jobs",
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
    },
  ]

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    return motivationalQuotes[randomIndex]
  }

  useEffect(() => {
    const savedQuote = localStorage.getItem("dailyMotivation")
    const savedDate = localStorage.getItem("dailyMotivationDate")
    const today = new Date().toDateString()

    if (savedQuote && savedDate === today) {
      setQuote(JSON.parse(savedQuote))
    } else {
      const newQuote = getRandomQuote()
      setQuote(newQuote)
      localStorage.setItem("dailyMotivation", JSON.stringify(newQuote))
      localStorage.setItem("dailyMotivationDate", today)
    }
    setLoading(false)
  }, [])

  const refreshQuote = () => {
    const newQuote = getRandomQuote()
    setQuote(newQuote)
    localStorage.setItem("dailyMotivation", JSON.stringify(newQuote))
    localStorage.setItem("dailyMotivationDate", new Date().toDateString())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-pink-200 dark:border-pink-800 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaHeart className="h-5 w-5 text-pink-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Motivation</h2>
        </div>
        <button
          onClick={refreshQuote}
          className="p-2 text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          aria-label="Refresh quote"
        >
          <FaSync size={14} />
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 italic mb-3 leading-relaxed">"{quote?.text}"</p>
          <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">— {quote?.author}</p>
        </div>
      )}
    </motion.div>
  )
}

export default DailyMotivationWidget
