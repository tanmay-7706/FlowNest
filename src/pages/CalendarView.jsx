import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore"
import { db } from "../utils/firebase"
import {
  FaPlus,
  FaCalendarAlt,
  FaClock,
  FaChartLine,
  FaGoogle,
  FaSync,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaTasks,
  FaBell,
  FaTimes,
  FaSave,
} from "react-icons/fa"

const CalendarView = () => {
  const { currentUser } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [events, setEvents] = useState([])
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: new Date().toISOString().split("T")[0],
    dueTime: "09:00",
  })

  // Mocking Google Calendar data for demonstration -->
  const mockEvents = [
    {
      id: 1,
      title: "Team Meeting",
      start: new Date(currentYear, currentMonth, 15, 10, 0),
      end: new Date(currentYear, currentMonth, 15, 11, 0),
      description: "Weekly team sync",
      type: "meeting",
    },
    {
      id: 2,
      title: "Project Deadline",
      start: new Date(currentYear, currentMonth, 18, 17, 0),
      end: new Date(currentYear, currentMonth, 18, 18, 0),
      description: "Submit final proposal",
      type: "deadline",
    },
    {
      id: 3,
      title: "Client Call",
      start: new Date(currentYear, currentMonth, 20, 14, 0),
      end: new Date(currentYear, currentMonth, 20, 15, 0),
      description: "Quarterly review",
      type: "call",
    },
  ]

  useEffect(() => {
    if (!currentUser) return

    // Taking calendar events from Firebase Firestore -->
    const q = query(
      collection(db, "calendar-events"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc"),
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const firebaseEvents = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        firebaseEvents.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          start: new Date(data.dueDate + "T" + data.dueTime),
          end: new Date(data.dueDate + "T" + data.dueTime),
          type: "task",
          priority: data.priority,
        })
      })

      // Combining Firebase events with mock events -->
      setEvents([...mockEvents, ...firebaseEvents])
    })

    return () => unsubscribe()
  }, [currentUser, currentMonth, currentYear])

  const connectGoogleCalendar = async () => {
    setLoading(true)
    // Simulating Google OAuth flow -->
    setTimeout(() => {
      setIsGoogleConnected(true)
      setLoading(false)
    }, 2000)
  }

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask.title.trim() || !currentUser) return

    setSaving(true)
    try {
      await addDoc(collection(db, "calendar-events"), {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        dueTime: newTask.dueTime,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      })

      // Reset form -->
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        dueDate: new Date().toISOString().split("T")[0],
        dueTime: "09:00",
      })
      setShowTaskForm(false)
      setShowSuccess(true)

      // Hide success message after 3 seconds -->
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error("Error adding task:", error)
      alert("Failed to add task. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const getEventsForDate = (date) => {
    return events.filter((event) => event.start.toDateString() === date.toDateString())
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    return events.filter((event) => event.start >= today && event.start <= nextWeek).slice(0, 5)
  }

  const getTodaysEvents = () => {
    const today = new Date()
    return events.filter((event) => event.start.toDateString() === today.toDateString())
  }

  const selectedDateEvents = getEventsForDate(selectedDate)
  const upcomingEvents = getUpcomingEvents()
  const todaysEvents = getTodaysEvents()

  const getEventTypeColor = (type, priority) => {
    if (type === "task") {
      switch (priority) {
        case "high":
          return "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700"
        case "medium":
          return "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700"
        case "low":
          return "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
        default:
          return "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700"
      }
    }

    switch (type) {
      case "meeting":
        return "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700"
      case "deadline":
        return "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700"
      case "call":
        return "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
      default:
        return "bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700"
    }
  }

  const renderCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    // Empty cells for days before the first day of the month -->
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-28 p-2 border border-gray-100 dark:border-gray-700"></div>)
    }

    // Days of the month -->
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const dayEvents = getEventsForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()
      const isSelected = date.toDateString() === selectedDate.toDateString()

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-28 p-2 border border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-[1.02] ${
            isToday ? "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-600 shadow-md" : ""
          } ${
            isSelected
              ? "bg-blue-100 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800"
              : ""
          }`}
        >
          <div
            className={`font-semibold text-sm mb-1 ${isToday ? "text-yellow-800 dark:text-yellow-200" : "text-gray-900 dark:text-white"}`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded border truncate transition-all hover:scale-105 ${getEventTypeColor(event.type, event.priority)}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>,
      )
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
              >
                <FaChevronLeft className="text-gray-600 dark:text-gray-300" />
              </button>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={() => navigateMonth("next")}
                className="p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
              >
                <FaChevronRight className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            {!isGoogleConnected && (
              <button
                onClick={connectGoogleCalendar}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-md"
              >
                <FaGoogle size={16} />
                <span>{loading ? "Connecting..." : "Connect Google Calendar"}</span>
              </button>
            )}
            {isGoogleConnected && (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                <FaCheckCircle size={16} />
                <span className="text-sm font-medium">Google Calendar Connected</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="bg-gray-100 dark:bg-gray-700 p-4 text-center font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600"
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2"
              >
                <FaCheckCircle />
                <span>Task added successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div className="flex items-center space-x-3 mb-4 lg:mb-0">
              <FaCalendarAlt className="h-8 w-8 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar View</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center"
              >
                <FaPlus size={16} className="mr-2" />
                Add Event
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
              >
                <FaSync size={16} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Add Task Form */}
          <AnimatePresence>
            {showTaskForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Task</h2>
                    <button
                      onClick={() => setShowTaskForm(false)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Task Title *
                        </label>
                        <input
                          type="text"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          placeholder="Enter task title"
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Priority
                        </label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        >
                          <option value="high">High Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="low">Low Priority</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Enter task description"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 min-h-[100px] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Due Time
                        </label>
                        <input
                          type="time"
                          value={newTask.dueTime}
                          onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowTaskForm(false)}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center disabled:opacity-50"
                      >
                        <FaSave size={16} className="mr-2" />
                        {saving ? "Adding..." : "Add Task"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Calendar - Full Width */}
            <div className="xl:col-span-3">{renderCalendar()}</div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Date Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <FaCalendarAlt className="h-5 w-5 text-blue-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                </div>

                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg border transition-all hover:shadow-md ${getEventTypeColor(event.type, event.priority)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{event.title}</span>
                          <span className="text-xs">
                            {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-sm opacity-75">{event.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm py-4 text-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                    No events for this date
                  </p>
                )}
              </div>

              {/* Today's Events Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FaClock className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Events</h3>
                </div>
                {todaysEvents.length > 0 ? (
                  <div className="space-y-2">
                    {todaysEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</span>
                          <span className="text-xs text-green-600 dark:text-green-400">
                            {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No events today</p>
                )}
              </div>

              {/* Quick Task Add */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FaTasks className="h-5 w-5 text-purple-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Add</h3>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Add a quick task..."
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  />
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                    Add Task
                  </button>
                </div>
              </div>

              {/* Upcoming Reminders */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FaBell className="h-5 w-5 text-orange-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Reminders</h3>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Review weekly goals</span>
                      <span className="text-xs text-orange-600 dark:text-orange-400">Tomorrow</span>
                    </div>
                  </div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Team standup</span>
                      <span className="text-xs text-orange-600 dark:text-orange-400">Friday</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section - Below Calendar */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Calendar Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{events.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FaCalendarAlt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingEvents.length}</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FaClock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{todaysEvents.length}</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FaTasks className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <FaChartLine className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CalendarView
