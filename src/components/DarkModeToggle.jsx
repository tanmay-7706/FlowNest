import { motion } from "framer-motion"
import { FaSun, FaMoon } from "react-icons/fa"
import { useTheme } from "../context/ThemeContext"

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="relative p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 transition-all duration-300 focus:outline-none shadow-sm hover:shadow-md hover:bg-white/80 dark:hover:bg-slate-700/80 group overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-transparent to-purple-500/0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300"></div>
      
      <motion.div
        initial={false}
        animate={{
          rotate: isDarkMode ? 180 : 0,
          scale: isDarkMode ? 0.8 : 1,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        className="relative z-10"
      >
        {isDarkMode ? (
          <motion.div
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            <FaSun size={18} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, rotate: 180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            <FaMoon size={18} className="text-slate-600 drop-shadow-[0_0_8px_rgba(71,85,105,0.3)]" />
          </motion.div>
        )}
      </motion.div>
    </motion.button>
  )
}

export default DarkModeToggle
