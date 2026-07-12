import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is not configured, fallback to mock session for UI testing
    if (!auth) {
      const mockSession = localStorage.getItem('mock_user_session');
      if (mockSession) {
        setCurrentUser(JSON.parse(mockSession));
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Map Firebase user to our app's user structure
        const mappedUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Brims User',
          photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=800000&color=fff`
        };
        setCurrentUser(mappedUser);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    if (!auth) {
      alert("Firebase is not configured! Please add your Firebase API keys to Vercel.");
      return;
    }
    
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    } else {
      setCurrentUser(null);
      localStorage.removeItem('mock_user_session');
    }
  };

  const updateProfilePhoto = (newPhotoBase64) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, photoURL: newPhotoBase64 };
    setCurrentUser(updatedUser);
    
    const portfolios = JSON.parse(localStorage.getItem('custom_portfolios') || '[]');
    const userIndex = portfolios.findIndex(p => p.name === currentUser.displayName);
    if (userIndex !== -1) {
      portfolios[userIndex].img = newPhotoBase64;
      localStorage.setItem('custom_portfolios', JSON.stringify(portfolios));
    }
  };

  const updateProfileInfo = (newData) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, displayName: newData.name };
    setCurrentUser(updatedUser);
    
    const portfolios = JSON.parse(localStorage.getItem('custom_portfolios') || '[]');
    const userIndex = portfolios.findIndex(p => p.name === currentUser.displayName);
    if (userIndex !== -1) {
      portfolios[userIndex].name = newData.name;
      portfolios[userIndex].role = newData.role;
      portfolios[userIndex].location = newData.location;
      portfolios[userIndex].university = newData.university;
      localStorage.setItem('custom_portfolios', JSON.stringify(portfolios));
    } else {
      portfolios.push({
        name: newData.name,
        role: newData.role,
        location: newData.location,
        university: newData.university,
        tags: [],
        img: currentUser.photoURL
      });
      localStorage.setItem('custom_portfolios', JSON.stringify(portfolios));
    }
  };

  const value = {
    currentUser,
    loginWithGoogle,
    logout,
    updateProfilePhoto,
    updateProfileInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
