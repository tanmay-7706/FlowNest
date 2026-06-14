import { useState, useEffect, lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"
import ErrorBoundary from "./components/ErrorBoundary"
import { LoadingScreen } from "./components/Loading"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import { OfflineIndicator } from "./components/OfflineIndicator"
import ReloadPrompt from "./components/ReloadPrompt"

// Lazy-loaded page components for code splitting
const Home = lazy(() => import("./pages/Home"))
const Auth = lazy(() => import("./pages/Auth"))
const Settings = lazy(() => import("./pages/Settings"))
const Profile = lazy(() => import("./pages/Profile"))
const Analytics = lazy(() => import("./pages/Analytics"))
const AIInsights = lazy(() => import("./pages/AIInsights"))
const CalendarView = lazy(() => import("./pages/CalendarView"))

// Lazy-loaded heavy component
const AIChatAssistant = lazy(() => import("./components/AIChatAssistant"))
const ZenFocusRoom = lazy(() => import("./pages/ZenFocusRoom"))
const KanbanBoard = lazy(() => import("./pages/KanbanBoard"))

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
    return <LoadingScreen message="Initializing FlowNest..." />
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-300">
              <Navbar />
              <OfflineIndicator />
              <ReloadPrompt />
              <main className="flex-1">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center min-h-screen">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                >
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
                        path="/ai-insights"
                        element={
                          <ProtectedRoute>
                            <AIInsights />
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
                        path="/focus"
                        element={
                          <ProtectedRoute>
                            <ZenFocusRoom />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/tasks"
                        element={
                          <ProtectedRoute>
                            <KanbanBoard />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </AnimatePresence>
                </Suspense>
              </main>
              <Footer />
              
              {/* AI Chat Assistant - Available on all pages */}
              <Suspense fallback={null}>
                <AIChatAssistant />
              </Suspense>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
