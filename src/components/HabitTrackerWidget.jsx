import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2 } from "lucide-react"

const HabitTrackerWidget = () => {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState("")
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"]

  useEffect(() => {
    const savedHabits = localStorage.getItem("habits")
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    }
  }, [])

  const saveHabits = (updatedHabits) => {
    setHabits(updatedHabits)
    localStorage.setItem("habits", JSON.stringify(updatedHabits))
  }

  const addHabit = (e) => {
    e.preventDefault()
    if (!newHabit.trim()) return

    const habit = {
      id: Date.now(),
      name: newHabit,
      days: Array(7).fill(false),
    }

    saveHabits([...habits, habit])
    setNewHabit("")
  }

  const toggleDay = (habitId, dayIndex) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const updatedDays = [...habit.days]
        updatedDays[dayIndex] = !updatedDays[dayIndex]
        return { ...habit, days: updatedDays }
      }
      return habit
    })

    saveHabits(updatedHabits)
  }

  const deleteHabit = (habitId) => {
    const updatedHabits = habits.filter((habit) => habit.id !== habitId)
    saveHabits(updatedHabits)
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
        <p className="text-gray-500 text-center py-4">No habits yet.<br/>Add one above!</p>
      )}
    </motion.div>
  )
}

export default HabitTrackerWidget
