import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "../utils/firebase"
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaFire,
  FaCheckCircle,
  FaBullseye,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaChartLine,
  FaTrophy,
} from "react-icons/fa"

const Profile = () => {
  const { currentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
  })
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalHabits: 0,
    totalGoals: 0,
    totalReflections: 0,
    streak: 7, // Mock streak data
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return

    // Initialize profile data
    setProfileData({
      displayName: currentUser.displayName || getUserDisplayName(),
      bio: "Productivity enthusiast focused on building better habits and achieving goals.",
      location: "New Delhi, India",
      website: "https://flow-nest.vercel.app",
    })

    // Fetch user statistics from Firebase
    const collections = ["todos", "habits", "goals", "reflections"]
    const unsubscribes = []

    collections.forEach((collectionName) => {
      const q = query(collection(db, collectionName), where("userId", "==", currentUser.uid))

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = []
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() })
        })

        setStats((prev) => {
          const newStats = { ...prev }

          if (collectionName === "todos") {
            newStats.totalTasks = data.length
            newStats.completedTasks = data.filter((item) => item.completed).length
          } else if (collectionName === "habits") {
            newStats.totalHabits = data.length
          } else if (collectionName === "goals") {
            newStats.totalGoals = data.length
          } else if (collectionName === "reflections") {
            newStats.totalReflections = data.length
          }

          return newStats
        })
      })

      unsubscribes.push(unsubscribe)
    })

    setLoading(false)

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [currentUser])

  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
    }
    if (currentUser?.email) {
      const emailName = currentUser.email.split("@")[0]
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }
    return "User"
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getJoinedDate = () => {
    // Use creation time if available, otherwise use a mock date
    if (currentUser?.metadata?.creationTime) {
      return new Date(currentUser.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
    return "June 15, 2025" // Mock date
  }

  const getCompletionRate = () => {
    if (stats.totalTasks === 0) return 0
    return Math.round((stats.completedTasks / stats.totalTasks) * 100)
  }

  const handleSaveProfile = () => {
    // In a real app, this would save to Firebase
    setIsEditing(false)
    // Mock save success
    console.log("Profile saved:", profileData)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    // Reset to original data if needed
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="rounded-full h-12 w-12 border-b-2 border-green-500"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <FaUser className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <FaEdit size={16} />
              <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {getInitials(profileData.displayName)}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-gray-100 dark:bg-gray-700 p-2 rounded-full shadow-md hover:shadow-lg transition-all">
                      <FaCamera className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>

                  {/* Basic Info */}
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{profileData.displayName}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center justify-center">
                    <FaEnvelope className="h-4 w-4 mr-2" />
                    {currentUser?.email}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
                    <FaCalendarAlt className="h-4 w-4 mr-2" />
                    Joined {getJoinedDate()}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaFire className="h-4 w-4 text-orange-500 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current Streak</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{stats.streak} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{getCompletionRate()}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaTrophy className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Goals</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{stats.totalGoals}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Details</h3>
                  {isEditing && (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                      >
                        <FaSave size={14} />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                      >
                        <FaTimes size={14} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.displayName}
                        onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.displayName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.location}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-[100px] resize-none"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profileData.bio}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Website</label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {profileData.website}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 text-center">
                  <FaCheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedTasks}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 text-center">
                  <FaBullseye className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGoals}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Goals</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 text-center">
                  <FaCalendarAlt className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalHabits}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Habits Tracked</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 text-center">
                  <FaChartLine className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReflections}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reflections</p>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Activity Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Achievements</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <FaTrophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-gray-600 dark:text-gray-400">Completed 10 tasks this week</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <FaFire className="h-4 w-4 text-orange-500" />
                        <span className="text-gray-600 dark:text-gray-400">7-day productivity streak</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <FaBullseye className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-400">Achieved 2 goals this month</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">This Week</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tasks completed</span>
                        <span className="font-medium text-gray-900 dark:text-white">8/12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Habits maintained</span>
                        <span className="font-medium text-gray-900 dark:text-white">5/7</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Focus time</span>
                        <span className="font-medium text-gray-900 dark:text-white">12.5 hrs</span>
                      </div>
                    </div>
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

export default Profile
