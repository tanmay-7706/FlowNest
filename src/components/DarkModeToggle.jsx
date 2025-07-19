import { motion } from "framer-motion"
import { FaSun, FaMoon } from "react-icons/fa"
import { useDarkMode } from "../hooks/useDarkMode"

const DarkModeToggle = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode()

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle dark mode"
    >
      <motion.div initial={false} animate={{ rotate: isDarkMode ? 180 : 0 }} transition={{ duration: 0.3 }}>
        {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
      </motion.div>
    </motion.button>
  )
}

export default DarkModeToggle
