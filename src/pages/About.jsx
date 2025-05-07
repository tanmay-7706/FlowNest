"use client"

import { motion } from "framer-motion"
import { Target, Zap, Heart, Users } from "lucide-react"

const About = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Passionate about productivity and helping people achieve their goals.",
    },
    {
      name: "Sarah Williams",
      role: "Lead Designer",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Creates beautiful, intuitive interfaces that help users stay focused.",
    },
    {
      name: "Michael Chen",
      role: "Developer",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Builds robust, efficient systems that power the FlowNest experience.",
    },
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      {/* Mission & Vision */}
      <section className="mb-16">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Our Mission & Vision
        </motion.h1>

        <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-8">
          <motion.div variants={item} className="card text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Mission</h3>
            <p className="text-gray-600">
              To empower individuals to take control of their time and achieve their goals through simple, effective
              productivity tools.
            </p>
          </motion.div>

          <motion.div variants={item} className="card text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Vision</h3>
            <p className="text-gray-600">
              A world where everyone has the tools and knowledge to work efficiently, reduce stress, and find balance in
              their daily lives.
            </p>
          </motion.div>

          <motion.div variants={item} className="card text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Values</h3>
            <p className="text-gray-600">
              Simplicity, effectiveness, accessibility, and continuous improvement guide everything we do at FlowNest.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section>
        <div className="flex items-center justify-center mb-12">
          <div className="bg-gray-100 p-3 rounded-full mr-3">
            <Users className="h-6 w-6 text-gray-600" />
          </div>
          <h2 className="text-3xl font-bold">Our Team</h2>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div key={index} variants={item} className="card overflow-hidden">
              <img
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                className="w-full h-48 object-cover object-center rounded-t-xl"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-green-600 mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  )
}

export default About
