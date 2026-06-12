import { createContext, useContext, useState, useEffect } from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../utils/firebase"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const clearError = () => setError(null)

  const signup = async (email, password, displayName) => {
    try {
      setError(null)
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(user, { displayName })
      }
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: displayName || '',
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'system',
          notifications: true,
        }
      })
      
      return user
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const logout = async () => {
    try {
      setError(null)
      return await signOut(auth)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const resetPassword = async (email) => {
    try {
      setError(null)
      return await sendPasswordResetEmail(auth, email)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const updateUserProfile = async (updates) => {
    try {
      setError(null)
      if (currentUser) {
        await updateProfile(currentUser, updates)
        // Update Firestore document
        await setDoc(doc(db, "users", currentUser.uid), updates, { merge: true })
      }
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set the basic user object immediately to unblock the UI
        setCurrentUser(user)
        setLoading(false)
        
        // Fetch additional user data asynchronously
        getDoc(doc(db, "users", user.uid))
          .then((userDoc) => {
            if (userDoc.exists()) {
              setCurrentUser((prevUser) => ({ ...prevUser, ...userDoc.data() }))
            }
          })
          .catch((error) => {
            console.error('Error fetching user data:', error)
          })
      } else {
        setCurrentUser(null)
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    loading,
    error,
    clearError,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}