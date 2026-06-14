import { motion } from 'framer-motion';
import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { FaPlus, FaTrash, FaExclamationCircle } from "react-icons/fa"
import { useTodos } from "../hooks/useFirestore"
import { LoadingSpinner } from "./Loading"

const TodoWidget = () => {
  const { todos, loading, error, addTodo, updateTodo, deleteTodo } = useTodos()
  const [newTask, setNewTask] = useState("")
  const [priority, setPriority] = useState("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      await addTodo({
        text: newTask.trim(),
        completed: false,
        priority,
        order: priority === "high" ? 1 : priority === "medium" ? 2 : 3,
      })
      setNewTask("")
      setPriority("medium")
    } catch (error) {
      console.error("Error adding task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleComplete = async (id) => {
    try {
      const task = todos.find((task) => task.id === id)
      if (task) {
        await updateTodo(id, { completed: !task.completed })
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await deleteTodo(id)
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="card h-fit">
        <h2 className="widget-title">To-Do</h2>
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card h-fit">
        <h2 className="widget-title">To-Do</h2>
        <div className="text-center py-8">
          <FaExclamationCircle className="text-red-500 text-2xl mx-auto mb-2" />
          <p className="text-red-600 dark:text-red-400 text-sm">Failed to load tasks</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card h-fit">
      <h2 className="widget-title">To-Do</h2>

      <form onSubmit={handleAddTask} className="mb-4 space-y-3">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="input-field"
          disabled={isSubmitting}
        />
        <div className="flex gap-2">
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)} 
            className="input-field flex-1"
            disabled={isSubmitting}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button 
            type="submit" 
            className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !newTask.trim()}
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : <FaPlus size={16} />}
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {todos.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-green-500 focus:ring-green-500 dark:focus:ring-green-400"
                />
                <span
                  className={`flex-1 text-sm ${
                    task.completed 
                      ? "line-through text-gray-400 dark:text-gray-500" 
                      : "text-gray-900 dark:text-gray-100"
                  } truncate`}
                >
                  {task.text}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)} flex-shrink-0`}>
                  {task.priority}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 ml-2"
                aria-label="Delete task"
              >
                <FaTrash size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {todos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks yet. Add one above!</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TodoWidget
