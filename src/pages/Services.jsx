import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaEdit, FaTrash, FaPlus, FaSave, FaTags, FaStar, FaClock, FaLightbulb } from "react-icons/fa"

const Services = () => {
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  })

  const [popularTags] = useState([
    { name: "Work", count: 12, color: "blue" },
    { name: "Personal", count: 8, color: "green" },
    { name: "Health", count: 5, color: "red" },
    { name: "Learning", count: 7, color: "purple" },
  ])

  useEffect(() => {
    const savedTasks = localStorage.getItem("detailedTasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks)
    localStorage.setItem("detailedTasks", JSON.stringify(updatedTasks))
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) return

    const task = {
      id: Date.now(),
      ...newTask,
      createdAt: new Date().toISOString(),
    }

    saveTasks([...tasks, task])
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    })
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
  }

  const handleUpdateTask = () => {
    if (!editingTask.title.trim()) return

    const updatedTasks = tasks.map((task) => (task.id === editingTask.id ? editingTask : task))

    saveTasks(updatedTasks)
    setEditingTask(null)
  }

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id)
    saveTasks(updatedTasks)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTagColor = (color) => {
    const colors = {
      blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
      green: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      red: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
      purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
    }
    return colors[color] || colors.blue
  }

  // Grouping tasks by priority -->
  const highPriorityTasks = tasks.filter((task) => task.priority === "high")
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium")
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Task Management</h1>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-8">
              {/* Add Task Form */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Task</h2>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Task Title
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Enter task description"
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 min-h-[100px] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center"
                    >
                      <FaPlus size={18} className="mr-2" />
                      Add Task
                    </button>
                  </div>
                </form>
              </div>

              {/* Task Priority Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* High Priority */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 border-t-4 border-t-red-500">
                  <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                      {highPriorityTasks.length}
                    </span>
                    High Priority
                  </h2>
                  <div className="space-y-3">
                    {highPriorityTasks.length > 0 ? (
                      highPriorityTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
                        >
                          <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                          {task.dueDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Due: {formatDate(task.dueDate)}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">No high priority tasks</p>
                    )}
                  </div>
                </div>

                {/* Medium Priority */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 border-t-4 border-t-yellow-500">
                  <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                      {mediumPriorityTasks.length}
                    </span>
                    Medium Priority
                  </h2>
                  <div className="space-y-3">
                    {mediumPriorityTasks.length > 0 ? (
                      mediumPriorityTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
                        >
                          <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                          {task.dueDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Due: {formatDate(task.dueDate)}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">No medium priority tasks</p>
                    )}
                  </div>
                </div>

                {/* Low Priority */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 border-t-4 border-t-green-500">
                  <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                      {lowPriorityTasks.length}
                    </span>
                    Low Priority
                  </h2>
                  <div className="space-y-3">
                    {lowPriorityTasks.length > 0 ? (
                      lowPriorityTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
                        >
                          <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                          {task.dueDate && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Due: {formatDate(task.dueDate)}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">No low priority tasks</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Task Detail Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">All Tasks</h2>

                {tasks.length > 0 ? (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task.id} className={`p-4 rounded-lg border ${getPriorityColor(task.priority)}`}>
                        {editingTask && editingTask.id === task.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editingTask.title}
                              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                            />
                            <textarea
                              value={editingTask.description}
                              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 min-h-[80px] resize-none"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <select
                                value={editingTask.priority}
                                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                              >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>
                              <input
                                type="date"
                                value={editingTask.dueDate}
                                onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={handleUpdateTask}
                                className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center"
                              >
                                <FaSave size={18} className="mr-2" />
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{task.title}</h3>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditTask(task)}
                                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                                >
                                  <FaEdit size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                >
                                  <FaTrash size={18} />
                                </button>
                              </div>
                            </div>
                            {task.description && (
                              <p className="mt-2 text-gray-700 dark:text-gray-300">{task.description}</p>
                            )}
                            <div className="mt-3 flex justify-between items-center text-sm">
                              <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                              </span>
                              {task.dueDate && (
                                <span className="text-gray-500 dark:text-gray-400">
                                  Due: {formatDate(task.dueDate)}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No tasks yet. Add one above!</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Popular Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FaTags className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Tags</h3>
                </div>
                <div className="space-y-2">
                  {popularTags.map((tag, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm ${getTagColor(tag.color)}`}>{tag.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{tag.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Tips */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FaStar className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Featured Tips</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Time Blocking</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      Schedule specific blocks of time for different activities.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Priority Matrix</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Focus on important and urgent tasks first.
                    </p>
                  </div>
                </div>
              </div>

              {/* Productivity Insights */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <FaLightbulb className="h-5 w-5 text-purple-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Productivity Insights</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-1">Peak Hours</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-400">
                      You're most productive between 9-11 AM.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">Weekly Goal</h4>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Complete 15 tasks this week (8/15 done).
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center mb-1">
                      <FaClock className="h-3 w-3 text-orange-600 dark:text-orange-400 mr-1" />
                      <h4 className="font-medium text-orange-800 dark:text-orange-300">Time Saved</h4>
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-400">
                      2.5 hours saved this week with better planning.
                    </p>
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

export default Services
