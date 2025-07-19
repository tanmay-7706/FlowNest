import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaPlus, FaTrash } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { db } from "../utils/firebase"
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore"

const HabitTrackerWidget = () => {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState("")
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"]
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    const habitsCollectionRef = collection(db, "users", currentUser.uid, "habits")

    const unsubscribe = onSnapshot(
      habitsCollectionRef,
      (snapshot) => {
        const fetchedHabits = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setHabits(fetchedHabits)
        setLoading(false)
      },
      (error) => {
        setError(error.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [currentUser])

  const addHabit = async (e) => {
    e.preventDefault()
    if (!newHabit.trim() || !currentUser) return

    try {
      const habitsCollectionRef = collection(db, "users", currentUser.uid, "habits")
      await addDoc(habitsCollectionRef, {
        name: newHabit,
        days: Array(7).fill(false),
      })
      setNewHabit("")
    } catch (error) {
      setError(error.message)
    }
  }

  const toggleDay = async (habitId, dayIndex) => {
    if (!currentUser) return

    try {
      const habitDocRef = doc(db, "users", currentUser.uid, "habits", habitId)
      const updatedHabits = habits.map((habit) => {
        if (habit.id === habitId) {
          const updatedDays = [...habit.days]
          updatedDays[dayIndex] = !updatedDays[dayIndex]
          return { ...habit, days: updatedDays }
        }
        return habit
      })

      const habitToUpdate = updatedHabits.find((habit) => habit.id === habitId)
      if (habitToUpdate) {
        await updateDoc(habitDocRef, { days: habitToUpdate.days })
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const deleteHabit = async (habitId) => {
    if (!currentUser) return

    try {
      const habitDocRef = doc(db, "users", currentUser.uid, "habits", habitId)
      await deleteDoc(habitDocRef)
    } catch (error) {
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="card h-fit">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card h-fit">
        <h2 className="widget-title">Habit Tracker</h2>
        <div className="text-center py-6">
          <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card h-fit">
      <h2 className="widget-title">Habit Tracker</h2>

      <form onSubmit={addHabit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a new habit..."
          className="input-field flex-grow"
        />
        <button type="submit" className="btn-primary px-4 py-2">
          <FaPlus size={16} />
        </button>
      </form>

      {habits.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="flex items-center pb-3 border-b border-gray-200 dark:border-gray-700 mb-4">
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Habit</span>
              </div>
              {daysOfWeek.map((day, index) => (
                <div key={index} className="w-10 text-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{day}</span>
                </div>
              ))}
              <div className="w-10"></div>
            </div>

            <div className="space-y-3">
              {habits.map((habit) => (
                <div key={habit.id} className="flex items-center">
                  <div className="flex-1 pr-4 min-w-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate block">
                      {habit.name}
                    </span>
                  </div>
                  {habit.days.map((completed, dayIndex) => (
                    <div key={dayIndex} className="w-10 flex justify-center">
                      <button
                        onClick={() => toggleDay(habit.id, dayIndex)}
                        className={`w-8 h-8 rounded-full transition-colors ${
                          completed
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {completed ? "✓" : ""}
                      </button>
                    </div>
                  ))}
                  <div className="w-10 flex justify-center">
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No habits yet. Add one above!</p>
        </div>
      )}
    </motion.div>
  )
}

export default HabitTrackerWidget
