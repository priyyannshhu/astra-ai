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
import { Loader2, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUserDetail } = useContext(UserDetailContext);
  const LoginWithUsername = useAction(api.users.LoginWithUsername);
  const CreateUser = useAction(api.users.CreateUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
        setError(err.message || 'Google sign-in failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google sign-in failed'),
  });

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const user = await LoginWithUsername({
        username: email,
        password,
      });

      if (user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }
        setUserDetail(user);
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-3xl font-bold text-white mb-2 font-manrope">Astra AI</h1>
            <p className="text-slate-400 text-sm font-manrope">Welcome back to your workspace</p>
          </div>

          {/* Login Card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm font-manrope">{error}</p>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 font-manrope">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
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
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2 font-manrope"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
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
                <span className="px-2 bg-gradient-to-b from-slate-950 to-slate-900 text-slate-500 font-manrope">Or continue with</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => googleLogin()}
                disabled={loading}
                variant="outline"
                className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg transition flex items-center justify-center gap-2 font-manrope"
              >
                <Chrome className="w-4 h-4" />
                <span>Google</span>
              </Button>
            </div>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-slate-400 font-manrope">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition">
                Sign up
              </Link>
            </p>

            {/* Footer Links */}
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-4">
              <a href="#" className="text-xs text-slate-500 hover:text-slate-400 transition font-manrope">
                Forgot password?
              </a>
              <a href="#" className="text-xs text-slate-500 hover:text-slate-400 transition font-manrope">
                Help
              </a>
            </div>
          </div>

          {/* Bottom Text */}
          <p className="mt-6 text-center text-xs text-slate-500 font-manrope">
            By signing in, you agree to our{' '}
            <a href="#" className="text-slate-400 hover:text-slate-300 transition">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-slate-400 hover:text-slate-300 transition">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
