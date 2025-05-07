import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Twitter } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-sm py-4 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-blue-500 text-white p-2 rounded">
            <Twitter size={20} />
          </div>
          <span className="text-xl font-bold">FlowNest</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`${isActive("/") ? "text-green-500 font-medium" : "text-gray-600 hover:text-green-500"}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`${isActive("/about") ? "text-green-500 font-medium" : "text-gray-600 hover:text-green-500"}`}
          >
            About
          </Link>
          <Link
            to="/services"
            className={`${isActive("/services") ? "text-green-500 font-medium" : "text-gray-600 hover:text-green-500"}`}
          >
            Services
          </Link>
          <Link
            to="/blog"
            className={`${isActive("/blog") ? "text-green-500 font-medium" : "text-gray-600 hover:text-green-500"}`}
          >
            Blog
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-green-500">
            Login
          </Link>
          <Link to="/signup" className="btn-primary">
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button -- Yeh GPT ki help se kara hai */}
        <button className="md:hidden text-gray-500 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden mt-4 py-2 px-4 space-y-3"
        >
          <Link to="/" className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md">
            Home
          </Link>
          <Link to="/about" className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md">
            About
          </Link>
          <Link to="/services" className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md">
            Services
          </Link>
          <Link to="/blog" className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md">
            Blog
          </Link>
          <div className="pt-2 border-t border-gray-200 flex flex-col space-y-2">
            <Link to="/login" className="block py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md">
              Login
            </Link>
            <Link to="/signup" className="btn-primary text-center">
              Sign Up
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar
