import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtOWhu1o-TjFj9DiGMWxR4ZuAwzLvTptg",
  authDomain: "flownest-476.firebaseapp.com",
  projectId: "flownest-476",
  storageBucket: "flownest-476.firebasestorage.app",
  messagingSenderId: "227680483834",
  appId: "1:227680483834:web:9bce42ed5a0df7b08a4c43",
  measurementId: "G-2GF1P0Z52K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app
