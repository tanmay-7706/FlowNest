"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Plus, Trash2 } from "lucide-react"

const Blog = () => {
  const [reflections, setReflections] = useState([])
  const [currentMood, setCurrentMood] = useState("neutral")
  const [showForm, setShowForm] = useState(false)
  const [newReflection, setNewReflection] = useState({
    title: "",
    content: "",
    mood: "neutral",
    date: new Date().toISOString().split("T")[0],
  })

  const moods = [
    { value: "happy", emoji: "😊", label: "Happy" },
    { value: "excited", emoji: "🎉", label: "Excited" },
    { value: "neutral", emoji: "😐", label: "Neutral" },
    { value: "tired", emoji: "😴", label: "Tired" },
    { value: "sad", emoji: "😔", label: "Sad" },
  ]

  useEffect(() => {
    const savedReflections = localStorage.getItem("weeklyReflections")
    if (savedReflections) {
      setReflections(JSON.parse(savedReflections))
    }

    const savedMood = localStorage.getItem("currentMood")
    if (savedMood) {
      setCurrentMood(savedMood)
    }
  }, [])

  const saveReflections = (updatedReflections) => {
    setReflections(updatedReflections)
    localStorage.setItem("weeklyReflections", JSON.stringify(updatedReflections))
  }

  const handleMoodChange = (mood) => {
    setCurrentMood(mood)
    localStorage.setItem("currentMood", mood)
  }

  const handleAddReflection = (e) => {
    e.preventDefault()
    if (!newReflection.title.trim() || !newReflection.content.trim()) return

    const reflection = {
      id: Date.now(),
      ...newReflection,
      createdAt: new Date().toISOString(),
    }

    saveReflections([reflection, ...reflections])
    setNewReflection({
      title: "",
      content: "",
      mood: "neutral",
      date: new Date().toISOString().split("T")[0],
    })
    setShowForm(false)
  }

  const handleDeleteReflection = (id) => {
    const updatedReflections = reflections.filter((reflection) => reflection.id !== id)
    saveReflections(updatedReflections)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getMoodEmoji = (mood) => {
    const foundMood = moods.find((m) => m.value === mood)
    return foundMood ? foundMood.emoji : "😐"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Weekly Reflections</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center">
          <Plus size={18} className="mr-2" />
          New Reflection
        </button>
      </div>

      {/* Mood Meter */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Mood</h2>
        <div className="flex justify-between items-center">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodChange(mood.value)}
              className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                currentMood === mood.value ? "bg-green-100 scale-110" : "hover:bg-gray-100"
              }`}
            >
              <span className="text-3xl mb-2">{mood.emoji}</span>
              <span className="text-sm font-medium">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Reflection Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Reflection</h2>
          <form onSubmit={handleAddReflection} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newReflection.title}
                onChange={(e) => setNewReflection({ ...newReflection, title: e.target.value })}
                placeholder="Enter reflection title"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newReflection.date}
                onChange={(e) => setNewReflection({ ...newReflection, date: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
              <select
                value={newReflection.mood}
                onChange={(e) => setNewReflection({ ...newReflection, mood: e.target.value })}
                className="input-field"
              >
                {moods.map((mood) => (
                  <option key={mood.value} value={mood.value}>
                    {mood.emoji} {mood.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={newReflection.content}
                onChange={(e) => setNewReflection({ ...newReflection, content: e.target.value })}
                placeholder="Write your reflection..."
                className="input-field min-h-[150px]"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Reflection
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Reflections List */}
      <div className="space-y-6">
        {reflections.length > 0 ? (
          reflections.map((reflection) => (
            <motion.div key={reflection.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getMoodEmoji(reflection.mood)}</span>
                  <h3 className="text-xl font-medium">{reflection.title}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteReflection(reflection.id)}
                    className="p-1 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-2 mb-3">
                <Calendar size={16} className="mr-1" />
                {formatDate(reflection.date)}
              </div>
              <p className="text-gray-700">{reflection.content}</p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No reflections yet. Start journaling your week!</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Create Your First Reflection
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Blog
