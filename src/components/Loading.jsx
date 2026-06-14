

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-green-500 ${sizeClasses[size]} ${className}`} />
  )
}

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  </div>
)

const LoadingScreen = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <LoadingSpinner size="lg" className="mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400 text-lg">{message}</p>
    </motion.div>
  </div>
)

const WidgetSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-64">
    <div className="animate-pulse">
      <div className="flex items-center mb-4">
        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  </div>
)

export { LoadingSpinner, SkeletonCard, LoadingScreen, WidgetSkeleton }