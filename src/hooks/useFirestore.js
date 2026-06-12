import { useState, useEffect, useMemo } from 'react'
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'

/**
 * Strips any keys with undefined values and trims string fields.
 * Prevents accidental writes of undefined to Firestore.
 */
const sanitizeData = (data) => {
  if (typeof data !== "object" || data === null) return data;
  return Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim().slice(0, 5000) : value,
      ])
  );
};

// Generic Firestore hook
export const useFirestore = (collectionName, queryConstraints = []) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Stabilize queryConstraints to avoid re-renders from new array identity
  const constraintsKey = JSON.stringify(queryConstraints)
  const stableConstraints = useMemo(() => queryConstraints, [constraintsKey])

  useEffect(() => {
    try {
      const q = query(collection(db, collectionName), ...stableConstraints)
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = []
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() })
        })
        setData(items)
        setLoading(false)
        setError(null)
      }, (err) => {
        setError(err.message)
        setLoading(false)
      })

      return unsubscribe
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }, [collectionName, stableConstraints])

  return { data, loading, error }
}

// Todos hook
export const useTodos = () => {
  const { currentUser } = useAuth()
  const { data: todos, loading, error } = useFirestore('todos', 
    currentUser ? [where('userId', '==', currentUser.uid)] : []
  )

  const addTodo = async (todoData) => {
    if (!currentUser) throw new Error('User not authenticated')
    
    return await addDoc(collection(db, 'todos'), sanitizeData({
      ...todoData,
      userId: currentUser.uid,
      createdAt: new Date().toISOString(),
    }))
  }

  const updateTodo = async (id, updates) => {
    return await updateDoc(doc(db, 'todos', id), sanitizeData({
      ...updates,
      updatedAt: new Date().toISOString(),
    }))
  }

  const deleteTodo = async (id) => {
    return await deleteDoc(doc(db, 'todos', id))
  }

  return {
    todos: todos.sort((a, b) => (a.order || 0) - (b.order || 0)),
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
  }
}

// Habits hook
export const useHabits = () => {
  const { currentUser } = useAuth()
  const { data: habits, loading, error } = useFirestore('habits',
    currentUser ? [where('userId', '==', currentUser.uid)] : []
  )

  const addHabit = async (habitData) => {
    if (!currentUser) throw new Error('User not authenticated')
    
    return await addDoc(collection(db, 'habits'), sanitizeData({
      ...habitData,
      userId: currentUser.uid,
      createdAt: new Date().toISOString(),
      streak: 0,
      completions: [],
    }))
  }

  const updateHabit = async (id, updates) => {
    return await updateDoc(doc(db, 'habits', id), sanitizeData({
      ...updates,
      updatedAt: new Date().toISOString(),
    }))
  }

  const deleteHabit = async (id) => {
    return await deleteDoc(doc(db, 'habits', id))
  }

  const toggleHabitCompletion = async (id, date = new Date().toDateString()) => {
    const habit = habits.find(h => h.id === id)
    if (!habit) return

    const completions = habit.completions || []
    const isCompleted = completions.includes(date)
    
    const updatedCompletions = isCompleted
      ? completions.filter(d => d !== date)
      : [...completions, date]

    // Calculate streak
    const today = new Date()
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toDateString()
      
      if (updatedCompletions.includes(dateStr)) {
        streak++
      } else {
        break
      }
    }

    return await updateHabit(id, {
      completions: updatedCompletions,
      streak,
    })
  }

  return {
    habits,
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
  }
}

// Local storage hook
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}