import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit2, Trash2, Plus, Save } from "lucide-react"

const Services = () => {
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  })

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
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  // Group tasks by priority
  const highPriorityTasks = tasks.filter((task) => task.priority === "high")
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium")
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      <h1 className="text-3xl font-bold mb-8">Task Management</h1>

      {/* Add Task Form */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <form onSubmit={handleAddTask} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Enter task description"
              className="input-field min-h-[100px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="input-field"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary flex items-center">
              <Plus size={18} className="mr-2" />
              Add Task
            </button>
          </div>
        </form>
      </div>

      {/* Task Priority Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* High Priority */}
        <div className="card border-t-4 border-t-red-500">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              {highPriorityTasks.length}
            </span>
            High Priority
          </h2>
          <div className="space-y-3">
            {highPriorityTasks.length > 0 ? (
              highPriorityTasks.map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-medium">{task.title}</h3>
                  {task.dueDate && <p className="text-sm text-gray-500 mt-1">Due: {formatDate(task.dueDate)}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No high priority tasks</p>
            )}
          </div>
        </div>

        {/* Medium Priority */}
        <div className="card border-t-4 border-t-yellow-500">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              {mediumPriorityTasks.length}
            </span>
            Medium Priority
          </h2>
          <div className="space-y-3">
            {mediumPriorityTasks.length > 0 ? (
              mediumPriorityTasks.map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-medium">{task.title}</h3>
                  {task.dueDate && <p className="text-sm text-gray-500 mt-1">Due: {formatDate(task.dueDate)}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No medium priority tasks</p>
            )}
          </div>
        </div>

        {/* Low Priority */}
        <div className="card border-t-4 border-t-green-500">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              {lowPriorityTasks.length}
            </span>
            Low Priority
          </h2>
          <div className="space-y-3">
            {lowPriorityTasks.length > 0 ? (
              lowPriorityTasks.map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-medium">{task.title}</h3>
                  {task.dueDate && <p className="text-sm text-gray-500 mt-1">Due: {formatDate(task.dueDate)}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No low priority tasks</p>
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">All Tasks</h2>

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
                      className="input-field"
                    />
                    <textarea
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      className="input-field min-h-[80px]"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={editingTask.priority}
                        onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                        className="input-field"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      <input
                        type="date"
                        value={editingTask.dueDate}
                        onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button onClick={handleUpdateTask} className="btn-primary flex items-center">
                        <Save size={18} className="mr-2" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium">{task.title}</h3>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditTask(task)} className="p-1 text-gray-500 hover:text-blue-500">
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 text-gray-500 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    {task.description && <p className="mt-2 text-gray-700">{task.description}</p>}
                    <div className="mt-3 flex justify-between items-center text-sm">
                      <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </span>
                      {task.dueDate && <span className="text-gray-500">Due: {formatDate(task.dueDate)}</span>}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No tasks yet. Add one above!</p>
        )}
      </div>
    </motion.div>
  )
}

export default Services
