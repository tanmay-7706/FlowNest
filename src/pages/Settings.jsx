import { useState } from "react"
import { motion } from "framer-motion"
import { Save, RotateCcw } from "lucide-react"
import DataExport from "../components/DataExport"

const Settings = ({ widgets, updateWidgets }) => {
  const [localWidgets, setLocalWidgets] = useState({ ...widgets })
  const [theme, setTheme] = useState("light")
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

  const handleSaveSettings = () => {
    updateWidgets(localWidgets)
    // In a real app, we would also save other settings
    alert("Settings saved successfully!")
  }

  const handleResetSettings = () => {
    setLocalWidgets({
      todo: true,
      pomodoro: true,
      habit: true,
    })
    setTheme("light")
    setPomodoroSettings({
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <h1 className="text-3xl font-bold mb-8">Dashboard Settings</h1>

      <div className="space-y-8">
        {/* Widget Toggles */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Widget Visibility</h2>
          <p className="text-gray-600 mb-6">Choose which widgets to display on your dashboard.</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">To-Do List</h3>
                <p className="text-sm text-gray-500">Track your daily tasks</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localWidgets.todo}
                  onChange={() => handleWidgetToggle("todo")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Pomodoro Timer</h3>
                <p className="text-sm text-gray-500">Focus with timed work sessions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localWidgets.pomodoro}
                  onChange={() => handleWidgetToggle("pomodoro")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Habit Tracker</h3>
                <p className="text-sm text-gray-500">Build consistent habits</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localWidgets.habit}
                  onChange={() => handleWidgetToggle("habit")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Theme Settings</h2>
          <p className="text-gray-600 mb-6">Customize the appearance of your dashboard.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-4 border rounded-lg flex items-center ${
                    theme === "light" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-6 h-6 bg-white border border-gray-200 rounded-full mr-3"></div>
                  <span className="font-medium">Light Mode</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-4 border rounded-lg flex items-center ${
                    theme === "dark" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-6 h-6 bg-gray-800 border border-gray-700 rounded-full mr-3"></div>
                  <span className="font-medium">Dark Mode</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pomodoro Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Pomodoro Settings</h2>
          <p className="text-gray-600 mb-6">Customize your pomodoro timer durations (in minutes).</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Duration</label>
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
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Break</label>
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
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Long Break</label>
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
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Data Export Section */}
        <DataExport />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleResetSettings}
            className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw size={18} className="mr-2" />
            Reset to Default
          </button>
          <button onClick={handleSaveSettings} className="btn-primary flex items-center">
            <Save size={18} className="mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Settings
