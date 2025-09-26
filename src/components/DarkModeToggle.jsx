import { motion } from "framer-motion"
import { FaSun, FaMoon } from "react-icons/fa"
import { useTheme } from "../context/ThemeContext"

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-sm hover:shadow-md"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDarkMode ? 180 : 0,
          scale: isDarkMode ? 0.8 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {isDarkMode ? (
          <motion.div
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaSun size={18} className="text-yellow-400" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, rotate: 180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaMoon size={18} className="text-slate-600" />
          </motion.div>
        )}
      </motion.div>

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: isDarkMode ? "0 0 20px rgba(251, 191, 36, 0.3)" : "0 0 20px rgba(71, 85, 105, 0.2)",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}

export default DarkModeToggle
