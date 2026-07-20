import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMsg('');
    
    try {
      if (isSignUp) {
        await signupWithEmail(formData.fullName, formData.email, formData.password);
      } else {
        await loginWithEmail(formData.email, formData.password);
      }
      navigate('/');
    } catch (error) {
      setErrorMsg(error.message);
      setIsLoggingIn(false);
    }
  };

  const handleGoogleClick = async () => {
    setIsLoggingIn(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
      setErrorMsg(error.message || "Failed to sign in with Google");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface selection:bg-secondary-fixed-dim bg-surface relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-surface">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        {/* Dynamic Blobs */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.15, scale: 1 }} transition={{ duration: 1.5 }}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[70%] rounded-full bg-secondary blur-[100px]"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.15, scale: 1 }} transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[70%] rounded-full bg-primary blur-[100px]"
        />
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-[20%] left-[20%] w-[30%] h-[40%] rounded-full bg-tertiary blur-[80px]"
        />
      </div>

      <main className="grow flex flex-col items-center justify-center px-margin-mobile py-12 z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-sm text-center mb-10"
        >
          <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary shadow-lg overflow-hidden">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-primary mb-2">Brims Mission</h1>
          <p className="font-display-lg-mobile text-display-lg-mobile text-on-surface font-bold tracking-tight">Start your mission</p>
          <p className="font-body-md text-on-surface-variant mt-2 px-4">Connecting emerging professionals with tomorrow's opportunities.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-sm bg-surface-container-lowest p-base rounded-xl border border-outline-variant shadow-sm"
        >
          <form className="space-y-6 p-4" onSubmit={handleEmailSubmit}>
            {errorMsg && (
              <div className="bg-error/10 text-error p-3 rounded-lg text-sm font-medium">
                {errorMsg}
              </div>
            )}
            
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="fullName">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">person</span>
                  <input 
                    type="text" id="fullName" name="fullName" placeholder="Alex Chen" required
                    value={formData.fullName} onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-on-surface placeholder:text-on-surface-variant/50 outline-none" 
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">mail</span>
                <input 
                  type="email" id="email" name="email" placeholder="student@university.edu" required
                  value={formData.email} onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-on-surface placeholder:text-on-surface-variant/50 outline-none" 
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="password">Password</label>
                {!isSignUp && <a href="#" className="font-label-sm text-label-sm text-primary hover:underline">Forgot password?</a>}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">lock</span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" name="password" placeholder="••••••••" required minLength={6}
                  value={formData.password} onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-on-surface placeholder:text-on-surface-variant/50 outline-none" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors text-lg"
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-primary text-white font-label-md text-label-md py-3.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoggingIn ? 'Processing...' : (isSignUp ? 'Create Account' : 'Login')}
            </button>

            <div className="relative flex items-center py-2">
              <div className="grow border-t border-outline-variant"></div>
              <span className="shrink mx-4 font-label-sm text-label-sm text-on-surface-variant">OR</span>
              <div className="grow border-t border-outline-variant"></div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="button" 
              onClick={handleGoogleClick}
              disabled={isLoggingIn}
              className="w-full bg-secondary-container text-on-secondary-fixed font-label-md text-label-md py-3.5 rounded-lg flex items-center justify-center gap-3 transition-all border border-secondary"
            >
              {isLoggingIn ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"></path>
                </svg>
              )}
              {isLoggingIn ? 'Signing in...' : 'Continue with Google'}
            </motion.button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center space-y-4"
        >
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {isSignUp ? "Already have an account?" : "Don't have an account?"} 
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
              }} 
              className="font-label-md text-primary hover:underline ml-1"
            >
              {isSignUp ? "Log in" : "Sign up"}
            </button>
          </p>
          <div className="flex gap-4 items-center justify-center">
            <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-outline"></span>
            <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
