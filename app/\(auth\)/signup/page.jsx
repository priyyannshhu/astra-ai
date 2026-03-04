'use client';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { Button } from '@/components/ui/button';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { Loader2, Mail, Lock, User, ArrowRight, Chrome, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);
  const CreateUser = useAction(api.users.CreateUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const DEFAULT_USER_IMAGE = '/user.jpg';

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError('');
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const user = userInfo.data;
        const createdUser = await CreateUser({
          name: user?.name,
          email: user?.email,
          picture: user?.picture || DEFAULT_USER_IMAGE,
          uid: uuidv4(),
          authMethod: 'google',
        });

        const userWithId = {
          ...user,
          picture: user?.picture || DEFAULT_USER_IMAGE,
          _id: createdUser,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userWithId));
        }

        setUserDetail(userWithId);
        router.push('/dashboard');
      } catch (err) {
        setError(err.message || 'Google sign-up failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google sign-up failed'),
  });

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (name.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service');
      return;
    }

    try {
      setLoading(true);
      // Use email as username for consistency
      const username = email.split('@')[0] + Math.random().toString(36).slice(2, 7);

      const createdUser = await CreateUser({
        name,
        email,
        username,
        picture: DEFAULT_USER_IMAGE,
        uid: uuidv4(),
        password,
        authMethod: 'email',
      });

      const userWithId = {
        name,
        email,
        username,
        picture: DEFAULT_USER_IMAGE,
        _id: createdUser,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userWithId));
      }

      setUserDetail(userWithId);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 5);
  };

  const strength = passwordStrength();
  const strengthColor = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-green-500',
    5: 'bg-emerald-500',
  };

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(17, 25, 40)"
      gradientBackgroundEnd="rgb(10, 15, 30)"
      firstColor="59, 130, 246"
      secondColor="139, 92, 246"
      thirdColor="59, 130, 246"
      fourthColor="139, 92, 246"
      fifthColor="59, 130, 246"
      pointerColor="139, 92, 246"
      className="flex items-center justify-center min-h-screen w-full"
    >
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 font-manrope">Get Started</h1>
            <p className="text-slate-400 text-sm font-manrope">Create your account and start building amazing apps</p>
          </div>

          {/* Signup Card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm font-manrope">{error}</p>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 font-manrope">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-manrope"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 font-manrope">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-manrope"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 font-manrope">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-manrope"
                  />
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition ${i < strength ? strengthColor[strength] : 'bg-slate-700'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-manrope">
                      {strength <= 2 ? 'Weak' : strength === 3 ? 'Fair' : strength === 4 ? 'Good' : 'Strong'} password
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 font-manrope">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-manrope"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-blue-600 checked:border-blue-600"
                />
                <span className="text-xs text-slate-400 font-manrope">
                  I agree to the{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2 font-manrope"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-b from-slate-950 to-slate-900 text-slate-500 font-manrope">Or sign up with</span>
              </div>
            </div>

            {/* OAuth Button */}
            <Button
              onClick={() => googleLogin()}
              disabled={loading}
              variant="outline"
              className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg transition flex items-center justify-center gap-2 font-manrope"
            >
              <Chrome className="w-4 h-4" />
              <span>Google</span>
            </Button>

            {/* Sign In Link */}
            <p className="mt-6 text-center text-sm text-slate-400 font-manrope">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
                Sign in
              </Link>
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { icon: '⚡', text: 'Lightning Fast' },
              { icon: '🔒', text: 'Secure' },
              { icon: '🚀', text: 'Scalable' },
              { icon: '🎨', text: 'Beautiful' },
            ].map((feature, i) => (
              <div key={i} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <div className="text-xl mb-1">{feature.icon}</div>
                <p className="text-xs text-slate-300 font-manrope">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
