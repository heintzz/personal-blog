'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { login } from '../../../lib/supabase/actions';

const loginSchema = z.object({
  email: z.email('Invalid email address').nonempty('Email is required'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const newErrors = {};
      validationResult.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const result = await login(email, password);

    if (result?.error) {
      setErrors({ form: result.error });
      setLoading(false);
    } else {
      router.replace('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Glass card container */}
        <div className="bg-white rounded-2xl shadow-xl backdrop-blur-sm border border-slate-100/50 p-8 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light tracking-tight text-black">Welcome</h1>
            <p className="text-sm text-slate-500 mt-2">Sign in to your account</p>
          </div>

          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-black placeholder-slate-400 text-sm transition-all focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="your@email.com"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-black placeholder-slate-400 text-sm transition-all focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Form Error */}
            {errors.form && (
              <div className="p-3 bg-red-50/50 border border-red-200/50 rounded-lg text-red-700 text-xs font-medium">
                {errors.form}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-black text-white text-sm font-medium rounded-lg transition-all hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
