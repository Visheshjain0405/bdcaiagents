import React, { useState } from 'react';
import axiosInstance from '../../services/axiosInstance'; // make sure the path is correct
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = ({ setUser }) => {
    const [credentials, setCredentials] = useState({ id: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axiosInstance.post('/auth/login', {
                id: credentials.id,
                password: credentials.password,
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', response.data.userType);

                login({ type: response.data.userType });

                toast.success('Login successful!', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                    style: {
                        background: '#4F46E5', // Indigo-600
                        color: 'white',
                        fontWeight: '500',
                    },
                });

                setTimeout(() => {
                    const userType = response.data.userType;

                    if (userType === 'super_user') {
                        navigate('/superadmindashboard');
                    } else if (userType === 'orgadmin') {
                        navigate('/organization-dashboard/agents');
                    } else {
                        navigate('/dashboard'); // fallback
                    }
                }, 2200);

            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (err) {
            console.error("Login error:", err);
            if (err.response && err.response.status === 401) {
                setError('Invalid credentials.');
            } else {
                setError('Server error. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        alert('Forgot Password feature is under development. Please contact support.');
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Panel: Branding */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 800 800">
                        <path
                            d="M0 0h800v800H0z"
                            fill="url(#circuit)"
                        />
                        <defs>
                            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                <path
                                    d="M50 0v50h50V0H50zm0 50v50h50V50H50z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </pattern>
                        </defs>
                    </svg>
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-4">BDC AI Agents</h1>
                <p className="text-lg text-indigo-200 max-w-md text-center">
                    Revolutionize your operations with cutting-edge AI agents designed for efficiency and impact.
                </p>
            </div>

            {/* Right Panel: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-sm">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="white" viewBox="0 0 24 24">
                                <path d="M8.7 6.3L3 12l5.7 5.7 1.4-1.4L5.8 12l4.3-4.3-1.4-1.4zm6.6 0l-1.4 1.4 4.3 4.3-4.3 4.3 1.4 1.4L21 12l-5.7-5.7z" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-semibold text-indigo-900 text-center mb-2">Welcome Back</h2>
                    <p className="text-sm text-indigo-600 text-center mb-6">Sign in to access your AI Agents platform</p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 animate-fade-in">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-indigo-900">
                                User ID
                            </label>
                            <input
                                id="userId"
                                type="text"
                                placeholder="Enter your User ID"
                                value={credentials.id}
                                onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
                                className="mt-1 w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-indigo-900">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your Password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                className="mt-1 w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-300"
                            />
                        </div>
                        <button
                            onClick={handleLogin}
                            disabled={isLoading || !credentials.id || !credentials.password}
                            className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-200 ${isLoading || !credentials.id || !credentials.password
                                ? 'bg-indigo-300 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Animation Styles */}
            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default LoginPage;
