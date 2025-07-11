import { motion } from "framer-motion"
import { FaBullseye, FaBolt, FaHeart, FaUsers, FaStar, FaQuoteLeft, FaAward, FaRocket } from "react-icons/fa"

const About = () => {
  const teamMembers = [
    {
      name: "Steve Rogers",
      role: "Captain America",
      image: "https://cdn.britannica.com/30/182830-050-96F2ED76/Chris-Evans-title-character-Joe-Johnston-Captain.jpg",
      bio: "A super-soldier with a strong moral compass and unwavering dedication to justice.",
    },
    {
      name: "Tony Stark",
      role: "Iron Man",
      image: "https://cdn.britannica.com/49/182849-050-4C7FE34F/scene-Iron-Man.jpg",
      bio: "A genius billionaire inventor who suits up to protect the world with cutting-edge tech.",
    },
    {
      name: "Thor Odinson",
      role: "Thor",
      image: "https://images.alphacoders.com/124/1247503.jpeg",
      bio: "The God of Thunder, wielding Mjolnir and fighting for peace across realms.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      quote:
        "FlowNest has completely transformed how I manage my daily tasks. The intuitive design and powerful features make productivity feel effortless.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Freelance Designer",
      company: "Independent",
      quote:
        "As a freelancer, staying organized is crucial. FlowNest's habit tracking and goal setting features have helped me build better work routines.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      company: "StartupXYZ",
      quote:
        "The analytics dashboard gives me incredible insights into my productivity patterns. I can now optimize my workflow like never before.",
      rating: 5,
    },
  ]

  const achievements = [
    { icon: FaUsers, number: "50K+", label: "Active Users" },
    { icon: FaStar, number: "4.9", label: "App Store Rating" },
    { icon: FaRocket, number: "1M+", label: "Tasks Completed" },
    { icon: FaAward, number: "15+", label: "Awards Won" },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {/* Hero Section */}
          <section className="text-center mb-16">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              About <span className="text-green-600 dark:text-green-400">FlowNest</span>
            </motion.h1>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              We're on a mission to revolutionize personal productivity by creating tools that adapt to your unique
              workflow and help you achieve your goals with clarity and purpose.
            </motion.p>
          </section>

          {/* Achievements */}
          <section className="mb-16">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <achievement.icon className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{achievement.number}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{achievement.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Mission & Vision */}
          <section className="mb-16">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center"
            >
              Our Mission & Vision
            </motion.h2>

            <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-8">
              <motion.div
                variants={item}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 text-center"
              >
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaBullseye className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Mission</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  To empower individuals to take control of their time and achieve their goals through simple, effective
                  productivity tools that adapt to their unique needs and preferences.
                </p>
              </motion.div>

              <motion.div
                variants={item}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 text-center"
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaBolt className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Vision</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  A world where everyone has the tools and knowledge to work efficiently, reduce stress, and find
                  balance in their daily lives while pursuing meaningful goals.
                </p>
              </motion.div>

              <motion.div
                variants={item}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700 text-center"
              >
                <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaHeart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Values</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Simplicity, effectiveness, accessibility, and continuous improvement guide everything we do at
                  FlowNest. We believe in human-centered design and ethical technology.
                </p>
              </motion.div>
            </motion.div>
          </section>

          {/* Testimonials */}
          <section className="mb-16">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center"
            >
              What Our Users Say
            </motion.h2>

            <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-6 transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <FaQuoteLeft className="h-6 w-6 text-green-500 mb-4" />
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed italic">"{testimonial.quote}"</p>
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="h-4 w-4 text-yellow-400" />
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <div className="flex items-center justify-center mb-12">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full mr-3">
                <FaUsers className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Meet Our Team</h2>
            </div>

            <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-180 object-cover object-center"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                    <p className="text-green-600 dark:text-green-400 mb-3 font-medium">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-12 border border-green-200 dark:border-green-800">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Ready to Transform Your Productivity?
            </motion.h2>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Join thousands of users who have already discovered the power of organized, intentional living with
              FlowNest.
            </motion.p>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-lg">
                Get Started Free
              </button>
              <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-lg">
                Watch Demo
              </button>
            </motion.div>
          </section>
        </motion.div>
      </div>
    </div>
  )
}

export default About
