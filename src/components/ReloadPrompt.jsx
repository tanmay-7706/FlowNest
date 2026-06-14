import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSync } from 'react-icons/fa'

const ReloadPrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <AnimatePresence>
      {(offlineReady || needRefresh) && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-[9999] p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-indigo-100 dark:border-indigo-900/30 max-w-sm"
        >
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200">
              <FaSync className={needRefresh ? "animate-spin text-indigo-500" : "text-green-500"} />
              <span className="font-medium">
                {offlineReady
                  ? 'App ready to work offline'
                  : 'New content available, click on reload button to update.'}
              </span>
            </div>
            
            <div className="flex space-x-2">
              {needRefresh && (
                <button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => updateServiceWorker(true)}
                >
                  Reload
                </button>
              )}
              <button
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={() => close()}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ReloadPrompt
