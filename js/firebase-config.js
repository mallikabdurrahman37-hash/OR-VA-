// =========================================================
// ORÈVA — Firebase + Cloudinary configuration
// Exact values from the master specification. Do not change
// the project/preset without updating this file everywhere.
// =========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCa7OTJEyx4v90upw8xc9Y3aXWETfIMFts",
  authDomain: "eddy-s-portfolio.firebaseapp.com",
  projectId: "eddy-s-portfolio",
  storageBucket: "eddy-s-portfolio.firebasestorage.app",
  messagingSenderId: "363833751972",
  appId: "1:363833751972:web:c87f12a3446ffff5d42931",
  measurementId: "G-Q2E87TYZDW",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dyt6fwvw0/image/upload";
export const CLOUDINARY_UPLOAD_PRESET = "Wb_mobile_products";

export {
  onAuthStateChanged,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  onSnapshot,
};
