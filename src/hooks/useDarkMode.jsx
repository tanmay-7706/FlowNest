import { useState, useEffect } from "react"

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode")
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      return saved ? JSON.parse(saved) : prefersDark
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

    localStorage.setItem("darkMode", JSON.stringify(isDarkMode))
  }, [isDarkMode])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return [isDarkMode, toggleDarkMode]
}
