import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXZDUasIi6hXUyBErlMbcDN_N9n4mGaME",
  authDomain: "moments-37eff.firebaseapp.com",
  projectId: "moments-37eff",
  storageBucket: "moments-37eff.firebasestorage.app",
  messagingSenderId: "831676737760",
  appId: "1:831676737760:web:90a6101d14b89acb0f0885",
  measurementId: "G-5ZRXJJQGDH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Verify Firebase initialization
console.log('Firebase initialized:', {
  auth: !!auth,
  db: !!db,
  storage: !!storage,
  projectId: firebaseConfig.projectId
});

// Initialize Analytics (optional - only works on web)
// Uncomment if you want to use analytics on web platform
// export const analytics = getAnalytics(app);

export default app;

