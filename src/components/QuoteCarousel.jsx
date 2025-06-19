import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import getGeminiQuote from "../api/geminiQuote"; // ✅ default import

const QuoteCarousel = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewQuote = async () => {
    setLoading(true);
    try {
      const { quote: newQuote, author: newAuthor } = await getGeminiQuote();
      setQuote(newQuote);
      setAuthor(newAuthor);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch quote. Please try again.");
      setQuote("Don't watch the clock, do what it does. Keep going.");
      setAuthor("Sam Levenson");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewQuote(); // fetch once on mount
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto my-12">
      <div className="bg-blue-50 rounded-2xl p-8 shadow-sm relative min-h-[200px]">
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
              <button onClick={fetchNewQuote} className="btn-primary">
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={quote + author}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">"{quote}"</h2>
              <p className="text-gray-600 font-medium">— {author}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={fetchNewQuote}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Refresh quote"
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
};

export default QuoteCarousel;