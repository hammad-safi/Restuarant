'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // Store token
      localStorage.setItem('authToken', data.token);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Redirect to dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-inter" style={{ backgroundColor: '#1E1E2E' }}>
      {/* Login Container */}
      <div className="w-full max-w-md">
        {/* Brand Logo / Identity */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-surface-container-lowest rounded-xl shadow-lg mb-4">
            <span className="material-symbols-outlined text-primary-container text-5xl">restaurant</span>
          </div>
          <h1 className="font-headline-xl text-surface-container-lowest">FAST BITES</h1>
          <p className="font-body-md text-surface-variant/70 tracking-wide">ADMINISTRATION PANEL</p>
        </div>

        {/* Main Login Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-2xl p-card-padding">
          <div className="mb-section-gap">
            <h2 className="font-headline-lg text-on-surface">Welcome Back</h2>
            <p className="font-body-md text-on-surface-variant">Sign in to manage your restaurant operations</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-error-container border border-error rounded-lg">
              <p className="text-on-error-container text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-gutter">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block font-label-bold text-on-surface-variant" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                  person
                </span>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all font-body-md"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block font-label-bold text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <Link href="#" className="font-label-bold text-primary-container hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all font-body-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary-container border-outline-variant rounded focus:ring-primary-container"
              />
              <label className="font-body-md text-on-surface-variant" htmlFor="remember">
                Keep me logged in
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-on-primary-container font-headline-md py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Logging in...' : 'Login'}</span>
              <span className="material-symbols-outlined">login</span>
            </button>
          </form>

          {/* Bottom Links */}
          <div className="mt-section-gap pt-gutter border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-1 text-on-surface-variant font-label-sm">
              <span className="material-symbols-outlined text-[16px]">help_outline</span>
              <span>Having trouble?</span>
            </div>
            <Link href="#" className="flex items-center space-x-1 font-label-bold text-primary-container hover:brightness-90">
              <span>Contact Support</span>
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
            </Link>
          </div>
        </div>

        {/* Footer / Security Info */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-surface-variant/50 font-label-sm">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              <span>Secure Encryption</span>
            </div>
            <div className="w-1 h-1 bg-surface-variant/30 rounded-full"></div>
            <div className="flex items-center space-x-1 text-surface-variant/50 font-label-sm">
              <span className="material-symbols-outlined text-[14px]">language</span>
              <span>v2.4.0-PK</span>
            </div>
          </div>
          
          <div className="relative w-full h-[200px] rounded-2xl overflow-hidden grayscale opacity-20 pointer-events-none">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuARxftDIOsHw7eQqwA42tD1Z2ashV4D-I2KLDOQQNy_knQUm0b0ucqLgvZSN5uGxOrHk5vOp1pAZgivmBm8ULMeNEB2BADrJqJpayW6Lx0vjNrvDNlQos0exYsz6sQNCUHJhesKPYIMKdQGIf1osgGnhVWIjIL9DdMOO17XX_f7KKis73lrjwvXPJbdfgWPxbZBlHNadpKss1RwlyKfZJn1BFcNNsFq4qUs4splJG0o_HwplOxpz-9_tMIrOdESAP-oiaiBqsSpdrgp"
              alt="Background of a modern kitchen"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E] via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
