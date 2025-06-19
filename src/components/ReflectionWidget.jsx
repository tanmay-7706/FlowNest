import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/utils/firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"

const ReflectionWidget = () => {
  const [reflection, setReflection] = useState("")
  const [savedReflections, setSavedReflections] = useState([])
  const { currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      const reflectionsRef = collection(db, "users", currentUser.uid, "reflections")
      const q = query(reflectionsRef, orderBy("date", "desc"))

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reflections = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate(), // Convert Firebase Timestamp to JavaScript Date
        }))
        setSavedReflections(reflections)
      })

      return () => unsubscribe() // Cleanup on unmount
    } else {
      setSavedReflections([]) // Clear reflections if no user
    }
  }, [currentUser])

  const saveReflection = async () => {
    if (!reflection.trim()) return

    if (currentUser) {
      try {
        const reflectionsRef = collection(db, "users", currentUser.uid, "reflections")
        await addDoc(reflectionsRef, {
          text: reflection,
          date: new Date(),
        })
        setReflection("") // Clear the input after saving
      } catch (error) {
        console.error("Error saving reflection:", error)
      }
    }
  }

  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      return "Invalid Date"
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <h2 className="text-xl font-semibold mb-4">Daily Reflection</h2>

      <div className="mb-4">
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write your thoughts..."
          className="input-field min-h-[120px] resize-none"
        />
      </div>

      <div className="flex justify-end mb-6">
        <button onClick={saveReflection} className="btn-primary flex items-center" disabled={!reflection.trim()}>
          <Save size={18} className="mr-2" />
          Save Reflection
        </button>
      </div>

      {savedReflections.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-lg font-medium mb-3">Previous Reflections</h3>
          <div className="space-y-3">
            {savedReflections.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">{formatDate(item.date)}</div>
                <p className="text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ReflectionWidget
