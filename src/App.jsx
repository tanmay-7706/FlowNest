import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import About from "./pages/About"
import Services from "./pages/Services"
import Blog from "./pages/Blog"
import Auth from "./pages/Auth"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Analytics from "./pages/Analytics"
import CalendarView from "./pages/CalendarView"
import Tips from "./pages/Tips"

function App() {
  const [widgets, setWidgets] = useState({
    todo: true,
    pomodoro: true,
    habit: true,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedWidgets = localStorage.getItem("widgets")
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets))
    }

    // Prevent flash of unstyled content
    const timer = setTimeout(() => {
      setIsLoading(false)
      document.body.classList.remove("preload")
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Add preload class to prevent transitions on initial load
  useEffect(() => {
    document.body.classList.add("preload")
  }, [])

  const updateWidgets = (newWidgets) => {
    setWidgets(newWidgets)
    localStorage.setItem("widgets", JSON.stringify(newWidgets))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home widgets={widgets} />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route
                path="/services"
                element={
                  <ProtectedRoute>
                    <Services />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog"
                element={
                  <ProtectedRoute>
                    <Blog />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth isSignup={true} />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings widgets={widgets} updateWidgets={updateWidgets} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <CalendarView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tips"
                element={
                  <ProtectedRoute>
                    <Tips />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AnimatePresence>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
