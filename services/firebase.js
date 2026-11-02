import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

// Firebase configuration for project: mood-meals-bf07a
// https://console.firebase.google.com/project/mood-meals-bf07a/
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyB9DxT25GBN0bJqvfg4h61LbxCxSDIq-ps",
  authDomain: "mood-meals-bf07a.firebaseapp.com",
  projectId: "mood-meals-bf07a",
  storageBucket: "mood-meals-bf07a.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "102873111000",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:102873111000:web:moodmeals"
};

let app;
let auth;
let db;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('[Firebase] Initialization warning (API Key needs to be configured):', error.message);
}

export { app, auth, db };

/**
 * Register a new user in Firebase Auth and create their Firestore profile
 */
export async function registerWithFirebase(email, password) {
  if (!auth) throw new Error('Firebase is not initialized. Please set your apiKey in services/firebase.js');
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Initialize user profile in Firestore
  if (db) {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: email.split('@')[0],
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        settings: {
          darkMode: false,
          waterReminderFreq: 'Every 30m',
          reminderActive: true
        }
      }, { merge: true });
    } catch (e) {
      console.warn('[Firestore] Error creating user document:', e);
    }
  }

  return user;
}

/**
 * Log in an existing user with Firebase Auth
 */
export async function loginWithFirebase(email, password) {
  if (!auth) throw new Error('Firebase is not initialized. Please set your apiKey in services/firebase.js');
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update last login timestamp in Firestore
  if (db) {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        lastLoginAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn('[Firestore] Error updating lastLoginAt:', e);
    }
  }

  return user;
}

/**
 * Log out from Firebase Auth
 */
export async function logoutFromFirebase() {
  if (!auth) return;
  await signOut(auth);
}

/**
 * Subscribe to Firebase Auth state changes
 */
export function subscribeToAuth(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Save a new mood detection entry to Firestore
 */
export async function saveMoodToFirestore(userId, moodData) {
  if (!db || !userId) return;
  try {
    const moodsRef = collection(db, 'users', userId, 'mood_history');
    await addDoc(moodsRef, {
      ...moodData,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error('[Firestore] Error saving mood:', e);
  }
}

/**
 * Real-time listener for mood history
 */
export function listenToMoodHistory(userId, callback) {
  if (!db || !userId) return () => {};
  try {
    const moodsRef = collection(db, 'users', userId, 'mood_history');
    const q = query(moodsRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const logs = [];
      snapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      callback(logs);
    }, (err) => {
      console.warn('[Firestore] Mood history listener error:', err.message);
    });
  } catch (e) {
    console.warn('[Firestore] Error setting up mood listener:', e);
    return () => {};
  }
}

/**
 * Save / Update Water Intake & Reminders in Firestore
 */
export async function saveWaterToFirestore(userId, waterData) {
  if (!db || !userId) return;
  try {
    const waterRef = doc(db, 'users', userId, 'data', 'water');
    await setDoc(waterRef, {
      ...waterData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.error('[Firestore] Error saving water data:', e);
  }
}

/**
 * Real-time listener for Water Intake & Reminders
 */
export function listenToWater(userId, callback) {
  if (!db || !userId) return () => {};
  try {
    const waterRef = doc(db, 'users', userId, 'data', 'water');
    return onSnapshot(waterRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      }
    }, (err) => {
      console.warn('[Firestore] Water listener error:', err.message);
    });
  } catch (e) {
    console.warn('[Firestore] Error setting up water listener:', e);
    return () => {};
  }
}

/**
 * Save Favorite Foods list in Firestore
 */
export async function saveFavoritesToFirestore(userId, favoritesList) {
  if (!db || !userId) return;
  try {
    const favRef = doc(db, 'users', userId, 'data', 'favorites');
    await setDoc(favRef, {
      favorites: favoritesList,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.error('[Firestore] Error saving favorites:', e);
  }
}

/**
 * Real-time listener for Favorite Foods
 */
export function listenToFavorites(userId, callback) {
  if (!db || !userId) return () => {};
  try {
    const favRef = doc(db, 'users', userId, 'data', 'favorites');
    return onSnapshot(favRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().favorites) {
        callback(docSnap.data().favorites);
      }
    }, (err) => {
      console.warn('[Firestore] Favorites listener error:', err.message);
    });
  } catch (e) {
    console.warn('[Firestore] Error setting up favorites listener:', e);
    return () => {};
  }
}

/**
 * Save User Preferences & Settings (Theme, etc.) in Firestore
 */
export async function saveSettingsToFirestore(userId, settingsData) {
  if (!db || !userId) return;
  try {
    const settingsRef = doc(db, 'users', userId, 'data', 'settings');
    await setDoc(settingsRef, {
      ...settingsData,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.error('[Firestore] Error saving settings:', e);
  }
}

/**
 * Real-time listener for User Preferences & Settings
 */
export function listenToSettings(userId, callback) {
  if (!db || !userId) return () => {};
  try {
    const settingsRef = doc(db, 'users', userId, 'data', 'settings');
    return onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      }
    }, (err) => {
      console.warn('[Firestore] Settings listener error:', err.message);
    });
  } catch (e) {
    console.warn('[Firestore] Error setting up settings listener:', e);
    return () => {};
  }
}

