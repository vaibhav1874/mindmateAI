"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserState } from "@/context/UserState";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useUserState();
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({}); // Clear any previous errors
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple client-side auth (placeholder)
      login({ email: formData.email, name: formData.email.split('@')[0] });
      
      // Add a small delay to ensure state is updated before navigation
      setTimeout(() => {
        router.push("/dashboard");
        // Fallback navigation in case the first one fails
        setTimeout(() => {
          if (window.location.pathname !== '/dashboard') {
            window.location.href = '/dashboard';
          }
        }, 500);
      }, 100);
    } catch (error) {
      setErrors({ general: "Login failed. Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: "demo@mindmate.ai",
      password: "demopassword"
    });
    
    // Auto-submit the form after setting demo credentials
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleSubmit(fakeEvent);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-lg border border-slate-700/50 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🧠</span>
          </div>
          <h1 className="text-3xl text-cyan-300 font-bold mb-2">Welcome to MindMate</h1>
          <p className="text-gray-400">Your personal stress relief companion</p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
            <input 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              type="email"
              className={`w-full p-3 rounded-xl bg-slate-800/70 border ${errors.email ? 'border-red-500' : 'border-slate-700'} text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition`} 
            />
            {errors.email && <p className="mt-1 text-red-400 text-xs">{errors.email}</p>}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-300 text-sm font-medium">Password</label>
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              className={`w-full p-3 rounded-xl bg-slate-800/70 border ${errors.password ? 'border-red-500' : 'border-slate-700'} text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition`} 
            />
            {errors.password && <p className="mt-1 text-red-400 text-xs">{errors.password}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold transition transform hover:scale-[1.02] ${isLoading ? 'bg-cyan-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={handleDemoLogin}
            className="text-sm text-cyan-400 hover:text-cyan-300 underline"
          >
            Try demo account
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our <br />
            <a href="#" className="text-cyan-400 hover:text-cyan-300">Terms of Service</a> and <a href="#" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
