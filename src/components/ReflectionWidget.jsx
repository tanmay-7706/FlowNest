import { useState, useEffect } from "react"
import { FaSave } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { db } from "../utils/firebase"
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
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write your thoughts..."
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 min-h-[80px] resize-none text-sm"
        />
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={saveReflection}
          className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center text-sm"
          disabled={!reflection.trim()}
        >
          <FaSave size={14} className="mr-2" />
          Save
        </button>
      </div>

      {savedReflections.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex-1 overflow-y-auto">
          <h4 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">Recent Reflections</h4>
          <div className="space-y-2">
            {savedReflections.slice(0, 2).map((item) => (
              <div key={item.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{formatDate(item.date)}</div>
                <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReflectionWidget
