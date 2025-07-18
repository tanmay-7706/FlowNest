import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaSlack,
  FaInstagram,
  FaDribbble,
  FaYoutube,
  FaDiscord,
  FaLink,
  FaComments,
  FaEnvelope,
  FaBalanceScale,
  FaRocket,
  FaHeart,
} from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 mt-auto pt-16 pb-8 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and About */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                <FaTwitter size={20} />
              </motion.div>
              <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                FlowNest
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 leading-relaxed mb-6">
              The personal productivity ecosystem designed to help you build better habits and achieve your goals with
              intelligent insights and seamless workflow management.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <FaEnvelope size={14} />
              <span>contact@flownest.io</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <FaRocket size={14} />
              <span>Building the future of productivity</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center mb-6">
              <FaLink className="h-4 w-4 text-blue-500 mr-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Quick Links
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/services", label: "Task Tools" },
                { to: "/blog", label: "Reflections" },
                { to: "/tips", label: "Tips" },
                { to: "/analytics", label: "Analytics" },
                { to: "/calendar", label: "Calendar" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="flex items-center mb-6">
              <FaBalanceScale className="h-4 w-4 text-purple-500 mr-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">Legal</h3>
            </div>
            <ul className="space-y-3">
              {[
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Service" },
                { to: "/contact", label: "Contact" },
                { to: "/support", label: "Support" },
                { to: "/cookies", label: "Cookie Policy" },
                { to: "/security", label: "Security" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 text-sm transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <div className="flex items-center mb-6">
              <FaComments className="h-4 w-4 text-purple-500 mr-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">Connect</h3>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { icon: FaGithub, href: "#", title: "GitHub", color: "hover:text-gray-700 dark:hover:text-gray-200" },
                {
                  icon: FaLinkedin,
                  href: "#",
                  title: "LinkedIn",
                  color: "hover:text-blue-600 dark:hover:text-blue-400",
                },
                { icon: FaTwitter, href: "#", title: "Twitter", color: "hover:text-blue-500 dark:hover:text-blue-400" },
                { icon: FaSlack, href: "#", title: "Slack", color: "hover:text-purple-600 dark:hover:text-purple-400" },
                {
                  icon: FaInstagram,
                  href: "#",
                  title: "Instagram",
                  color: "hover:text-pink-600 dark:hover:text-pink-400",
                },
                {
                  icon: FaDribbble,
                  href: "#",
                  title: "Dribbble",
                  color: "hover:text-pink-500 dark:hover:text-pink-400",
                },
                { icon: FaYoutube, href: "#", title: "YouTube", color: "hover:text-red-600 dark:hover:text-red-400" },
                {
                  icon: FaDiscord,
                  href: "#",
                  title: "Discord",
                  color: "hover:text-indigo-600 dark:hover:text-indigo-400",
                },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-gray-500 dark:text-gray-400 ${social.color} transition-all duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center`}
                  title={social.title}
                >
                  <social.icon size={20} />
                  <span className="sr-only">{social.title}</span>
                </motion.a>
              ))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">Join our community of productive individuals</p>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <FaHeart className="text-red-500 animate-pulse" size={12} />
                <span>for productivity enthusiasts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Stay Productive</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get weekly productivity tips and updates delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
              />
              <button className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-8 transition-colors duration-300">
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 mb-4 md:mb-0">
            © 2025 FlowNest. All rights reserved. Empowering productivity worldwide.
          </p>
          <div className="flex space-x-6">
            {[
              { to: "/privacy", label: "Privacy" },
              { to: "/terms", label: "Terms" },
              { to: "/contact", label: "Contact" },
              { to: "/support", label: "Support" },
              { to: "/sitemap", label: "Sitemap" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
