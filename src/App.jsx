"use client"

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

function App() {
  const [widgets, setWidgets] = useState({
    todo: true,
    pomodoro: true,
    habit: true,
  })

  useEffect(() => {
    const savedWidgets = localStorage.getItem("widgets")
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets))
    }
  }, [])

  const updateWidgets = (newWidgets) => {
    setWidgets(newWidgets)
    localStorage.setItem("widgets", JSON.stringify(newWidgets))
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home widgets={widgets} />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth isSignup={true} />} />
            <Route path="/settings" element={<Settings widgets={widgets} updateWidgets={updateWidgets} />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
  )
}

export default App
