import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaSync } from "react-icons/fa"

const QuoteCarousel = () => {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const quotes = [
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
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle",
    },
    {
      text: "The only impossible journey is the one you never begin.",
      author: "Tony Robbins",
    },
    {
      text: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein",
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "Life is what happens to you while you're busy making other plans.",
      author: "John Lennon",
    },
    {
      text: "The future depends on what you do today.",
      author: "Mahatma Gandhi",
    },
  ]

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isAutoPlay, quotes.length])

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length)
  }

  const prevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length)
  }

  const goToQuote = (index) => {
    setCurrentQuote(index)
  }

  const refreshQuotes = () => {
    setIsRefreshing(true)
    // Simulate API call -->
    setTimeout(() => {
      setCurrentQuote(Math.floor(Math.random() * quotes.length))
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaQuoteLeft className="text-blue-500 text-2xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Inspiration</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Fuel your productivity with wisdom from great minds</p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={refreshQuotes}
          disabled={isRefreshing}
          className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
        >
          <FaSync className={`${isRefreshing ? "animate-spin" : ""}`} size={16} />
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
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
                >
                  <blockquote className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed mb-4 text-center">
                    "{quotes[currentQuote].text}"
                  </blockquote>
                  <div className="text-center">
                    <cite className="text-base font-semibold text-blue-600 dark:text-blue-400">
                      — {quotes[currentQuote].author}
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
