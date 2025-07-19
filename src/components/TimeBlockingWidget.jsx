import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaClock, FaPlus, FaTrash } from "react-icons/fa"

const TimeBlockingWidget = () => {
  const [timeBlocks, setTimeBlocks] = useState([])
  const [newBlock, setNewBlock] = useState({
    title: "",
    startTime: "",
    endTime: "",
    color: "blue",
  })
  const [showForm, setShowForm] = useState(false)

  const colors = [
    {
      name: "blue",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-800 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      name: "green",
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-300",
      border: "border-green-200 dark:border-green-800",
    },
    {
      name: "purple",
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-800 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800",
    },
    {
      name: "orange",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-800 dark:text-orange-300",
      border: "border-orange-200 dark:border-orange-800",
    },
  ]

  useEffect(() => {
    const saved = localStorage.getItem("timeBlocks")
    const savedDate = localStorage.getItem("timeBlocksDate")
    const today = new Date().toDateString()

    if (saved && savedDate === today) {
      setTimeBlocks(JSON.parse(saved))
    } else {
      setTimeBlocks([])
      localStorage.setItem("timeBlocksDate", today)
    }
  }, [])

  const saveTimeBlocks = (blocks) => {
    setTimeBlocks(blocks)
    localStorage.setItem("timeBlocks", JSON.stringify(blocks))
    localStorage.setItem("timeBlocksDate", new Date().toDateString())
  }

  const addTimeBlock = (e) => {
    e.preventDefault()
    if (!newBlock.title || !newBlock.startTime || !newBlock.endTime) return

    const block = {
      id: Date.now(),
      ...newBlock,
    }

    const updatedBlocks = [...timeBlocks, block].sort((a, b) => a.startTime.localeCompare(b.startTime))
    saveTimeBlocks(updatedBlocks)

    setNewBlock({ title: "", startTime: "", endTime: "", color: "blue" })
    setShowForm(false)
  }

  const deleteTimeBlock = (id) => {
    const updatedBlocks = timeBlocks.filter((block) => block.id !== id)
    saveTimeBlocks(updatedBlocks)
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getColorClasses = (colorName) => {
    return colors.find((c) => c.name === colorName) || colors[0]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-slate-200 dark:border-slate-800 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaClock className="h-5 w-5 text-slate-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Time Blocking</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
        >
          <FaPlus size={14} />
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={addTimeBlock}
          className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3"
        >
          <input
            type="text"
            value={newBlock.title}
            onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
            placeholder="Activity title..."
            className="input-field text-sm"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="time"
              value={newBlock.startTime}
              onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })}
              className="input-field text-sm"
              required
            />
            <input
              type="time"
              value={newBlock.endTime}
              onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })}
              className="input-field text-sm"
              required
            />
          </div>
          <div className="flex space-x-2">
            {colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setNewBlock({ ...newBlock, color: color.name })}
                className={`w-6 h-6 rounded-full ${color.bg} ${color.border} border-2 ${
                  newBlock.color === color.name ? "ring-2 ring-gray-400" : ""
                }`}
              />
            ))}
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="btn-primary text-sm flex-1">
              Add Block
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {timeBlocks.length > 0 ? (
          timeBlocks.map((block) => {
            const colorClasses = getColorClasses(block.color)
            return (
              <div
                key={block.id}
                className={`p-3 rounded-lg ${colorClasses.bg} ${colorClasses.border} border flex items-center justify-between`}
              >
                <div>
                  <h4 className={`font-medium ${colorClasses.text} text-sm`}>{block.title}</h4>
                  <p className={`text-xs ${colorClasses.text} opacity-75`}>
                    {formatTime(block.startTime)} - {formatTime(block.endTime)}
                  </p>
                </div>
                <button
                  onClick={() => deleteTimeBlock(block.id)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            )
          })
        ) : (
          <div className="text-center py-6">
            <FaClock className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No time blocks for today</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TimeBlockingWidget
