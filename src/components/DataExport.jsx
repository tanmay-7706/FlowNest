import { useState } from "react"
import { motion } from "framer-motion"
import { Download, FileText } from "lucide-react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../utils/firebase"
import { useAuth } from "../context/AuthContext"

const DataExport = () => {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)

  const exportData = async () => {
    if (!currentUser) return

    setLoading(true)
    try {
      const collections = ["todos", "habits", "goals", "reflections"]
      const exportData = {
        exportDate: new Date().toISOString(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        data: {},
      }

      // Fetch data from each collection
      for (const collectionName of collections) {
        const q = query(collection(db, collectionName), where("userId", "==", currentUser.uid))

        const querySnapshot = await getDocs(q)
        const collectionData = []

        querySnapshot.forEach((doc) => {
          collectionData.push({ id: doc.id, ...doc.data() })
        })

        exportData.data[collectionName] = collectionData
      }

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `flownest-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("Failed to export data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center mb-4">
        <FileText className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Export</h2>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Export all your FlowNest data including tasks, habits, goals, and reflections as a JSON file.
      </p>

      <button
        onClick={exportData}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center justify-center w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={18} className="mr-2" />
        {loading ? "Exporting..." : "Export My Data"}
      </button>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> The exported file will contain all your personal data. Keep it secure and only share it
          if necessary.
        </p>
      </div>
    </motion.div>
  )
}

export default DataExport
