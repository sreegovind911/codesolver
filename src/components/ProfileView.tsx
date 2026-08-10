/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  Award,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sun,
  Moon,
  MessageSquare,
  Info,
  Send,
  ChevronRight,
  Palette,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  isPremium: boolean;
  onLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

type SubPage = 'theme' | 'feedback' | 'about' | null;

export default function ProfileView({
  profile,
  setProfile,
  isPremium,
  onLogout,
  theme,
  setTheme,
}: ProfileViewProps) {
  const [subPage, setSubPage] = useState<SubPage>(null);

  // Profile fields state
  const [editingName, setEditingName] = useState(profile.fullName);
  const [editingType, setEditingType] = useState<'school' | 'college' | 'self_learner' | 'teacher' | ''>(
    profile.userType || 'college'
  );
  const [editingClass, setEditingClass] = useState(profile.classYear || '1st Year');
  const [editingField, setEditingField] = useState(profile.studyField || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Feedback form states
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleTypeChange = (newType: 'school' | 'college' | 'self_learner' | 'teacher') => {
    setEditingType(newType);
    if (newType === 'school') {
      const validSchoolClasses = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
      if (!validSchoolClasses.includes(editingClass)) {
        setEditingClass('Class 10');
      }
    } else if (newType === 'college') {
      const validCollegeYears = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
      if (!validCollegeYears.includes(editingClass)) {
        setEditingClass('1st Year');
      }
    } else {
      setEditingClass('');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      fullName: editingName,
      userType: editingType,
      classYear: editingClass,
      studyField: editingField,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackSubject.trim() || !feedbackMessage.trim()) return;
    setFeedbackSubmitted(true);
    setFeedbackSubject('');
    setFeedbackMessage('');
  };

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     1. APP THEME SUB-PAGE
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  if (subPage === 'theme') {
    return (
      <div className="space-y-6 max-w-md mx-auto">
        {/* Sub-page Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800/80">
          <button
            type="button"
            onClick={() => setSubPage(null)}
            className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Settings</span>
          </button>
          <span className="text-xs font-mono font-bold text-emerald-400">Theme Preferences</span>
        </div>

        <div className="bg-[#151821] border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2">
            <Palette size={18} className="text-emerald-400" />
            <h2 className="text-base font-bold text-gray-100">App Theme</h2>
          </div>

          <p className="text-xs text-gray-400">
            Choose your preferred display mode:
          </p>

          {/* Clean Material Radio Selection List */}
          <div className="space-y-2.5 pt-2 font-sans">
            {/* Light Theme Radio Row */}
            <label
              onClick={() => setTheme('light')}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                theme === 'light'
                  ? 'bg-emerald-950/20 border-emerald-500/50 text-gray-100 font-semibold ring-1 ring-emerald-500/30'
                  : 'bg-gray-950/80 border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                    theme === 'light' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-600 bg-transparent'
                  }`}
                >
                  {theme === 'light' && <div className="w-2 h-2 rounded-full bg-gray-950" />}
                </div>
                <div className="flex items-center space-x-2">
                  <Sun size={16} className={theme === 'light' ? 'text-amber-400' : 'text-gray-400'} />
                  <span className="text-xs">Light Theme</span>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">Clean White & Green</span>
            </label>

            {/* Dark Theme Radio Row */}
            <label
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                theme === 'dark'
                  ? 'bg-emerald-950/20 border-emerald-500/50 text-gray-100 font-semibold ring-1 ring-emerald-500/30'
                  : 'bg-gray-950/80 border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                    theme === 'dark' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-600 bg-transparent'
                  }`}
                >
                  {theme === 'dark' && <div className="w-2 h-2 rounded-full bg-gray-950" />}
                </div>
                <div className="flex items-center space-x-2">
                  <Moon size={16} className={theme === 'dark' ? 'text-cyan-400' : 'text-gray-400'} />
                  <span className="text-xs">Dark Theme</span>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">Futuristic Cyber Dark</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     2. FEEDBACK & BUG REPORT SUB-PAGE
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  if (subPage === 'feedback') {
    return (
      <div className="space-y-6 max-w-md mx-auto">
        {/* Sub-page Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800/80">
          <button
            type="button"
            onClick={() => setSubPage(null)}
            className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Settings</span>
          </button>
          <span className="text-xs font-mono font-bold text-cyan-400">User Feedback</span>
        </div>

        <div className="bg-[#151821] border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2">
            <MessageSquare size={18} className="text-cyan-400" />
            <h2 className="text-base font-bold text-gray-100">Feedback & Bug Report</h2>
          </div>

          {feedbackSubmitted ? (
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-3 text-center">
              <p className="text-xs text-emerald-400 font-semibold leading-relaxed">
                Thank you! Your feedback has been submitted successfully.
              </p>
              <button
                type="button"
                onClick={() => setFeedbackSubmitted(false)}
                className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4 font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={feedbackSubject}
                  onChange={(e) => setFeedbackSubject(e.target.value)}
                  placeholder="Enter feedback or bug title"
                  className="w-full text-xs p-3 bg-gray-950 border border-gray-850 rounded-xl text-gray-200 outline-none focus:border-cyan-500/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Describe your issue or suggestion in detail..."
                  className="w-full text-xs p-3 bg-gray-950 border border-gray-850 rounded-xl text-gray-200 outline-none focus:border-cyan-500/40 resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-gray-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition shadow-md cursor-pointer"
              >
                <Send size={13} />
                <span>Submit Feedback</span>
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     3. ABOUT APP SUB-PAGE
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  if (subPage === 'about') {
    return (
      <div className="space-y-6 max-w-md mx-auto">
        {/* Sub-page Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800/80">
          <button
            type="button"
            onClick={() => setSubPage(null)}
            className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Settings</span>
          </button>
          <span className="text-xs font-mono font-bold text-indigo-400">Application Info</span>
        </div>

        <div className="bg-[#151821] border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2">
            <Info size={18} className="text-indigo-400" />
            <h2 className="text-base font-bold text-gray-100">About App</h2>
          </div>

          <div className="space-y-3 text-xs text-gray-300 font-sans leading-relaxed">
            <div className="flex justify-between items-center border-b border-gray-800/80 pb-2.5">
              <span className="text-gray-400">App Name</span>
              <span className="font-bold text-gray-100">CodeSolver AI</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-800/80 pb-2.5">
              <span className="text-gray-400">Version</span>
              <span className="font-mono text-cyan-400 font-semibold">v1.0.0 Beta</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-800/80 pb-2.5">
              <span className="text-gray-400">Developer</span>
              <span className="font-semibold text-gray-200">Bhavesh B Nair</span>
            </div>
            <div className="space-y-1 border-b border-gray-800/80 pb-3">
              <span className="text-gray-400 block">Description</span>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                CodeSolver AI is an AI-powered coding assistant that helps students and developers generate, debug, explain, convert, and learn programming.
              </p>
            </div>
            <div className="pt-1 text-center text-[11px] text-gray-500 font-mono">
              © 2026 CodeSolver AI
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     MAIN SETTINGS & PROFILE VIEW
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Guest Session Warning Banner */}
      {profile.isGuest && (
        <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl space-y-3">
          <div className="flex items-start space-x-2.5">
            <div className="p-1.5 bg-cyan-950 rounded-xl text-cyan-400 shrink-0">
              <AlertCircle size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-cyan-400">Guest Session Active</h4>
              <p className="text-[10px] text-gray-300 leading-relaxed font-sans mt-0.5 text-left">
                Your progress is stored locally on this browser. To save your history, sync your profile with the cloud, or sign in to get full access.
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-gray-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition shadow-md cursor-pointer"
          >
            <span>Sign In / Create Account</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* Visual Identity Profile Header */}
      <div className="flex flex-col items-center p-5 bg-gradient-to-r from-pink-950/40 to-indigo-950/20 border border-pink-500/20 rounded-2xl text-center relative overflow-hidden">
        {isPremium && (
          <span className="absolute top-3 right-3 text-[10px] px-2.5 py-1 bg-amber-500 text-gray-950 rounded-full font-bold flex items-center space-x-1 uppercase animate-pulse shadow-md select-none">
            <Award size={10} />
            <span>VIP Premium</span>
          </span>
        )}

        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold border-2 border-gray-900 shadow-lg">
          {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : <User />}
        </div>

        <h2 className="text-base font-bold text-gray-100 mt-2">
          {profile.fullName || 'Guest Student'}
        </h2>
        <p className="text-xs text-gray-400 font-mono italic">
          Field: {profile.studyField || 'Unconfigured Profile'}
        </p>
      </div>

      {/* Editing Setup Form */}
      <div className="bg-[#151821] border border-gray-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-gray-250 uppercase tracking-wider font-mono">
          Configure Profile setup
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 font-sans">
          {/* 1. Student Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Student Name
            </label>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              placeholder="Enter your name"
              className="w-full text-xs p-2.5 bg-gray-950 border border-gray-850 rounded-lg text-gray-200 outline-none focus:border-pink-500/40"
            />
          </div>

          {/* 2. Academic Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Academic Status
            </label>
            <select
              value={editingType}
              onChange={(e) =>
                handleTypeChange(e.target.value as 'school' | 'college' | 'self_learner' | 'teacher')
              }
              className="w-full text-xs p-2.5 bg-gray-950 border border-gray-850 rounded-lg text-gray-200 outline-none focus:border-pink-500/40 cursor-pointer"
            >
              <option value="school">School Student</option>
              <option value="college">College Student</option>
              <option value="self_learner">Self Learner</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* 3. Class / Year & 4. Subject Track */}
          {editingType === 'school' || editingType === 'college' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Class / Year */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Class / Year
                </label>
                <select
                  value={editingClass}
                  onChange={(e) => setEditingClass(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-950 border border-gray-850 rounded-lg text-gray-200 outline-none focus:border-pink-500/40 cursor-pointer"
                >
                  {editingType === 'school' ? (
                    <>
                      <option value="Class 6">Class 6</option>
                      <option value="Class 7">Class 7</option>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                    </>
                  ) : (
                    <>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year">5th Year</option>
                    </>
                  )}
                </select>
              </div>

              {/* Subject Track */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Subject Track
                </label>
                <input
                  type="text"
                  value={editingField}
                  onChange={(e) => setEditingField(e.target.value)}
                  placeholder="e.g., Computer Science, AI & Data Science, Mechanical Engineering"
                  className="w-full text-xs p-2.5 bg-gray-950 border border-gray-850 rounded-lg text-gray-200 outline-none focus:border-pink-500/40"
                />
              </div>
            </div>
          ) : (
            /* Subject Track full width when Class/Year is hidden for Self Learner or Teacher */
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Subject Track
              </label>
              <input
                type="text"
                value={editingField}
                onChange={(e) => setEditingField(e.target.value)}
                placeholder="e.g., Computer Science, AI & Data Science, Mechanical Engineering"
                className="w-full text-xs p-2.5 bg-gray-950 border border-gray-850 rounded-lg text-gray-200 outline-none focus:border-pink-500/40"
              />
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            {saveSuccess ? (
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1 animate-pulse">
                <CheckCircle size={12} />
                <span>Profile updated locally!</span>
              </span>
            ) : (
              <span></span>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 hover:bg-pink-400 text-gray-950 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Update Details
            </button>
          </div>
        </form>
      </div>

      {/* Clickable Settings Menu Items */}
      <div className="bg-[#151821] border border-gray-800 rounded-2xl p-2 space-y-1">
        <h3 className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono border-b border-gray-850/60">
          Preferences & Support
        </h3>

        {/* 1. App Theme Option */}
        <button
          type="button"
          onClick={() => setSubPage('theme')}
          className="w-full p-3.5 rounded-xl hover:bg-gray-900/80 flex items-center justify-between text-left transition group cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-950/40 border border-amber-500/20 rounded-xl text-amber-400 group-hover:scale-105 transition">
              <Sun size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-200 block">App Theme</span>
              <span className="text-[10px] text-gray-400 font-mono capitalize">
                Current: {theme === 'light' ? 'Light Theme (White & Green)' : 'Dark Theme'}
              </span>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-500 group-hover:text-gray-300 transition" />
        </button>

        {/* 2. Feedback & Bug Report Option */}
        <button
          type="button"
          onClick={() => setSubPage('feedback')}
          className="w-full p-3.5 rounded-xl hover:bg-gray-900/80 flex items-center justify-between text-left transition group cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-950/40 border border-cyan-500/20 rounded-xl text-cyan-400 group-hover:scale-105 transition">
              <MessageSquare size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-200 block">Feedback & Bug Report</span>
              <span className="text-[10px] text-gray-400 font-mono">Send suggestions or issue reports</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-500 group-hover:text-gray-300 transition" />
        </button>

        {/* 3. About App Option */}
        <button
          type="button"
          onClick={() => setSubPage('about')}
          className="w-full p-3.5 rounded-xl hover:bg-gray-900/80 flex items-center justify-between text-left transition group cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-indigo-400 group-hover:scale-105 transition">
              <Info size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-200 block">About App</span>
              <span className="text-[10px] text-gray-400 font-mono">v1.0.0 Beta • CodeSolver AI</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-500 group-hover:text-gray-300 transition" />
        </button>
      </div>
    </div>
  );
}


