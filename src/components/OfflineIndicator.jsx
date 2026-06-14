import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { FaWifi } from "react-icons/fa"

/**
 * OfflineIndicator — shows a banner when the user loses internet connectivity.
 * Automatically hides when the connection is restored.
 */
export const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium shadow-md flex items-center justify-center space-x-2"
        >
          <FaWifi className="h-4 w-4 animate-pulse" />
          <span>
            You are offline. Changes will sync when you reconnect.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OfflineIndicator
