import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Additional "thorough" authentication step (a hardcoded secret key for access)
    // In a real prod app, this might be a 2FA code, but a secret key adds an extra layer of defense against hijacked admin emails.
    if (secretKey !== import.meta.env.VITE_ADMIN_SECRET_KEY && secretKey !== 'BRIM_ADMIN_2026') {
      setError('Invalid Admin Secret Key.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verify isAdmin flag in Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (!userDoc.exists() || userDoc.data().isAdmin !== true) {
        // If not an admin, immediately sign them out and reject
        await auth.signOut();
        setError('Unauthorized. This account does not have administrator privileges.');
        setLoading(false);
        return;
      }

      // Success! Navigate to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
          </div>
          <h1 className="font-display-sm font-bold text-on-surface">Admin Portal</h1>
          <p className="text-body-sm text-on-surface-variant">Restricted access only.</p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-body-sm font-bold mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-label-sm font-bold text-on-surface-variant mb-1">Admin Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-error transition-colors"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-label-sm font-bold text-on-surface-variant mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-error transition-colors"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-label-sm font-bold text-on-surface-variant mb-1">Secret Access Key</label>
            <input 
              type="password" 
              required
              placeholder="Requires 2FA / Secret Key"
              className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-error transition-colors font-mono"
              value={secretKey}
              onChange={e => setSecretKey(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-error text-white rounded-xl font-bold hover:bg-error/90 transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Authorize Access'}
          </button>
        </form>
      </div>
    </div>
  );
}
