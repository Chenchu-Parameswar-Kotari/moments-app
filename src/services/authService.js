import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Sign up with email and password
export const signUp = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    try {
      await updateProfile(user, { displayName: name });
    } catch (profileError) {
      // Continue even if profile update fails
    }

    // Create user document in Firestore (don't fail if this fails)
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        displayName: name,
        photoURL: null,
        bio: '',
        createdAt: new Date().toISOString(),
        followers: [],
        following: [],
      });
    } catch (firestoreError) {
      // Continue even if Firestore fails - user is still created
    }

    return { success: true, user };
  } catch (error) {
    let errorMessage = 'Failed to create account. Please try again.';

    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please sign in instead.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use at least 6 characters.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/configuration-not-found') {
      errorMessage = 'Email/password authentication is not enabled. Please enable it in Firebase Console under Authentication > Sign-in method.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let errorMessage = 'Failed to sign in. Please try again.';

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email. Please sign up first.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password. Please try again.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    let errorMessage = 'Failed to send reset email. Please try again.';

    if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get user profile from Firestore
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (uid, data) => {
  console.log('[DEBUG] Starting updateUserProfile for:', uid);
  try {
    const user = auth.currentUser;

    // Update Firebase Auth profile
    if (user && (data.displayName)) {
      console.log('[DEBUG] Updating Auth displayName...');
      try {
        await updateProfile(user, {
          displayName: data.displayName,
        });
        console.log('[DEBUG] Auth displayName updated.');
      } catch (authError) {
        console.error('[DEBUG] Auth update failed (continuing to Firestore):', authError);
      }
    }

    // Update Firestore document
    try {
      console.log('[DEBUG] Attempting to write to Firestore users collection...');
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, data, { merge: true });
      console.log('[DEBUG] Firestore write successful.');
    } catch (firestoreError) {
      console.error('[DEBUG] Firestore write FAILED:', firestoreError);
      throw firestoreError; // Re-throw to be caught by outer catch
    }

    return { success: true };
  } catch (error) {
    console.error('[DEBUG] updateUserProfile FAILED:', error);
    return { success: false, error: error.message };
  }
};
