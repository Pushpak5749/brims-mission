import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch custom profile data from Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        let mappedUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Brims User',
          photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=800000&color=fff`,
          role: 'Student', // Default role
          location: '',
          university: '',
          status: '', // Changed to empty string so users must explicitly choose
          statusLastUpdated: 0, // Timestamp
          about: '',
          experience: [],
          projects: [],
          skills: [],
          jobPosts: []
        };

        if (userSnap.exists()) {
          // Merge Firestore data (which contains edits) with base user data
          mappedUser = { ...mappedUser, ...userSnap.data() };
        } else {
          // First time logging in, create the document in Firestore
          await setDoc(userRef, mappedUser);
        }
        
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
      alert("Firebase is not configured!");
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
    }
  };

  const loginWithEmail = async (email, password) => {
    if (!auth) throw new Error("Firebase is not configured!");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signupWithEmail = async (name, email, password) => {
    if (!auth) throw new Error("Firebase is not configured!");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
    }
  };

  const updateProfilePhoto = async (newPhotoBase64) => {
    if (!currentUser || !db) return;
    
    // Update local React state instantly for snappy UI
    const updatedUser = { ...currentUser, photoURL: newPhotoBase64 };
    setCurrentUser(updatedUser);
    
    // Push change to Firestore permanently
    const userRef = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(userRef, {
        photoURL: newPhotoBase64
      });
    } catch (error) {
      console.error("Error updating photo in Firestore:", error);
    }
  };

  const updateProfileInfo = async (newData) => {
    if (!currentUser || !db) return;
    
    const now = Date.now();
    let newStatus = currentUser.status;
    let newStatusLastUpdated = currentUser.statusLastUpdated;

    // Check if they are trying to change their status
    if (newData.status && newData.status !== currentUser.status) {
      const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
      if (currentUser.statusLastUpdated && (now - currentUser.statusLastUpdated < oneWeekMs)) {
        throw new Error("COOLDOWN_ACTIVE"); // Throw error to be caught by the UI
      }
      newStatus = newData.status;
      newStatusLastUpdated = now;
    }
    
    // Map 'name' back to 'displayName' for consistency
    const cleanData = { ...newData };
    if (cleanData.name) {
      cleanData.displayName = cleanData.name;
      delete cleanData.name;
    }

    // Update local React state instantly
    const updatedUser = { 
      ...currentUser, 
      ...cleanData,
      status: newStatus,
      statusLastUpdated: newStatusLastUpdated
    };
    setCurrentUser(updatedUser);
    
    // Push change to Firestore permanently
    const userRef = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(userRef, {
        ...cleanData,
        status: newStatus,
        statusLastUpdated: newStatusLastUpdated
      });
    } catch (error) {
      console.error("Error updating profile info in Firestore:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
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
