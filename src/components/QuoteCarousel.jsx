"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"

const QuoteCarousel = () => {
  const [quotes, setQuotes] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://zenquotes.io/api/random")
      const data = await response.json()
      setQuotes(data)
      setCurrentIndex(0)
      setError(null)
    } catch (err) {
      setError("Failed to fetch quote. Please try again.")
      // Fallback quotes
      setQuotes([
        { q: "Don't watch the clock, do what it does. Keep going.", a: "Sam Levenson" },
        { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
        { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotes()
  }, [])

  const nextQuote = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length)
  }

  const prevQuote = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length)
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      <div className="bg-blue-50 rounded-2xl p-8 shadow-sm relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-12"
            >
              <RefreshCw className="animate-spin text-blue-500" size={32} />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={fetchQuotes} className="btn-primary">
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8"
            >
              <h2 className="text-2xl font-medium mb-6">"{quotes[currentIndex]?.q}"</h2>
              <p className="text-gray-600 font-medium">{quotes[currentIndex]?.a}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {quotes.length > 1 && (
          <>
            <button
              onClick={prevQuote}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-gray-900"
              aria-label="Previous quote"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextQuote}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-gray-900"
              aria-label="Next quote"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-blue-500" : "bg-blue-200"}`}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={fetchQuotes}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Refresh quote"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </div>
  )
}

export default QuoteCarousel
