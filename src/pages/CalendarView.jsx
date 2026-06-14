import { useState, useEffect, useMemo } from "react"
import { AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore"
import { db } from "../utils/firebase"
import GoogleCalendarIntegration from "../components/GoogleCalendarIntegration"
import {
  FaPlus,
  FaCalendarAlt,
  FaClock,
  FaChartLine,
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
  const [isGoogleConnected, _setIsGoogleConnected] = useState(false)
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
  const mockEvents = useMemo(() => [
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
  ], [currentYear, currentMonth])

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
  }, [currentUser, currentMonth, currentYear, mockEvents])


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
          return "bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/50"
        case "medium":
          return "bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50"
        case "low":
          return "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50"
        default:
          return "bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50"
      }
    }

    switch (type) {
      case "meeting":
        return "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50"
      case "deadline":
        return "bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50"
      case "call":
        return "bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/50"
      default:
        return "bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/50"
    }
  }

  const renderCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ]

    // Empty cells
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-28 rounded-2xl bg-white/20 dark:bg-gray-800/20 border border-white/10 dark:border-gray-700/30"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const dayEvents = getEventsForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()
      const isSelected = date.toDateString() === selectedDate.toDateString()

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-28 p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.03] flex flex-col ${
            isToday 
              ? "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700/50 shadow-md" 
              : "bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700/50"
          } ${
            isSelected
              ? "ring-2 ring-indigo-500 shadow-lg !bg-white dark:!bg-slate-800"
              : "border"
          }`}
        >
          <div className={`font-bold text-sm mb-2 ${isToday ? "text-amber-700 dark:text-amber-400" : "text-slate-700 dark:text-slate-300"}`}>
            {day}
          </div>
          <div className="space-y-1 overflow-hidden">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md border backdrop-blur-md truncate transition-all hover:scale-105 ${getEventTypeColor(event.type, event.priority)}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold pl-1">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>,
      )
    }

    return (
      <div className="glass-panel overflow-hidden">
        <div className="bg-white/40 dark:bg-gray-800/40 p-6 border-b border-white/20 dark:border-gray-700/50 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 bg-white/50 dark:bg-gray-900/50 rounded-2xl p-1.5 backdrop-blur-md shadow-sm border border-white/30 dark:border-gray-700/50">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm text-gray-600 dark:text-gray-300"
            >
              <FaChevronLeft size={14} />
            </button>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 min-w-[140px] text-center tracking-tight">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <button
              onClick={() => navigateMonth("next")}
              className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all shadow-sm text-gray-600 dark:text-gray-300"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isGoogleConnected ? (
              <div className="text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 bg-indigo-100/50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl backdrop-blur-md border border-indigo-200/50 dark:border-indigo-800/50 font-medium">
                Connect Google Calendar for real-time sync
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl backdrop-blur-md border border-emerald-200/50 dark:border-emerald-800/50">
                <FaCheckCircle size={16} />
                <span className="text-sm font-semibold">Synced</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-transparent">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 pb-2"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                className="fixed top-20 right-4 bg-emerald-500/90 backdrop-blur-md border border-emerald-400 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center space-x-3"
              >
                <div className="bg-white/20 p-1.5 rounded-full"><FaCheckCircle size={18} /></div>
                <span className="font-semibold">Task added successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30">
                <FaCalendarAlt className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Calendar</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your time, meetings, and tasks.</p>
              </div>
            </div>
            <div className="flex space-x-3 w-full lg:w-auto">
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="flex-1 lg:flex-none bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
              >
                <FaPlus size={14} className="mr-2" />
                Add Event
              </button>
              <button
                onClick={() => window.location.reload()}
                className="p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/40 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
              >
                <FaSync size={16} />
              </button>
            </div>
          </div>

          {/* Add Task Form inside a Glass Panel */}
          <AnimatePresence>
            {showTaskForm && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.98 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="glass-panel p-6 sm:p-8 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-2 rounded-xl mr-3">
                        <FaTasks size={16} />
                      </span>
                      Create New Event
                    </h2>
                    <button
                      onClick={() => setShowTaskForm(false)}
                      className="p-2.5 bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-gray-500 transition-colors"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>

                  <form onSubmit={handleAddTask} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Event Title *</label>
                        <input
                          type="text"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          placeholder="e.g. Weekly Standup"
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Priority Level</label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
                        >
                          <option value="high">High Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="low">Low Priority</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description / Notes</label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Add some details about this event..."
                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 min-h-[100px] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date</label>
                        <input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Time</label>
                        <input
                          type="time"
                          value={newTask.dueTime}
                          onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                          className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <button
                        type="button"
                        onClick={() => setShowTaskForm(false)}
                        className="px-6 py-3 bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl text-gray-700 dark:text-gray-300 transition-colors font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaSave size={16} className="mr-2" />
                        {saving ? "Saving..." : "Save Event"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Calendar Component */}
            <div className="xl:col-span-3 space-y-6 lg:space-y-8">
              {renderCalendar()}
              
              {/* Statistics Section - Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bento-card relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                    <FaCalendarAlt size={100} />
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="p-3 w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mb-4 shadow-inner">
                      <FaCalendarAlt size={20} />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">{events.length}</p>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Total Events</p>
                    </div>
                  </div>
                </div>

                <div className="bento-card relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                    <FaClock size={100} />
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="p-3 w-12 h-12 flex items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 mb-4 shadow-inner">
                      <FaClock size={20} />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">{upcomingEvents.length}</p>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">This Week</p>
                    </div>
                  </div>
                </div>

                <div className="bento-card relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                    <FaTasks size={100} />
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="p-3 w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 mb-4 shadow-inner">
                      <FaTasks size={20} />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">{todaysEvents.length}</p>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Due Today</p>
                    </div>
                  </div>
                </div>

                <div className="bento-card relative overflow-hidden group bg-gradient-to-br from-indigo-500 to-purple-600 border-none shadow-lg shadow-indigo-500/20">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-white transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                    <FaChartLine size={100} />
                  </div>
                  <div className="relative z-10 flex flex-col h-full justify-between text-white">
                    <div className="p-3 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/20 mb-4 backdrop-blur-sm">
                      <FaChartLine size={20} />
                    </div>
                    <div>
                      <p className="text-3xl font-black tracking-tight">85%</p>
                      <p className="text-sm font-medium text-white/80 mt-1">Completion Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6 lg:space-y-8">
              <GoogleCalendarIntegration />
              
              <div className="bento-card relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150"></div>
                <div className="flex items-center mb-5 relative z-10">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 mr-3">
                    <FaCalendarAlt size={16} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "short", month: "short", day: "numeric",
                    })}
                  </h3>
                </div>

                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3 relative z-10 max-h-[300px] overflow-y-auto pr-1">
                    {selectedDateEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-3 rounded-2xl border backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-md ${getEventTypeColor(event.type, event.priority)}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-sm tracking-tight">{event.title}</span>
                          <span className="text-xs font-semibold px-2 py-1 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                            {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        {event.description && <p className="text-xs font-medium opacity-80 mt-2 line-clamp-2">{event.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 border-dashed">
                    <FaCalendarAlt size={24} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Free day!</p>
                  </div>
                )}
              </div>

              <div className="bento-card">
                <div className="flex items-center mb-5">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 mr-3">
                    <FaTasks size={16} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Quick Add</h3>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="E.g. Call client at 3pm..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium transition-all"
                  />
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-xl shadow-md shadow-purple-500/20 hover:shadow-lg transition-all font-semibold flex items-center justify-center">
                    <FaPlus size={12} className="mr-2" /> Add Instantly
                  </button>
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
