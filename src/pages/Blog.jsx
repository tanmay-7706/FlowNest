import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaCalendar, FaPlus, FaTrash, FaBookOpen, FaPen, FaLightbulb } from "react-icons/fa"

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
    { value: "cool", emoji: "😎", label: "Cool" },
    { value: "frustrated", emoji: "😤", label: "Frustrated" },
    { value: "mindblown", emoji: "🤯", label: "Mind Blown" },
    { value: "neutral", emoji: "😐", label: "Neutral" },
    { value: "pleading", emoji: "🥹", label: "Pleading" },
    { value: "hugging", emoji: "🤗", label: "Hugging" },
    { value: "sleepy", emoji: "🥱", label: "Sleepy" },
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

  // Sample reflection cards for better layout of the page -->
  const sampleReflections = [
    {
      id: "sample1",
      title: "Weekly Planning Session",
      content:
        "Spent time organizing my goals for the upcoming week. Feeling more structured and ready to tackle challenges.",
      mood: "excited",
      date: "2024-01-15",
      category: "planning",
    },
    {
      id: "sample2",
      title: "Mindfulness Practice",
      content: "Dedicated 20 minutes to meditation today. It helped me center myself and approach tasks with clarity.",
      mood: "neutral",
      date: "2024-01-14",
      category: "wellness",
    },
    {
      id: "sample3",
      title: "Project Completion",
      content: "Successfully finished the quarterly report. The sense of accomplishment is incredibly motivating.",
      mood: "happy",
      date: "2024-01-13",
      category: "work",
    },
    {
      id: "sample4",
      title: "Learning Journey",
      content: "Started a new online course on productivity techniques. Excited to implement new strategies.",
      mood: "excited",
      date: "2024-01-12",
      category: "learning",
    },
  ]

  const allReflections = [...reflections, ...sampleReflections]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <FaBookOpen className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Weekly Reflections</h1>
                <p className="text-gray-600 dark:text-gray-300">Document your journey and track your growth</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center"
            >
              <FaPlus size={18} className="mr-2" />
              New Reflection
            </button>
          </div>

          {/* Mood Meter - Enhanced with more emojis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Today's Mood</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodChange(mood.value)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                    currentMood === mood.value
                      ? "bg-green-100 dark:bg-green-900/30 scale-110 border-2 border-green-500"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-2xl mb-2">{mood.emoji}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add Reflection Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Reflection</h2>
              <form onSubmit={handleAddReflection} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newReflection.title}
                    onChange={(e) => setNewReflection({ ...newReflection, title: e.target.value })}
                    placeholder="Enter reflection title"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={newReflection.date}
                    onChange={(e) => setNewReflection({ ...newReflection, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mood</label>
                  <select
                    value={newReflection.mood}
                    onChange={(e) => setNewReflection({ ...newReflection, mood: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  >
                    {moods.map((mood) => (
                      <option key={mood.value} value={mood.value}>
                        {mood.emoji} {mood.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                  <textarea
                    value={newReflection.content}
                    onChange={(e) => setNewReflection({ ...newReflection, content: e.target.value })}
                    placeholder="Write your reflection..."
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 min-h-[150px] resize-none"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    Save Reflection
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Reflections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allReflections.length > 0 ? (
              allReflections.map((reflection) => (
                <motion.div
                  key={reflection.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getMoodEmoji(reflection.mood)}</span>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{reflection.title}</h3>
                    </div>
                    {!reflection.id.toString().startsWith("sample") && (
                      <button
                        onClick={() => handleDeleteReflection(reflection.id)}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        <FaTrash size={16} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <FaCalendar size={14} className="mr-1" />
                    {formatDate(reflection.date)}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{reflection.content}</p>
                  {reflection.category && (
                    <div className="mt-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                        {reflection.category}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <FaPen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No reflections yet. Start journaling your week!</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Create Your First Reflection
                </button>
              </div>
            )}
          </div>

          {/* Reflection Tips */}
          <div className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center mb-6">
              <FaLightbulb className="h-6 w-6 text-purple-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reflection Tips</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Be Honest</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Write authentically about your experiences, both positive and challenging.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Focus on Growth</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Identify lessons learned and areas for improvement in your reflections.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Regular Practice</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Make reflection a weekly habit to track your personal development journey.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Blog
