import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUsers, FaRobot, FaClipboardList, FaSpinner, FaDownload, FaCopy } from 'react-icons/fa'
import OpenRouterService from '../services/OpenRouterService'
import { useAuth } from '../context/AuthContext'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../utils/firebase'

const AIMeetingAnalyzer = () => {
  const { currentUser } = useAuth()
  const [meetingNotes, setMeetingNotes] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const analyzeMeeting = async () => {
    if (!meetingNotes.trim()) return

    setIsAnalyzing(true)
    try {
      const result = await OpenRouterService.analyzeMeetingNotes(meetingNotes)
      setAnalysis(result)
      setShowAnalysis(true)
    } catch (error) {
      console.error('Meeting analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const createActionItems = async () => {
    if (!analysis?.actionItems || !currentUser) return

    try {
      const promises = analysis.actionItems.map(item => 
        addDoc(collection(db, 'todos'), {
          text: typeof item === 'string' ? item : item.task || item.description,
          completed: false,
          priority: item.priority || 'medium',
          userId: currentUser.uid,
          createdAt: new Date().toISOString(),
          aiGenerated: true,
          meetingRelated: true,
          dueDate: item.dueDate || null
        })
      )
      
      await Promise.all(promises)
    } catch (error) {
      console.error('Failed to create action items:', error)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const exportAnalysis = () => {
    const exportData = {
      meetingDate: new Date().toISOString(),
      originalNotes: meetingNotes,
      analysis: analysis
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meeting-analysis-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <FaUsers className="h-5 w-5 text-indigo-500 mr-2" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Meeting Analyzer</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Extract insights from meetings</p>
        </div>
        <FaRobot className="h-4 w-4 text-purple-500 ml-auto" />
      </div>

      <div className="space-y-4">
        <div>
          <textarea
            value={meetingNotes}
            onChange={(e) => setMeetingNotes(e.target.value)}
            placeholder="Paste your meeting notes here... AI will extract action items, key decisions, and next steps."
            className="w-full h-32 input-field text-sm resize-none"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={analyzeMeeting}
            disabled={isAnalyzing || !meetingNotes.trim()}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <FaRobot className="mr-2" />
                Analyze Meeting
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showAnalysis && analysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Meeting Analysis</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={createActionItems}
                    className="btn-secondary text-sm px-3 py-1"
                  >
                    <FaClipboardList className="mr-1" />
                    Create Tasks
                  </button>
                  <button
                    onClick={exportAnalysis}
                    className="btn-secondary text-sm px-3 py-1"
                  >
                    <FaDownload className="mr-1" />
                    Export
                  </button>
                </div>
              </div>

              {/* Summary */}
              {analysis.summary && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Summary</h5>
                    <button
                      onClick={() => copyToClipboard(analysis.summary)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <FaCopy />
                    </button>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.summary}</p>
                  </div>
                </div>
              )}

              {/* Action Items */}
              {analysis.actionItems && analysis.actionItems.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Action Items</h5>
                  <div className="space-y-2">
                    {analysis.actionItems.map((item, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                        <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {typeof item === 'string' ? item : item.task || item.description}
                          </p>
                          {item.assignee && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Assigned to: {item.assignee}
                            </p>
                          )}
                          {item.dueDate && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Due: {item.dueDate}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              {analysis.nextSteps && analysis.nextSteps.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next Steps</h5>
                  <div className="space-y-1">
                    {analysis.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AIMeetingAnalyzer