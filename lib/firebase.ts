import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project configuration
// You can get this from the Firebase Console -> Project Settings -> General -> Your apps -> SDK setup and configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA95f7_7F8osy9r3XEVZ19xdkn14GvB9vk",
  authDomain: "bonusthoughts-portal.firebaseapp.com",
  projectId: "bonusthoughts-portal",
  storageBucket: "bonusthoughts-portal.firebasestorage.app",
  messagingSenderId: "678698208052",
  appId: "1:678698208052:web:581d7d55727f38a2a7b361",
  measurementId: "G-G289J1M4T9"
};

// Initialize Firebase (Singleton pattern to avoid re-initialization errors in Next.js)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };