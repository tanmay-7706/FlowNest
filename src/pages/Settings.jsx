import { useState } from "react"
import { motion } from "framer-motion"
import { FaSave, FaSync, FaCog, FaPalette, FaBell, FaUser, FaShieldAlt } from "react-icons/fa"
import DarkModeToggle from "../components/DarkModeToggle"
import DataExport from "../components/DataExport"

const Settings = ({ widgets, updateWidgets }) => {
  const [localWidgets, setLocalWidgets] = useState({ ...widgets })
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reminders: true,
  })
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
  })

  const handleWidgetToggle = (widget) => {
    setLocalWidgets((prev) => ({
      ...prev,
      [widget]: !prev[widget],
    }))
  }

  const handleNotificationToggle = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const handleSaveSettings = () => {
    updateWidgets(localWidgets)
    // In a real app, we would also save other settings like notifications and pomodoro settings -->
    alert("Settings saved successfully!")
  }

  const handleResetSettings = () => {
    setLocalWidgets({
      todo: true,
      pomodoro: true,
      habit: true,
    })
    setNotifications({
      email: true,
      push: false,
      reminders: true,
    })
    setPomodoroSettings({
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
    })
  }

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">{label}</h3>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
      </label>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <FaCog className="h-8 w-8 text-green-600 dark:text-green-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">Theme:</span>
              <DarkModeToggle />
            </div>
          </div>

          <div className="space-y-6">
            {/* Widget Visibility */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <FaPalette className="h-5 w-5 text-blue-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Widget Visibility</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose which widgets to display on your dashboard.
              </p>

              <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-700">
                <ToggleSwitch
                  checked={localWidgets.todo}
                  onChange={() => handleWidgetToggle("todo")}
                  label="To-Do List"
                  description="Track your daily tasks and goals"
                />
                <ToggleSwitch
                  checked={localWidgets.pomodoro}
                  onChange={() => handleWidgetToggle("pomodoro")}
                  label="Pomodoro Timer"
                  description="Focus with timed work sessions"
                />
                <ToggleSwitch
                  checked={localWidgets.habit}
                  onChange={() => handleWidgetToggle("habit")}
                  label="Habit Tracker"
                  description="Build and maintain consistent habits"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <FaBell className="h-5 w-5 text-yellow-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Manage how you receive notifications and reminders.
              </p>

              <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-700">
                <ToggleSwitch
                  checked={notifications.email}
                  onChange={() => handleNotificationToggle("email")}
                  label="Email Notifications"
                  description="Receive updates and summaries via email"
                />
                <ToggleSwitch
                  checked={notifications.push}
                  onChange={() => handleNotificationToggle("push")}
                  label="Push Notifications"
                  description="Get instant notifications in your browser"
                />
                <ToggleSwitch
                  checked={notifications.reminders}
                  onChange={() => handleNotificationToggle("reminders")}
                  label="Task Reminders"
                  description="Receive reminders for upcoming tasks and deadlines"
                />
              </div>
            </div>

            {/* Pomodoro Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <FaCog className="h-5 w-5 text-red-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pomodoro Timer</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Customize your pomodoro timer durations (in minutes).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Work Duration
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={pomodoroSettings.workDuration}
                    onChange={(e) =>
                      setPomodoroSettings({
                        ...pomodoroSettings,
                        workDuration: Number.parseInt(e.target.value) || 25,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Short Break</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={pomodoroSettings.shortBreakDuration}
                    onChange={(e) =>
                      setPomodoroSettings({
                        ...pomodoroSettings,
                        shortBreakDuration: Number.parseInt(e.target.value) || 5,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Long Break</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={pomodoroSettings.longBreakDuration}
                    onChange={(e) =>
                      setPomodoroSettings({
                        ...pomodoroSettings,
                        longBreakDuration: Number.parseInt(e.target.value) || 15,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <FaUser className="h-5 w-5 text-purple-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your display name"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Zone</label>
                  <select className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+1 (Central European Time)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <FaShieldAlt className="h-5 w-5 text-green-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy & Security</h2>
              </div>
              <div className="space-y-1 divide-y divide-gray-100 dark:divide-gray-700">
                <ToggleSwitch
                  checked={true}
                  onChange={() => {}}
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                />
                <ToggleSwitch
                  checked={false}
                  onChange={() => {}}
                  label="Data Analytics"
                  description="Help improve FlowNest by sharing anonymous usage data"
                />
              </div>
            </div>

            {/* Data Export Section */}
            <DataExport />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
              <button
                onClick={handleResetSettings}
                className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                <FaSync size={18} className="mr-2" />
                Reset to Default
              </button>
              <button
                onClick={handleSaveSettings}
                className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center"
              >
                <FaSave size={18} className="mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings
