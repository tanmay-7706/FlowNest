import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCalendarAlt, FaPlus, FaSync, FaSignOutAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import GoogleCalendarService from '../services/GoogleCalendarService'
import { LoadingSpinner } from './Loading'

const GoogleCalendarIntegration = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState(null)
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    location: ''
  })

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      await GoogleCalendarService.initialize()
      setIsConnected(GoogleCalendarService.isAuthenticated())
      if (GoogleCalendarService.isAuthenticated()) {
        await loadEvents()
      }
    } catch (error) {
      console.error('Failed to initialize Google Calendar:', error)
      setError('Failed to initialize Google Calendar')
    }
  }

  const connectToGoogle = async () => {
    setLoading(true)
    setError(null)
    
    try {
      await GoogleCalendarService.signIn()
      setIsConnected(true)
      await loadEvents()
    } catch (error) {
      setError('Failed to connect to Google Calendar')
    } finally {
      setLoading(false)
    }
  }

  const disconnect = async () => {
    try {
      await GoogleCalendarService.signOut()
      setIsConnected(false)
      setEvents([])
    } catch (error) {
      setError('Failed to disconnect from Google Calendar')
    }
  }

  const loadEvents = async () => {
    setSyncing(true)
    try {
      const calendarEvents = await GoogleCalendarService.getEvents()
      setEvents(calendarEvents.slice(0, 10)) // Show next 10 events
    } catch (error) {
      setError('Failed to load calendar events')
    } finally {
      setSyncing(false)
    }
  }

  const createEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) return

    setLoading(true)
    try {
      await GoogleCalendarService.createEvent({
        title: newEvent.title,
        description: newEvent.description,
        start: new Date(newEvent.start).toISOString(),
        end: new Date(newEvent.end).toISOString(),
        location: newEvent.location
      })
      
      setNewEvent({ title: '', description: '', start: '', end: '', location: '' })
      setShowCreateEvent(false)
      await loadEvents()
    } catch (error) {
      setError('Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const formatEventTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getEventStatus = (event) => {
    const now = new Date()
    const start = new Date(event.start)
    const end = new Date(event.end)
    
    if (now < start) return 'upcoming'
    if (now >= start && now <= end) return 'ongoing'
    return 'past'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'ongoing': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'past': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (!isConnected) {
    return (
      <div className="bento-card">
        <div className="text-center">
          <FcGoogle className="h-16 w-16 mx-auto mb-4 drop-shadow-md" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Connect Google Calendar
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sync your Google Calendar events with FlowNest for better productivity planning
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <button
            onClick={connectToGoogle}
            disabled={loading}
            className="btn-primary disabled:opacity-50 flex items-center justify-center w-full gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <FcGoogle className="h-5 w-5 bg-white rounded-full p-0.5" />
                <span>Connect Google Calendar</span>
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bento-card">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FcGoogle className="h-7 w-7 mr-3 drop-shadow-sm" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Google Calendar
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connected • Real-time sync
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadEvents}
              disabled={syncing}
              className="btn-secondary text-sm px-3 py-1 disabled:opacity-50"
            >
              {syncing ? <LoadingSpinner size="sm" /> : <FaSync />}
            </button>
            <button
              onClick={() => setShowCreateEvent(true)}
              className="btn-primary text-sm px-3 py-1"
            >
              <FaPlus className="mr-1" />
              Event
            </button>
            <button
              onClick={disconnect}
              className="text-gray-400 hover:text-red-500 p-1"
              title="Disconnect"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {events.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Upcoming Events
            </h4>
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                      {event.title}
                    </h5>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <FaClock className="mr-1" />
                      {event.isAllDay ? 'All day' : formatEventTime(event.start)}
                      {!event.isAllDay && ` - ${formatEventTime(event.end)}`}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <FaMapMarkerAlt className="mr-1" />
                        {event.location}
                      </div>
                    )}
                    {event.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(getEventStatus(event))}`}>
                    {getEventStatus(event)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaCalendarAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No upcoming events found
            </p>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowCreateEvent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create Calendar Event
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                />
                
                <textarea
                  placeholder="Description (optional)"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field h-20 resize-none"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start
                    </label>
                    <input
                      type="datetime-local"
                      value={newEvent.start}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, start: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End
                    </label>
                    <input
                      type="datetime-local"
                      value={newEvent.end}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, end: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <input
                  type="text"
                  placeholder="Location (optional)"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                  className="input-field"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateEvent(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={createEvent}
                  disabled={loading || !newEvent.title || !newEvent.start || !newEvent.end}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  Create Event
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GoogleCalendarIntegration