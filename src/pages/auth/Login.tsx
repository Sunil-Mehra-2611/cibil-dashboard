import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../store/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clean up state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      // If login is successful, navigate to the intended page
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled in AuthContext and displayed via the 'error' from useAuth()
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Sign in to CIBIL Bureau
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 font-medium">
          Access your secure dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-200">
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center text-sm font-medium animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={18} className="mr-2 shrink-0" />
              {successMessage}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center text-sm font-medium">
                <AlertCircle size={18} className="mr-2 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className={errors.email ? "text-red-400" : "text-slate-400"} size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`block w-full pl-11 pr-3 py-2.5 bg-slate-50 border ${errors.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'} rounded-xl outline-none text-sm font-semibold transition-all placeholder:text-slate-400`}
                  placeholder="admin@cibil.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className={errors.password ? "text-red-400" : "text-slate-400"} size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`block w-full pl-11 pr-10 py-2.5 bg-slate-50 border ${errors.password ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'} rounded-xl outline-none text-sm font-semibold transition-all placeholder:text-slate-400`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-slate-400" />
                  ) : (
                    <Eye size={18} className="text-slate-400" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs font-bold text-red-500 ml-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 font-medium cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" global="forgot-password" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-600/20 text-sm font-black text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] uppercase tracking-widest"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-black text-primary-600 hover:text-primary-500 transition-colors underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
