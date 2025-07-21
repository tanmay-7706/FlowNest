import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaGoogle,
  FaApple,
  FaGithub,
  FaTwitter,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from "firebase/auth"
import { auth } from "../utils/firebase"

const Auth = ({ isSignup = false }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Determining form type based on URL path or prop -->
  const [formType, setFormType] = useState(() => {
    if (location.pathname === "/signup") return "signup"
    if (location.pathname === "/login") return "login"
    return isSignup ? "signup" : "login"
  })

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { signup, login } = useAuth()

  // Updating form type when URL changes -->
  useEffect(() => {
    if (location.pathname === "/signup") {
      setFormType("signup")
    } else if (location.pathname === "/login") {
      setFormType("login")
    }
  }, [location.pathname])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (formType === "signup") {
        await signup(formData.email, formData.password, formData.name)
      } else {
        await login(formData.email, formData.password)
      }
      navigate("/")
    } catch (e) {
      setError(e.message)
    }

    setLoading(false)
  }

  const handleGoogleAuth = async () => {
    setError("")
    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      navigate("/")
    } catch (e) {
      setError(e.message)
    }

    setLoading(false)
  }

  const handleGithubAuth = async () => {
    setError("")
    setLoading(true)

    try {
      const provider = new GithubAuthProvider()
      await signInWithPopup(auth, provider)
      navigate("/")
    } catch (e) {
      setError(e.message)
    }

    setLoading(false)
  }

  const handleAppleAuth = () => {
    setError("Apple Sign-In coming soon!")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const toggleFormType = (type) => {
    setFormType(type)
    setError("")
    setFormData({
      name: "",
      email: "",
      password: "",
    })
    // Updating URL without causing a page reload -->
    navigate(type === "signup" ? "/signup" : "/login", { replace: true })
  }

  const features = [
    {
      icon: FaCheckCircle,
      title: "Smart Task Management",
      description: "Organize your tasks with intelligent prioritization and deadline tracking.",
    },
    {
      icon: FaCheckCircle,
      title: "Habit Building",
      description: "Build lasting habits with our scientifically-backed tracking system.",
    },
    {
      icon: FaCheckCircle,
      title: "Goal Achievement",
      description: "Set, track, and achieve your goals with detailed progress analytics.",
    },
    {
      icon: FaCheckCircle,
      title: "Productivity Insights",
      description: "Get personalized insights to optimize your daily productivity.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 transition-colors flex">
      {/* Left Panel - Brand Introduction */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-blue-600 to-purple-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border border-white rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl"
              >
                <FaTwitter size={28} />
              </motion.div>
              <span className="text-3xl font-bold">FlowNest</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Your Personal
              <br />
              <span className="text-yellow-300">Productivity Ecosystem</span>
            </h1>

            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Transform your daily routine with intelligent task management, habit tracking, and goal achievement tools
              designed for modern productivity.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <feature.icon className="h-5 w-5 text-green-300 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex space-x-8 mt-12 pt-8 border-t border-white/20"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">50K+</div>
                <div className="text-blue-100 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">1M+</div>
                <div className="text-blue-100 text-sm">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">4.9★</div>
                <div className="text-blue-100 text-sm">User Rating</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-gradient-to-br from-green-500 to-blue-600 text-white p-3 rounded-xl shadow-lg"
              >
                <FaTwitter size={24} />
              </motion.div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">FlowNest</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Your Personal Productivity Ecosystem</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {formType === "login" ? "Welcome Back!" : "Join FlowNest"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {formType === "login"
                  ? "Sign in to continue your productivity journey"
                  : "Start your journey to better productivity"}
              </p>
            </div>

            {/* Form Type Toggle */}
            <div className="flex rounded-xl bg-gray-100 dark:bg-gray-700 p-1 mb-8">
              <button
                onClick={() => toggleFormType("login")}
                className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  formType === "login"
                    ? "bg-white dark:bg-gray-600 shadow-md text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => toggleFormType("signup")}
                className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  formType === "signup"
                    ? "bg-white dark:bg-gray-600 shadow-md text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Social Auth Buttons */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 font-medium"
              >
                <FaGoogle className="h-5 w-5 text-red-500 mr-3" />
                Continue with Google
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGithubAuth}
                  disabled={loading}
                  className="flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 font-medium"
                >
                  <FaGithub className="h-5 w-5 mr-2" />
                  GitHub
                </button>
                <button
                  type="button"
                  onClick={handleAppleAuth}
                  disabled={loading}
                  className="flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 font-medium"
                >
                  <FaApple className="h-5 w-5 mr-2" />
                  Apple
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {formType === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      required={formType === "signup"}
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              {formType === "login" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
                >
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {formType === "login" ? "Sign In" : "Create Account"}
                    <FaArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formType === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => toggleFormType(formType === "login" ? "signup" : "login")}
                  className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors"
                >
                  {formType === "login" ? "Sign up here" : "Sign in here"}
                </button>
              </p>
            </div>

            {/* Terms */}
            {formType === "signup" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-green-600 dark:text-green-400 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-green-600 dark:text-green-400 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Auth
