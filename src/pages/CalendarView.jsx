import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
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
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  })

  // Mock Google Calendar data for demonstration
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
    // Simulate loading Google Calendar events
    setLoading(true)
    setTimeout(() => {
      setEvents(mockEvents)
      setLoading(false)
    }, 1000)
  }, [currentMonth, currentYear])

  const connectGoogleCalendar = async () => {
    setLoading(true)
    // Simulate Google OAuth flow
    setTimeout(() => {
      setIsGoogleConnected(true)
      setEvents(mockEvents)
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

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 p-2"></div>)
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
          className={`h-24 p-2 border border-gray-200 dark:border-gray-600 cursor-pointer transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105 ${
            isToday ? "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400" : ""
          } ${isSelected ? "bg-blue-100 dark:bg-blue-900/30 border-blue-500 shadow-md" : ""}`}
        >
          <div className="font-medium text-gray-900 dark:text-white">{day}</div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate transition-all hover:scale-105 ${
                  event.type === "meeting"
                    ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
                    : event.type === "deadline"
                      ? "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"
                      : "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200"
                }`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>,
      )
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FaChevronLeft className="text-gray-600 dark:text-gray-300" />
              </button>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FaChevronRight className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            {!isGoogleConnected && (
              <button
                onClick={connectGoogleCalendar}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <FaGoogle size={16} />
                <span>{loading ? "Connecting..." : "Connect Google Calendar"}</span>
              </button>
            )}
            {isGoogleConnected && (
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
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
              className="bg-gray-100 dark:bg-gray-700 p-3 text-center font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600"
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
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-0">Calendar View</h1>
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
                        className="p-3 rounded-lg border transition-all hover:shadow-md bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">{event.title}</span>
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            {event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
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
