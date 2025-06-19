import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Calendar from "react-calendar"
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore"
import { db } from "../utils/firebase"
import { useAuth } from "../context/AuthContext"
import { Plus, CalendarIcon, Clock } from "lucide-react"
import "react-calendar/dist/Calendar.css"

const CalendarView = () => {
  const { currentUser } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [habits, setHabits] = useState([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  })

  useEffect(() => {
    if (!currentUser) return

    // Fetch tasks
    const tasksQuery = query(collection(db, "todos"), where("userId", "==", currentUser.uid))

    const unsubscribeTasks = onSnapshot(tasksQuery, (querySnapshot) => {
      const tasksData = []
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() })
      })
      setTasks(tasksData)
    })

    // Fetch habits
    const habitsQuery = query(collection(db, "habits"), where("userId", "==", currentUser.uid))

    const unsubscribeHabits = onSnapshot(habitsQuery, (querySnapshot) => {
      const habitsData = []
      querySnapshot.forEach((doc) => {
        habitsData.push({ id: doc.id, ...doc.data() })
      })
      setHabits(habitsData)
    })

    return () => {
      unsubscribeTasks()
      unsubscribeHabits()
    }
  }, [currentUser])

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]
  }

  const getTasksForDate = (date) => {
    const dateStr = formatDate(date)
    return tasks.filter((task) => task.dueDate === dateStr)
  }

  const getHabitsForDate = (date) => {
    const dayIndex = (date.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
    return habits.filter((habit) => habit.days && habit.days[dayIndex])
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setNewTask({ ...newTask, dueDate: formatDate(date) })
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    try {
      await addDoc(collection(db, "todos"), {
        ...newTask,
        userId: currentUser.uid,
        completed: false,
        createdAt: new Date().toISOString(),
        order: newTask.priority === "high" ? 1 : newTask.priority === "medium" ? 2 : 3,
      })

      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        dueDate: formatDate(selectedDate),
      })
      setShowTaskForm(false)
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayTasks = getTasksForDate(date)
      const dayHabits = getHabitsForDate(date)

      return (
        <div className="flex flex-col items-center">
          {dayTasks.length > 0 && <div className="w-2 h-2 bg-blue-500 rounded-full mb-1"></div>}
          {dayHabits.length > 0 && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
        </div>
      )
    }
  }

  const selectedDateTasks = getTasksForDate(selectedDate)
  const selectedDateHabits = getHabitsForDate(selectedDate)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 lg:mb-0">Calendar View</h1>
        <button onClick={() => setShowTaskForm(!showTaskForm)} className="btn-primary flex items-center">
          <Plus size={18} className="mr-2" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="card">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              onClickDay={handleDateClick}
              tileContent={tileContent}
              className="w-full border-none"
            />
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          {/* Add Task Form */}
          {showTaskForm && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card">
              <h3 className="text-lg font-semibold mb-4">Add Task</h3>
              <form onSubmit={handleAddTask} className="space-y-3">
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                  className="input-field"
                  required
                />
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Description"
                  className="input-field min-h-[80px]"
                />
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <div className="flex space-x-2">
                  <button type="submit" className="btn-primary flex-1">
                    Add Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTaskForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Selected Date Info */}
          <div className="card">
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
            </div>

            {/* Tasks for Selected Date */}
            <div className="mb-6">
              <h4 className="font-medium mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Tasks ({selectedDateTasks.length})
              </h4>
              {selectedDateTasks.length > 0 ? (
                <div className="space-y-2">
                  {selectedDateTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border ${
                        task.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={task.completed ? "line-through text-gray-500" : ""}>
                          {task.text || task.title}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No tasks for this date</p>
              )}
            </div>

            {/* Habits for Selected Date */}
            <div>
              <h4 className="font-medium mb-3">Habits ({selectedDateHabits.length})</h4>
              {selectedDateHabits.length > 0 ? (
                <div className="space-y-2">
                  {selectedDateHabits.map((habit) => (
                    <div key={habit.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <span>{habit.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No habits scheduled for this date</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CalendarView
