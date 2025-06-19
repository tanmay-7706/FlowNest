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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
      <div className="flex items-center mb-4">
        <FileText className="h-6 w-6 text-blue-500 mr-2" />
        <h2 className="text-xl font-semibold">Data Export</h2>
      </div>

      <p className="text-gray-600 mb-6">
        Export all your FlowNest data including tasks, habits, goals, and reflections as a JSON file.
      </p>

      <button onClick={exportData} disabled={loading} className="btn-primary flex items-center justify-center w-full">
        <Download size={18} className="mr-2" />
        {loading ? "Exporting..." : "Export My Data"}
      </button>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> The exported file will contain all your personal data. Keep it secure and only share it
          if necessary.
        </p>
      </div>
    </motion.div>
  )
}

export default DataExport
