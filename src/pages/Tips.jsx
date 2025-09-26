import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaLightbulb, FaSync, FaClock, FaBullseye, FaBrain, FaHeart, FaUsers, FaChartLine, FaBook } from "react-icons/fa"

const Tips = () => {
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const productivityTips = [
    {
      id: 1,
      title: "The Two-Minute Rule",
      description:
        "If a task takes less than two minutes to complete, do it immediately rather than adding it to your to-do list.",
      category: "time-management",
      icon: FaClock,
      color: "blue",
    },
    {
      id: 2,
      title: "Time Blocking",
      description:
        "Schedule specific blocks of time for different activities. This helps you stay focused and prevents tasks from expanding beyond their allocated time.",
      category: "time-management",
      icon: FaClock,
      color: "blue",
    },
    {
      id: 3,
      title: "The 80/20 Rule (Pareto Principle)",
      description:
        "Focus on the 20% of tasks that will give you 80% of the results. Identify your high-impact activities and prioritize them.",
      category: "productivity",
      icon: FaBullseye,
      color: "green",
    },
    {
      id: 4,
      title: "Single-Tasking",
      description:
        "Focus on one task at a time. Multitasking reduces efficiency and increases the likelihood of errors.",
      category: "focus",
      icon: FaBrain,
      color: "purple",
    },
    {
      id: 5,
      title: "The Pomodoro Technique",
      description: "Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break.",
      category: "focus",
      icon: FaBrain,
      color: "purple",
    },
    {
      id: 6,
      title: "Energy Management",
      description:
        "Schedule your most important tasks during your peak energy hours. Know when you're naturally most alert and productive.",
      category: "wellness",
      icon: FaHeart,
      color: "red",
    },
    {
      id: 7,
      title: "The Getting Things Done (GTD) Method",
      description:
        "Capture all tasks and ideas in a trusted system, clarify what they mean and what action is required, and organize them by context and priority.",
      category: "productivity",
      icon: FaBullseye,
      color: "green",
    },
    {
      id: 8,
      title: "Batch Similar Tasks",
      description:
        "Group similar tasks together and complete them in one session. This reduces context switching and improves efficiency.",
      category: "time-management",
      icon: FaClock,
      color: "blue",
    },
    {
      id: 9,
      title: "Digital Minimalism",
      description: "Reduce digital distractions by turning off non-essential notifications and using apps mindfully.",
      category: "focus",
      icon: FaBrain,
      color: "purple",
    },
    {
      id: 10,
      title: "Regular Breaks",
      description:
        "Take regular breaks to maintain focus and prevent burnout. Even short 2-3 minute breaks can help refresh your mind.",
      category: "wellness",
      icon: FaHeart,
      color: "red",
    },
    {
      id: 11,
      title: "Delegation and Teamwork",
      description:
        "Learn to delegate tasks effectively and collaborate with others. You don't have to do everything yourself.",
      category: "teamwork",
      icon: FaUsers,
      color: "indigo",
    },
    {
      id: 12,
      title: "Weekly Reviews",
      description: "Conduct weekly reviews to assess your progress, adjust your goals, and plan for the upcoming week.",
      category: "productivity",
      icon: FaChartLine,
      color: "green",
    },
    {
      id: 13,
      title: "Morning Routines",
      description:
        "Establish a consistent morning routine to start your day with intention and set a positive tone for productivity.",
      category: "wellness",
      icon: FaHeart,
      color: "red",
    },
    {
      id: 14,
      title: "Deep Work Sessions",
      description:
        "Schedule uninterrupted blocks of time for cognitively demanding tasks. Eliminate distractions and focus deeply.",
      category: "focus",
      icon: FaBrain,
      color: "purple",
    },
    {
      id: 15,
      title: "Goal Setting Framework",
      description:
        "Use SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) to create clear and actionable objectives.",
      category: "productivity",
      icon: FaBullseye,
      color: "green",
    },
    {
      id: 16,
      title: "Communication Boundaries",
      description: "Set clear communication boundaries with colleagues and family to protect your focused work time.",
      category: "teamwork",
      icon: FaUsers,
      color: "indigo",
    },
    {
      id: 17,
      title: "The Eisenhower Matrix",
      description:
        "Categorize tasks by urgency and importance. Focus on important but not urgent tasks to prevent crises.",
      category: "productivity",
      icon: FaBullseye,
      color: "green",
    },
    {
      id: 18,
      title: "Continuous Learning",
      description:
        "Dedicate time each day to learning new skills or improving existing ones. Knowledge compounds over time.",
      category: "learning",
      icon: FaBook,
      color: "orange",
    },
    {
      id: 19,
      title: "Environment Design",
      description:
        "Design your physical and digital environment to support your goals and minimize friction for good habits.",
      category: "wellness",
      icon: FaHeart,
      color: "red",
    },
    {
      id: 20,
      title: "Progress Tracking",
      description: "Regularly track your progress on goals and habits. What gets measured gets managed and improved.",
      category: "productivity",
      icon: FaChartLine,
      color: "green",
    },
  ]

  const categories = [
    { id: "all", name: "All Tips", count: productivityTips.length },
    {
      id: "time-management",
      name: "Time Management",
      count: productivityTips.filter((tip) => tip.category === "time-management").length,
    },
    {
      id: "productivity",
      name: "Productivity",
      count: productivityTips.filter((tip) => tip.category === "productivity").length,
    },
    { id: "focus", name: "Focus", count: productivityTips.filter((tip) => tip.category === "focus").length },
    { id: "wellness", name: "Wellness", count: productivityTips.filter((tip) => tip.category === "wellness").length },
    { id: "teamwork", name: "Teamwork", count: productivityTips.filter((tip) => tip.category === "teamwork").length },
    { id: "learning", name: "Learning", count: productivityTips.filter((tip) => tip.category === "learning").length },
  ]

  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const filteredTips =
        selectedCategory === "all"
          ? productivityTips
          : productivityTips.filter((tip) => tip.category === selectedCategory)

      setTips(filteredTips)
      setLoading(false)
    }, 500)
  }, [selectedCategory])

  const shuffleTips = () => {
    setLoading(true)
    setTimeout(() => {
      const shuffled = [...tips].sort(() => Math.random() - 0.5)
      setTips(shuffled)
      setLoading(false)
    }, 300)
  }

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-600 dark:text-blue-400",
        icon: "text-blue-500",
      },
      green: {
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-600 dark:text-green-400",
        icon: "text-green-500",
      },
      purple: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-purple-200 dark:border-purple-800",
        text: "text-purple-600 dark:text-purple-400",
        icon: "text-purple-500",
      },
      red: {
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800",
        text: "text-red-600 dark:text-red-400",
        icon: "text-red-500",
      },
      indigo: {
        bg: "bg-indigo-50 dark:bg-indigo-900/20",
        border: "border-indigo-200 dark:border-indigo-800",
        text: "text-indigo-600 dark:text-indigo-400",
        icon: "text-indigo-500",
      },
      orange: {
        bg: "bg-orange-50 dark:bg-orange-900/20",
        border: "border-orange-200 dark:border-orange-800",
        text: "text-orange-600 dark:text-orange-400",
        icon: "text-orange-500",
      },
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div className="flex items-center mb-4 lg:mb-0">
              <FaLightbulb className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Productivity Tips</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Discover proven techniques to boost your productivity
                </p>
              </div>
            </div>
            <button
              onClick={shuffleTips}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors duration-300"
            >
              <FaSync size={16} />
              <span>Shuffle Tips</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    selectedCategory === category.id
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Tips Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {tips.map((tip, index) => {
                const IconComponent = tip.icon
                const colorClasses = getColorClasses(tip.color)

                return (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 ${colorClasses.bg} ${colorClasses.border} hover:shadow-lg`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-full bg-white dark:bg-gray-800 ${colorClasses.icon} mr-3`}>
                        <IconComponent size={20} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{tip.title}</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{tip.description}</p>
                    <div className="mt-auto">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colorClasses.text} bg-white dark:bg-gray-800`}
                      >
                        {tip.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {tips.length === 0 && !loading && (
            <div className="text-center py-12">
              <FaLightbulb className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No tips found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try selecting a different category</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Tips
