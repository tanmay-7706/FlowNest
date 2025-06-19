import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/utils/firebase"
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
      return // Don't proceed if no user
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

    return () => unsubscribe() // Cleanup on unmount
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
    return <div className="card">Loading habits...</div>
  }

  if (error) {
    return <div className="card">Error: {error}</div>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <h2 className="text-xl font-semibold mb-4">Habit Tracker</h2>

      <form onSubmit={addHabit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Add a new habit..."
          className="input-field flex-grow"
        />
        <button type="submit" className="btn-primary !py-2 !px-3">
          <Plus size={20} />
        </button>
      </form>

      {habits.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-2 font-medium text-gray-500">Habit</th>
                {daysOfWeek.map((day, index) => (
                  <th key={index} className="text-center pb-2 font-medium text-gray-500 w-10">
                    {day}
                  </th>
                ))}
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit.id} className="border-t border-gray-100">
                  <td className="py-3 pr-4">{habit.name}</td>
                  {habit.days.map((completed, dayIndex) => (
                    <td key={dayIndex} className="text-center">
                      <button
                        onClick={() => toggleDay(habit.id, dayIndex)}
                        className={`w-8 h-8 rounded-full ${
                          completed ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        {completed ? "✓" : ""}
                      </button>
                    </td>
                  ))}
                  <td>
                    <button onClick={() => deleteHabit(habit.id)} className="text-gray-400 hover:text-red-500 p-2">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No habits yet. Add one above!</p>
      )}
    </motion.div>
  )
}

export default HabitTrackerWidget
