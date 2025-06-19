import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Edit2, Save, Target } from "lucide-react"
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../utils/firebase"
import { useAuth } from "../context/AuthContext"

const GoalTracker = () => {
  const { currentUser } = useAuth()
  const [goals, setGoals] = useState([])
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetValue: 100,
    currentValue: 0,
    type: "weekly", // weekly or monthly
    category: "personal",
  })
  const [editingGoal, setEditingGoal] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!currentUser) return

    const q = query(collection(db, "goals"), where("userId", "==", currentUser.uid))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const goalsData = []
      querySnapshot.forEach((doc) => {
        goalsData.push({ id: doc.id, ...doc.data() })
      })
      setGoals(goalsData)
    })

    return () => unsubscribe()
  }, [currentUser])

  const addGoal = async (e) => {
    e.preventDefault()
    if (!newGoal.title.trim()) return

    setLoading(true)
    try {
      await addDoc(collection(db, "goals"), {
        ...newGoal,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      })

      setNewGoal({
        title: "",
        description: "",
        targetValue: 100,
        currentValue: 0,
        type: "weekly",
        category: "personal",
      })
    } catch (error) {
      console.error("Error adding goal:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateGoal = async (goalId, updates) => {
    try {
      await updateDoc(doc(db, "goals", goalId), updates)
    } catch (error) {
      console.error("Error updating goal:", error)
    }
  }

  const deleteGoal = async (goalId) => {
    try {
      await deleteDoc(doc(db, "goals", goalId))
    } catch (error) {
      console.error("Error deleting goal:", error)
    }
  }

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100)
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-green-500"
    if (percentage >= 75) return "bg-blue-500"
    if (percentage >= 50) return "bg-yellow-500"
    return "bg-gray-300"
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <div className="flex items-center mb-4">
        <Target className="h-6 w-6 text-green-500 mr-2" />
        <h2 className="text-xl font-semibold">Goal Tracker</h2>
      </div>

      {/* Add Goal Form */}
      <form onSubmit={addGoal} className="mb-6 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            placeholder="Goal title..."
            className="input-field"
            required
          />
          <select
            value={newGoal.type}
            onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
            className="input-field"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <textarea
          value={newGoal.description}
          onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
          placeholder="Goal description..."
          className="input-field min-h-[80px]"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={newGoal.targetValue}
            onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number.parseInt(e.target.value) || 0 })}
            placeholder="Target value"
            className="input-field"
            min="1"
          />
          <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center">
            <Plus size={18} className="mr-2" />
            {loading ? "Adding..." : "Add Goal"}
          </button>
        </div>
      </form>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <div key={goal.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">{goal.title}</h3>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      goal.type === "weekly" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {goal.type}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => setEditingGoal(goal)} className="p-1 text-gray-500 hover:text-blue-500">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteGoal(goal.id)} className="p-1 text-gray-500 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>
                    {goal.currentValue} / {goal.targetValue}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(getProgressPercentage(goal.currentValue, goal.targetValue))}`}
                    style={{ width: `${getProgressPercentage(goal.currentValue, goal.targetValue)}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-600 mt-1">
                  {getProgressPercentage(goal.currentValue, goal.targetValue).toFixed(1)}%
                </div>
              </div>

              {/* Update Progress */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Update progress"
                  className="input-field flex-grow"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const value = Number.parseInt(e.target.value) || 0
                      updateGoal(goal.id, { currentValue: value })
                      e.target.value = ""
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector(`input[placeholder="Update progress"]`)
                    const value = Number.parseInt(input.value) || 0
                    updateGoal(goal.id, { currentValue: value })
                    input.value = ""
                  }}
                  className="btn-primary !py-2 !px-3"
                >
                  <Save size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No goals yet. Set your first goal above!</p>
        )}
      </div>
    </motion.div>
  )
}

export default GoalTracker
