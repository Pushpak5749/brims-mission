import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate checking for an existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('mock_user_session');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginWithEmail = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('brims_users_db') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          const sessionUser = {
            uid: `local|${Date.now()}`,
            displayName: user.fullName,
            email: user.email,
            photoURL: "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName) + "&background=800000&color=fff"
          };
          setCurrentUser(sessionUser);
          localStorage.setItem('mock_user_session', JSON.stringify(sessionUser));
          resolve(sessionUser);
        } else {
          reject(new Error("Invalid email or password."));
        }
      }, 600); // simulate network delay
    });
  };

  const signupWithEmail = async (fullName, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('brims_users_db') || '[]');
        if (users.find(u => u.email === email)) {
          reject(new Error("An account with this email already exists."));
          return;
        }
        
        users.push({ fullName, email, password });
        localStorage.setItem('brims_users_db', JSON.stringify(users));
        
        // Auto-login after signup
        const sessionUser = {
          uid: `local|${Date.now()}`,
          displayName: fullName,
          email: email,
          photoURL: "https://ui-avatars.com/api/?name=" + encodeURIComponent(fullName) + "&background=800000&color=fff"
        };
        setCurrentUser(sessionUser);
        localStorage.setItem('mock_user_session', JSON.stringify(sessionUser));
        resolve(sessionUser);
      }, 600);
    });
  };

  const loginWithGoogle = async () => {
    // This is a simulated Google Auth flow. 
    // In production, this would be: 
    // const provider = new GoogleAuthProvider();
    // return signInWithPopup(auth, provider);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          uid: 'google-oauth2|123456789',
          displayName: 'Demo Student',
          email: 'student@university.edu',
          photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfQW9NyDHZDwDB_rJGh4v8cxeAyY2kdacpDockkX7kLAMqF1XM-vKA6FHUx9_liD2CUEdXrIDFMZX-LfHXKwntcWNwZ3X1Kx4EXC7d_4PXOjkIew2DikVq-jVkmwXEHeewCNH2WbRJvcuAZTygk-_XZNSd3TVCcDVo6Lt3hGK29GNf2g46M54qBNAx7c5RouzZDvXyg5l8h3asTTBtr1cFMZer4ldwDcd8IHMesEJOyvc8z1P62a0eeQiZTL3fTl3VkybEXEsUL1Y'
        };
        setCurrentUser(mockUser);
        localStorage.setItem('mock_user_session', JSON.stringify(mockUser));
        resolve(mockUser);
      }, 800); // simulate network delay
    });
  };

  const updateProfilePhoto = (newPhotoBase64) => {
    if (!currentUser) return;
    
    // Update active session
    const updatedUser = { ...currentUser, photoURL: newPhotoBase64 };
    setCurrentUser(updatedUser);
    localStorage.setItem('mock_user_session', JSON.stringify(updatedUser));
    
    // Also try to update the database if we had a real one, but for now we update local portfolios
    const portfolios = JSON.parse(localStorage.getItem('custom_portfolios') || '[]');
    const userIndex = portfolios.findIndex(p => p.name === currentUser.displayName);
    if (userIndex !== -1) {
      portfolios[userIndex].img = newPhotoBase64;
      localStorage.setItem('custom_portfolios', JSON.stringify(portfolios));
    }
  };

  const updateProfileInfo = (newData) => {
    if (!currentUser) return;
    
    // Update active session (just displayName for auth session)
    const updatedUser = { ...currentUser, displayName: newData.name };
    setCurrentUser(updatedUser);
    localStorage.setItem('mock_user_session', JSON.stringify(updatedUser));
    
    // Update local portfolios (this holds the extra info like role)
    const portfolios = JSON.parse(localStorage.getItem('custom_portfolios') || '[]');
    const userIndex = portfolios.findIndex(p => p.name === currentUser.displayName);
    if (userIndex !== -1) {
      portfolios[userIndex].name = newData.name;
      portfolios[userIndex].role = newData.role;
      // We don't save location/university in the custom_portfolios structure currently, but we can add them
      portfolios[userIndex].location = newData.location;
      portfolios[userIndex].university = newData.university;
      localStorage.setItem('custom_portfolios', JSON.stringify(portfolios));
    } else {
      // Create a minimal one if it doesn't exist so we can persist the data
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

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mock_user_session');
  };

  const value = {
    currentUser,
    loginWithEmail,
    signupWithEmail,
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
