
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration for this project
const firebaseConfig = {
  apiKey: "AIzaSyDYDzh-EBSrzHXDHv1IWrIxrRD6HMNsrV8",
  authDomain: "student-productivity-6923e.firebaseapp.com",
  projectId: "student-productivity-6923e",
  storageBucket: "student-productivity-6923e.firebasestorage.app",
  messagingSenderId: "561944741556",
  appId: "1:561944741556:web:57c692a6ac31123ee639e1",
  measurementId: "G-22L5Y519SX",
};

// Initialize core Firebase services used in the app
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;