/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AuthView.tsx - Custom high-contrast Sign In Flow
 */

import React, { useState } from 'react';
import { Mail, ShieldAlert, LogIn, ArrowRight, AppWindow } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthViewProps {
  onAuthSuccess: (profile: UserProfile) => void;
}

export default function AuthView({ onAuthSuccess }: AuthViewProps) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [logoLoaded, setLogoLoaded] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      return;
    }
    const cleanInput = emailInput.trim();
    let computedName = cleanInput;
    if (cleanInput.includes('@')) {
      const parts = cleanInput.split('@')[0];
      computedName = parts.charAt(0).toUpperCase() + parts.slice(1);
    }

    onAuthSuccess({
      fullName: computedName,
      email: cleanInput,
      userType: 'college',
      classYear: '1st Year',
      studyField: 'Web Developer',
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 space-y-6">
      {/* Branding Logo placement top center */}
      <div className="flex flex-col items-center space-y-3 pt-4 text-center">
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-[1.5px] overflow-hidden shadow-xl shadow-cyan-950/20">
          <div className="w-full h-full bg-[#0f1117] rounded-2xl flex items-center justify-center overflow-hidden relative">
            <img
              src="/logo.png"
              alt="CodeSolver AI"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onLoad={() => setLogoLoaded(true)}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                setLogoLoaded(false);
              }}
            />
            {/* SVG Logo fallback if logo fails loading */}
            {!logoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center p-3 text-cyan-400">
                <AppWindow size={36} />
              </div>
            )}
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-100 tracking-tight">CodeSolver AI</h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">Tutoring & Solver Platform</p>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-[#151821] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-bold text-gray-200 flex items-center justify-center gap-1.5">
              <LogIn size={15} className="text-cyan-400" />
              <span>Sign In to Your Workspace</span>
            </h3>
            <p className="text-[10px] text-gray-500">
              Please enter your credentials, or choose to continue as guest!
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest font-mono">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full p-2.5 pl-9 bg-gray-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none focus:border-cyan-500/40 font-mono"
                />
                <Mail size={14} className="absolute left-3 top-3.5 text-gray-600" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest font-mono">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 bg-gray-950 border border-gray-800 rounded-lg text-xs text-gray-200 outline-none focus:border-cyan-500/40 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 font-bold text-[#0f1117] text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-lg select-none cursor-pointer scale-100 hover:scale-[1.01] transition"
            >
              <span>Sign In</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-900"></div>
            <span className="flex-shrink mx-3 text-[9px] text-gray-600 font-mono uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-gray-900"></div>
          </div>

          <button
            onClick={() => {
              // Instantly enter the app as guest
              onAuthSuccess({
                fullName: 'Guest Student',
                userType: 'college',
                classYear: '1st Year',
                studyField: 'Web Developer',
                isGuest: true,
              });
            }}
            className="w-full py-2.5 bg-gray-900/60 border border-gray-800/80 hover:bg-gray-850 hover:border-gray-700 font-bold text-cyan-300 hover:text-cyan-200 text-xs rounded-xl flex items-center justify-center space-x-1 transition select-none cursor-pointer"
          >
            <span>Continue as Guest</span>
            <ArrowRight size={14} className="text-cyan-400" />
          </button>

          <div className="pt-2 text-center text-[10px] text-gray-600 flex items-center justify-center space-x-1 border-t border-gray-850/45">
            <ShieldAlert size={11} />
            <span>Full local sandbox environment configuration active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

