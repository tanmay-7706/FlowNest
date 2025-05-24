import { Link } from "react-router-dom"
import { Twitter, Github, Linkedin, Slack } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-white mt-auto pt-8 pb-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Logo and About */}
          <div className="md:col-span-1">
          <Link to="/" className="flex items-center space-x-2">
          <div className="bg-blue-500 text-white p-2 rounded">
            <Twitter size={20} />
          </div>
          <span className="text-xl font-bold">FlowNest</span>
          </Link>
            <p className="mt-4 text-sm text-gray-600">
              The personal productivity ecosystem designed to help you build better habits <br /> and achieve your goals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links 🔗</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary text-sm">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary text-sm">About</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-primary text-sm">Services</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-primary text-sm">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary text-sm">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary text-sm">Terms of Service</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary text-sm">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect 💬</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Slack size={20} />
                <span className="sr-only">Slack</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
          </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">© 2025 FlowNest. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">

            <Link to="/privacy" className="text-xs text-gray-600 hover:text-primary">Privacy</Link>
            <Link to="/terms" className="text-xs text-gray-600 hover:text-primary">Terms</Link>
            <Link to="/contact" className="text-xs text-gray-600 hover:text-primary">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
