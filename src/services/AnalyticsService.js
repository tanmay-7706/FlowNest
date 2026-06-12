import { collection, query, where, getDocs, addDoc, orderBy, limit } from 'firebase/firestore'
import { db } from '../utils/firebase'

class AnalyticsService {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // Track user activity
  async trackActivity(userId, activityType, data = {}) {
    try {
      await addDoc(collection(db, 'analytics'), {
        userId,
        activityType,
        data,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString(),
      })
    } catch (error) {
      console.error('Error tracking activity:', error)
    }
  }

  // Get cached data or fetch from Firestore
  async getCachedData(key, fetchFunction) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    const data = await fetchFunction()
    this.cache.set(key, { data, timestamp: Date.now() })
    return data
  }

  // Get productivity score based on completed tasks and habits
  async getProductivityScore(userId, days = 7) {
    const cacheKey = `productivity-${userId}-${days}`
    
    return this.getCachedData(cacheKey, async () => {
      try {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(endDate.getDate() - days)

        // Get completed todos
        const todosQuery = query(
          collection(db, 'todos'),
          where('userId', '==', userId),
          where('completed', '==', true),
          where('updatedAt', '>=', startDate.toISOString())
        )
        const todosSnapshot = await getDocs(todosQuery)
        const completedTodos = todosSnapshot.size

        // Get habit completions
        const habitsQuery = query(
          collection(db, 'habits'),
          where('userId', '==', userId)
        )
        const habitsSnapshot = await getDocs(habitsQuery)
        let habitCompletions = 0
        
        habitsSnapshot.forEach(doc => {
          const habit = doc.data()
          const completions = habit.completions || []
          // Count completions in the date range
          for (let i = 0; i < days; i++) {
            const checkDate = new Date()
            checkDate.setDate(endDate.getDate() - i)
            if (completions.includes(checkDate.toDateString())) {
              habitCompletions++
            }
          }
        })

        // Calculate score (0-100)
        const totalPossibleHabits = habitsSnapshot.size * days
        const habitScore = totalPossibleHabits > 0 ? (habitCompletions / totalPossibleHabits) * 50 : 0
        const todoScore = Math.min(completedTodos * 5, 50) // Max 50 points for todos
        
        return Math.round(habitScore + todoScore)
      } catch (error) {
        console.error('Error calculating productivity score:', error)
        return 0
      }
    })
  }

  // Get activity trends
  async getActivityTrends(userId, days = 30) {
    const cacheKey = `trends-${userId}-${days}`
    
    return this.getCachedData(cacheKey, async () => {
      try {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(endDate.getDate() - days)

        const analyticsQuery = query(
          collection(db, 'analytics'),
          where('userId', '==', userId),
          where('timestamp', '>=', startDate.toISOString()),
          orderBy('timestamp', 'desc')
        )
        
        const snapshot = await getDocs(analyticsQuery)
        const activities = []
        
        snapshot.forEach(doc => {
          activities.push({ id: doc.id, ...doc.data() })
        })

        // Group by date and activity type
        const trends = {}
        activities.forEach(activity => {
          const date = activity.date
          if (!trends[date]) {
            trends[date] = {}
          }
          if (!trends[date][activity.activityType]) {
            trends[date][activity.activityType] = 0
          }
          trends[date][activity.activityType]++
        })

        return trends
      } catch (error) {
        console.error('Error getting activity trends:', error)
        return {}
      }
    })
  }

  // Get focus time data
  async getFocusTimeData(userId, days = 7) {
    const cacheKey = `focus-${userId}-${days}`
    
    return this.getCachedData(cacheKey, async () => {
      try {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(endDate.getDate() - days)

        const focusQuery = query(
          collection(db, 'analytics'),
          where('userId', '==', userId),
          where('activityType', '==', 'pomodoro_completed'),
          where('timestamp', '>=', startDate.toISOString())
        )
        
        const snapshot = await getDocs(focusQuery)
        let totalMinutes = 0
        const dailyFocus = {}
        
        snapshot.forEach(doc => {
          const data = doc.data()
          const date = data.date
          const minutes = data.data?.duration || 25 // Default pomodoro duration
          
          totalMinutes += minutes
          if (!dailyFocus[date]) {
            dailyFocus[date] = 0
          }
          dailyFocus[date] += minutes
        })

        return {
          totalMinutes,
          averageDaily: Math.round(totalMinutes / days),
          dailyBreakdown: dailyFocus,
          sessions: snapshot.size
        }
      } catch (error) {
        console.error('Error getting focus time data:', error)
        return { totalMinutes: 0, averageDaily: 0, dailyBreakdown: {}, sessions: 0 }
      }
    })
  }

  // Get goal completion rate
  async getGoalCompletionRate(userId, days = 30) {
    const cacheKey = `goals-${userId}-${days}`
    
    return this.getCachedData(cacheKey, async () => {
      try {
        const goalsQuery = query(
          collection(db, 'goals'),
          where('userId', '==', userId)
        )
        
        const snapshot = await getDocs(goalsQuery)
        let totalGoals = 0
        let completedGoals = 0
        
        snapshot.forEach(doc => {
          const goal = doc.data()
          totalGoals++
          if (goal.completed) {
            completedGoals++
          }
        })

        return {
          total: totalGoals,
          completed: completedGoals,
          rate: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0
        }
      } catch (error) {
        console.error('Error getting goal completion rate:', error)
        return { total: 0, completed: 0, rate: 0 }
      }
    })
  }

  // Get weekly summary
  async getWeeklySummary(userId) {
    try {
      const [productivityScore, focusData, goalData, trends] = await Promise.all([
        this.getProductivityScore(userId, 7),
        this.getFocusTimeData(userId, 7),
        this.getGoalCompletionRate(userId, 7),
        this.getActivityTrends(userId, 7)
      ])

      return {
        productivityScore,
        focusTime: focusData,
        goals: goalData,
        trends,
        generatedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error generating weekly summary:', error)
      return null
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }

  // Get insights and recommendations
  getInsights(weeklyData) {
    const insights = []
    
    if (weeklyData.productivityScore < 30) {
      insights.push({
        type: 'warning',
        title: 'Low Productivity Score',
        message: 'Your productivity score is below average. Try setting smaller, achievable goals.',
        action: 'Set 2-3 small tasks for tomorrow'
      })
    } else if (weeklyData.productivityScore > 80) {
      insights.push({
        type: 'success',
        title: 'Excellent Productivity!',
        message: 'You\'re crushing your goals! Keep up the great work.',
        action: 'Consider setting more challenging goals'
      })
    }

    if (weeklyData.focusTime.averageDaily < 60) {
      insights.push({
        type: 'info',
        title: 'Increase Focus Time',
        message: 'Try to increase your daily focus time with more Pomodoro sessions.',
        action: 'Aim for at least 2 Pomodoro sessions daily'
      })
    }

    if (weeklyData.goals.rate < 50) {
      insights.push({
        type: 'warning',
        title: 'Goal Completion Rate Low',
        message: 'You\'re completing less than half of your goals. Consider setting more realistic targets.',
        action: 'Review and adjust your current goals'
      })
    }

    return insights
  }
}

export default new AnalyticsService()