"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save } from "lucide-react"

const ReflectionWidget = () => {
  const [reflection, setReflection] = useState("")
  const [savedReflections, setSavedReflections] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem("reflections")
    if (saved) {
      setSavedReflections(JSON.parse(saved))
    }
  }, [])

  const saveReflection = () => {
    if (!reflection.trim()) return

    const newReflection = {
      id: Date.now(),
      text: reflection,
      date: new Date().toISOString(),
    }

    const updatedReflections = [newReflection, ...savedReflections]
    setSavedReflections(updatedReflections)
    localStorage.setItem("reflections", JSON.stringify(updatedReflections))
    setReflection("")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <h2 className="text-xl font-semibold mb-4">Daily Reflection</h2>

      <div className="mb-4">
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write your thoughts..."
          className="input-field min-h-[120px] resize-none"
        />
      </div>

      <div className="flex justify-end mb-6">
        <button onClick={saveReflection} className="btn-primary flex items-center" disabled={!reflection.trim()}>
          <Save size={18} className="mr-2" />
          Save Reflection
        </button>
      </div>

      {savedReflections.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-lg font-medium mb-3">Previous Reflections</h3>
          <div className="space-y-3">
            {savedReflections.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">{formatDate(item.date)}</div>
                <p className="text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ReflectionWidget
