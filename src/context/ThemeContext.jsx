import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      // Check localStorage first
      const saved = localStorage.getItem("darkMode")
      if (saved !== null) {
        return JSON.parse(saved)
      }
      // Fall back to system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  useEffect(() => {
    const root = window.document.documentElement

    if (isDarkMode) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Save to localStorage
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode))
  }, [isDarkMode])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      const saved = localStorage.getItem("darkMode")
      if (saved === null) {
        setIsDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  return <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
}
