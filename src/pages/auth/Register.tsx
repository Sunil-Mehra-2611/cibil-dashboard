import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/api';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(data);
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 font-medium">
          Join the CIBIL Bureau Dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center text-sm font-medium">
                <AlertCircle size={18} className="mr-2 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className={errors.username ? "text-red-400" : "text-slate-400"} size={18} />
                </div>
                <input
                  id="username"
                  {...register('username')}
                  className={`block w-full pl-11 pr-4 py-2.5 bg-slate-50 border ${errors.username ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'} rounded-xl outline-none text-sm font-semibold transition-all placeholder:text-slate-400`}
                  placeholder="johndoe"
                />
              </div>
              {errors.username && <p className="mt-1.5 text-xs font-bold text-red-500 ml-1">{errors.username.message}</p>}
            </div>

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
                  className={`block w-full pl-11 pr-4 py-2.5 bg-slate-50 border ${errors.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'} rounded-xl outline-none text-sm font-semibold transition-all placeholder:text-slate-400`}
                  placeholder="john@example.com"
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
                  {showPassword ? <EyeOff size={18} className="text-slate-400" /> : <Eye size={18} className="text-slate-400" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs font-bold text-red-500 ml-1 leading-tight">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="role" className="block text-[11px] font-black text-slate-500 mb-1.5 uppercase tracking-widest">
                Account Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Shield className="text-slate-400" size={18} />
                </div>
                <select
                  id="role"
                  {...register('role')}
                  className="block w-full pl-11 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:ring-primary-500/20 focus:border-primary-500 rounded-xl outline-none text-sm font-bold text-slate-600 transition-all cursor-pointer appearance-none"
                >
                  <option value="user">Standard User</option>
                  <option value="admin">Administrator</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-600/20 text-sm font-black text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] uppercase tracking-widest"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-black text-primary-600 hover:text-primary-500 transition-colors underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
