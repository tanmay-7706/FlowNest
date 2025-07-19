import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaPlus, FaTrash } from "react-icons/fa"
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../utils/firebase"
import { useAuth } from "../context/AuthContext"

const TodoWidget = () => {
  const { currentUser } = useAuth()
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [priority, setPriority] = useState("medium")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!currentUser) return

    const q = query(collection(db, "todos"), where("userId", "==", currentUser.uid))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = []
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() })
      })
      setTasks(tasksData.sort((a, b) => a.order - b.order))
    })

    return () => unsubscribe()
  }, [currentUser])

  const addTask = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      await addDoc(collection(db, "todos"), {
        text: newTask,
        completed: false,
        priority,
        order: priority === "high" ? 1 : priority === "medium" ? 2 : 3,
        userId: currentUser.uid,
      })
      setNewTask("")
      setPriority("medium")
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const toggleComplete = async (id) => {
    try {
      const taskRef = doc(db, "todos", id)
      const task = tasks.find((task) => task.id === id)
      if (task) {
        await updateDoc(taskRef, { completed: !task.completed })
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const deleteTask = async (id) => {
    try {
      const taskRef = doc(db, "todos", id)
      await deleteDoc(taskRef)
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card h-fit">
      <h2 className="widget-title">To-Do</h2>

      <form onSubmit={addTask} className="mb-4 space-y-3">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="input-field"
        />
        <div className="flex gap-2">
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input-field flex-1">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button type="submit" className="btn-primary px-4 py-2">
            <FaPlus size={16} />
          </button>
        </div>
      </form>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-green-500 focus:ring-green-500 dark:focus:ring-green-400"
              />
              <span
                className={`flex-1 text-sm ${task.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-gray-100"} truncate`}
              >
                {task.text}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)} flex-shrink-0`}>
                {task.priority}
              </span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 ml-2"
            >
              <FaTrash size={14} />
            </button>
          </motion.div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks yet. Add one above!</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TodoWidget
