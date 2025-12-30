
import React, { useState } from 'react';
// @ts-ignore: react-router-dom exports are incorrectly reported as missing in this environment
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const loadingToast = toast.loading('Creating your account (this may take a moment if the server is waking up)...');
    
    try {
      const { data } = await register(formData);
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Account created! Welcome.', { id: loadingToast });
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      toast.error(errorMessage, { id: loadingToast });
      
      // If the error is specific to a field (like duplicate email), you could map it here if the API provides that structure
      if (errorMessage.toLowerCase().includes('email')) setErrors(prev => ({ ...prev, email: 'Email already taken' }));
      if (errorMessage.toLowerCase().includes('username')) setErrors(prev => ({ ...prev, username: 'Username already taken' }));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (fieldName: string) => `
    w-full bg-gray-50 border rounded-2xl py-3 px-4 text-sm transition-all focus:ring-2 focus:ring-indigo-100 
    ${errors[fieldName] ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'}
  `;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-10">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-indigo-600 p-3 rounded-2xl mb-4 shadow-lg shadow-indigo-100">
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h1>
          <p className="text-gray-400 mt-2 text-sm text-center">Join GeminiChat Pro and start connecting</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">First Name</label>
            <input
              type="text"
              name="firstName"
              className={inputClass('firstName')}
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.firstName}</p>}
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              className={inputClass('lastName')}
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.lastName}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Username</label>
            <input
              type="text"
              name="username"
              className={inputClass('username')}
              placeholder="johndoe123"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.username}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              className={inputClass('email')}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.email}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              type="password"
              name="password"
              className={inputClass('password')}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.password}</p>}
          </div>

          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
