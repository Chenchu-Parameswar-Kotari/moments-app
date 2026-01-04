import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { onAuthStateChange, getUserProfile, logOut } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Fetch user profile from Firestore
        const profileResult = await getUserProfile(firebaseUser.uid);
        if (profileResult.success) {
          setUserProfile(profileResult.data);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    console.log('AuthContext: handleLogout called');
    try {
      const result = await logOut();
      if (result.success) {
        // Auth state will update automatically via onAuthStateChange
      } else {
        Alert.alert('Error', result.error || 'Failed to sign out');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while signing out');
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      const profileResult = await getUserProfile(user.uid);
      if (profileResult.success) {
        setUserProfile(profileResult.data);
      }
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    logout: handleLogout,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

