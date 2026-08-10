/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppWindow, Award, Sparkles, X, Trash2, Camera, LogIn, Upload, CheckCircle, UserCircle, Bot, Bug, RefreshCw, GraduationCap, History, Search, Calendar, Copy, Check } from 'lucide-react';
import { AppTab, UserProfile } from './types';

// Component Imports
import BottomNavBar from './components/BottomNavBar';
import CameraOCRModal from './components/CameraOCRModal';
import HomeSolver from './components/Tabs/HomeSolver';
import Converter from './components/Tabs/Converter';
import Debugger from './components/Tabs/Debugger';
import Tutor from './components/Tabs/Tutor';
import Learn from './components/Tabs/Learn';
import ProfileView from './components/ProfileView';
import AuthView from './components/AuthView';

export interface HistoryItem {
  id: string;
  timestamp: string;
  type: 'solve' | 'convert' | 'debug' | 'tutor';
  title: string;
  input: string;
  output: string;
  language?: string;
  extra?: any;
}

export default function App() {
  // Navigation Routing States - query param based backings
  const [activeTab, setActiveTabState] = useState<AppTab>('home');

  // User details & caches
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('codesolver_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed?.fullName?.toLowerCase().includes('bhavesh') ||
          parsed?.email?.toLowerCase().includes('bhavesh')
        ) {
          localStorage.removeItem('codesolver_profile');
          localStorage.removeItem('codesolver_logged_in');
          return {
            fullName: 'Guest Student',
            userType: 'college',
            classYear: '1st Year',
            studyField: 'Web Developer',
          };
        }
        return parsed;
      }
    } catch (e) {
      localStorage.removeItem('codesolver_profile');
    }
    return {
      fullName: 'Guest Student',
      userType: 'college',
      classYear: '1st Year',
      studyField: 'Web Developer',
    };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const savedProfile = localStorage.getItem('codesolver_profile');
      if (savedProfile && savedProfile.toLowerCase().includes('bhavesh')) {
        localStorage.removeItem('codesolver_logged_in');
        localStorage.removeItem('codesolver_profile');
        return false;
      }
    } catch {
      localStorage.removeItem('codesolver_profile');
    }
    return localStorage.getItem('codesolver_logged_in') === 'true';
  });

  // Force automatic purge of any residual test-user logins or profiles on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('codesolver_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed?.fullName?.toLowerCase().includes('bhavesh') ||
          parsed?.email?.toLowerCase().includes('bhavesh')
        ) {
          localStorage.removeItem('codesolver_profile');
          localStorage.removeItem('codesolver_logged_in');
          localStorage.removeItem('codesolver_premium');
          localStorage.removeItem('codesolver_adfree');
          setProfile({
            fullName: 'Guest Student',
            userType: 'college',
            classYear: '1st Year',
            studyField: 'Web Developer',
          });
          setIsLoggedIn(false);
          setIsPremium(false);
          setIsAdFree(false);
        }
      }
    } catch (e) {
      localStorage.removeItem('codesolver_profile');
      localStorage.removeItem('codesolver_logged_in');
    }
  }, []);

  // Premium
  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem('codesolver_premium') === 'true';
  });

  const [isAdFree, setIsAdFree] = useState(() => {
    return localStorage.getItem('codesolver_adfree') === 'true';
  });

  // App Theme state ('light' or 'dark')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('codesolver_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('codesolver_theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    } else {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    }
  }, [theme]);

  // Camera OCR scanner active slot states
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraTargetCallback, setCameraTargetCallback] = useState<((text: string) => void) | null>(null);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Activity History State
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('codesolver_activity_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

  // Sync state changes to storage
  useEffect(() => {
    localStorage.setItem('codesolver_activity_history', JSON.stringify(historyItems));
  }, [historyItems]);

  useEffect(() => {
    const handleAddNewHistory = (e: Event) => {
      const customEvent = e as CustomEvent<Omit<HistoryItem, 'id' | 'timestamp'>>;
      if (customEvent && customEvent.detail) {
        const newItem: HistoryItem = {
          ...customEvent.detail,
          id: Math.random().toString(36).substring(2, 11),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
        };
        setHistoryItems((prev) => [newItem, ...prev].slice(0, 50));
      }
    };

    window.addEventListener('codesolver_add_history', handleAddNewHistory);
    return () => {
      window.removeEventListener('codesolver_add_history', handleAddNewHistory);
    };
  }, []);
  useEffect(() => {
    localStorage.setItem('codesolver_profile', JSON.stringify(profile));
    if (
      profile?.email?.toLowerCase() === 'bhaveshbnair9@gmail.com' ||
      profile?.fullName?.toLowerCase().includes('bhavesh')
    ) {
      setIsPremium(false);
      setIsAdFree(false);
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('codesolver_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('codesolver_premium', isPremium ? 'true' : 'false');
  }, [isPremium]);

  useEffect(() => {
    localStorage.setItem('codesolver_adfree', isAdFree ? 'true' : 'false');
  }, [isAdFree]);

  // Sync active view triggers to query params so they can simulate multi-page URL routes (convert.html, debug.html etc.)
  const setActiveTab = (tab: AppTab) => {
    const targetTab = tab === 'scan' ? 'book' : tab;
    setActiveTabState(targetTab);
    window.history.pushState(null, '', `?page=${targetTab}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let page = params.get('page') as AppTab;
    if (page) {
      if (page === 'scan') page = 'book';
      setActiveTabState(page);
    }
  }, []);

  // Solve credits rule: Always available
  const useSolveCredit = (): boolean => {
    return true;
  };

  // Profile auth triggers
  const handleAuthSuccess = (profileData: UserProfile) => {
    setProfile(profileData);
    setIsLoggedIn(true);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setProfile({
      fullName: 'Guest Student',
      userType: 'college',
      classYear: '1st Year',
      studyField: 'Web Developer',
    });
    setIsPremium(false);
    setIsAdFree(false);
    setActiveTab('home');
  };

  const handleResetCreditsAndScores = () => {
    // Clear all localStorage keys for the application to wipe premium/profile accounts completely
    localStorage.removeItem('codesolver_profile');
    localStorage.removeItem('codesolver_logged_in');
    localStorage.removeItem('codesolver_premium');
    localStorage.removeItem('codesolver_adfree');
    localStorage.removeItem('codesolver_solves');
    localStorage.removeItem('codesolver_ad_progress');
    localStorage.removeItem('codesolver_activity_history');
    localStorage.removeItem('codesolver_tutorial_answers');
    
    // Dispatch reset event for quiz records
    window.dispatchEvent(new Event('codesolver_reset_quizzes'));

    // Reset components states locally
    setProfile({
      fullName: 'Guest Student',
      userType: 'college',
      classYear: '1st Year',
      studyField: 'Web Developer',
    });
    setIsLoggedIn(false);
    setIsPremium(false);
    setIsAdFree(false);
    setHistoryItems([]);

    // Perform an actual physical browser page reload (reboot) to guarantee a clean cache restart
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  // Open the global Camera OCR Modal and hold the insert callback
  const handleCameraTrigger = (onExtract: (text: string) => void) => {
    setCameraTargetCallback(() => onExtract);
    setCameraModalOpen(true);
  };

  // Tab scanner direct view states helper
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanLoader, setScanLoader] = useState(false);

  const handleMainMenuScan = async () => {
    if (!scanImage) return;
    setScanLoader(true);
    setScanResult(null);
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: scanImage, taskType: 'scan' }),
      });
      const data = await response.json();
      if (response.ok && data.text) {
        setScanResult(data.text);
      } else {
        throw new Error(data.error || 'Transcription output empty');
      }
    } catch (err: any) {
      setScanResult(`Error OCR: ${err.message}`);
    } finally {
      setScanLoader(false);
    }
  };

  // History Helper States & Operations
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyTypeFilter, setHistoryTypeFilter] = useState<'all' | 'solve' | 'convert' | 'debug' | 'tutor'>('all');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [historyCopiedId, setHistoryCopiedId] = useState<string | null>(null);

  const handleCopyHistoryOutput = (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setHistoryCopiedId(id);
    setTimeout(() => {
      setHistoryCopiedId(null);
    }, 2000);
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem('codesolver_activity_history');
    setConfirmClearOpen(false);
  };

  const handleRestoreHistoryItem = (item: HistoryItem) => {
    let targetTab: AppTab = 'home';
    let eventType = 'codesolver_restore_solve';

    if (item.type === 'convert') {
      targetTab = 'convert';
      eventType = 'codesolver_restore_convert';
    } else if (item.type === 'debug') {
      targetTab = 'debug';
      eventType = 'codesolver_restore_debug';
    } else if (item.type === 'tutor') {
      targetTab = 'ai';
      eventType = 'codesolver_restore_tutor';
    }

    setActiveTab(targetTab);
    setHistoryDrawerOpen(false);

    // short delay allows routes transition to complete
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent(eventType, {
          detail: {
            input: item.input,
            output: item.output,
            language: item.language,
            extra: item.extra,
          },
        })
      );
    }, 120);
  };

  const sidebarTabs = [
    { id: 'home' as AppTab, label: 'Home Solver', icon: Sparkles, color: 'text-cyan-400', activeBg: 'bg-cyan-950/20 text-cyan-300 border-cyan-500/20' },
    { id: 'convert' as AppTab, label: 'Code Converter', icon: RefreshCw, color: 'text-indigo-400', activeBg: 'bg-indigo-950/20 text-indigo-300 border-indigo-500/20' },
    { id: 'debug' as AppTab, label: 'Code Debugger', icon: Bug, color: 'text-rose-400', activeBg: 'bg-rose-950/20 text-rose-300 border-rose-500/20' },
    { id: 'ai' as AppTab, label: 'AI Tutor', icon: Bot, color: 'text-fuchsia-400', activeBg: 'bg-fuchsia-950/20 text-fuchsia-300 border-fuchsia-500/20' },
    { id: 'learn' as AppTab, label: 'Learn Hub', icon: GraduationCap, color: 'text-teal-400', activeBg: 'bg-teal-950/20 text-teal-300 border-teal-500/20' },
    { id: 'profile' as AppTab, label: 'Student Profile', icon: UserCircle, color: 'text-pink-400', activeBg: 'bg-pink-950/20 text-pink-300 border-pink-500/20' }
  ];

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 flex flex-col font-sans">
      
      {!isLoggedIn ? (
        /* ONBOARDING & SIGN IN VIEW (Centered responsive card style) */
        <div className="w-full max-w-md mx-auto bg-[#0b0c10] min-h-screen flex flex-col justify-center relative pb-20 border-x border-gray-900/60 shadow-2xl px-6 py-8">
          <div className="flex items-center justify-center space-x-3 mb-10">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-[1.5px] overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-[#0f1117] rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  alt="CodeSolver AI"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                CodeSolver AI
              </h1>
              <p className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">Academic Companion</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key="auth-onboarding-wizard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <AuthView onAuthSuccess={handleAuthSuccess} />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* WIDESCREEN ADAPTIVE WORKSPACE */
        <div className="min-h-screen bg-[#0f1117] flex w-full relative">
          
          {/* FLOATING HISTORY FAB BUTTON (Top Left Corner of the Content Area) */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setHistoryDrawerOpen(true)}
            className="fixed z-40 top-20 left-4 md:top-6 md:left-[276px] lg:left-[308px] w-10 h-10 rounded-full flex items-center justify-center bg-[#131622]/95 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 shadow-lg shadow-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 cursor-pointer animate-[pulse_3s_infinite]"
            title="Activity History"
          >
            <History size={18} />
          </motion.button>

          {/* LEFT VERTICAL SIDE NAVIGATION PANEL (Grid/Sidebar for Medium to Extra-Large displays) */}
          <aside className="hidden md:flex md:w-64 lg:w-72 flex-col fixed left-0 top-0 bottom-0 border-r border-gray-800 bg-[#0b0c10] p-5 justify-between z-30">
            <div className="space-y-6">
              {/* Workspace Brand Group */}
              <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => setActiveTab('home')}>
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-[1.5px] overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-[#0f1117] rounded-xl flex items-center justify-center overflow-hidden relative">
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
                    {!logoLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center text-cyan-400">
                        <AppWindow size={18} />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h1 className="text-sm font-black tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    CodeSolver AI
                  </h1>
                  <p className="text-[10px] text-gray-500 font-mono tracking-tighter">Academic Companion</p>
                </div>
              </div>

              {/* Connected Student Profile Card */}
              <div className="p-4 rounded-2xl bg-[#121620]/80 border border-gray-800/80 space-y-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-xs font-bold leading-none font-sans uppercase">
                    {profile.fullName ? profile.fullName.charAt(0) : 'S'}
                  </div>
                  <div className="truncate flex-1">
                    <h4 className="text-xs font-bold text-gray-200 truncate leading-tight">{profile.fullName}</h4>
                    <p className="text-[9px] text-gray-500 font-mono tracking-wide uppercase mt-0.5">{profile.studyField || 'Student'}</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-gray-800 flex flex-col gap-2">
                  {isPremium ? (
                    <span className="py-1.5 px-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg font-bold flex items-center justify-center space-x-1.5 uppercase text-[9px] tracking-wider shadow-sm animate-pulse">
                      <Award size={11} className="text-amber-450" />
                      <span>Premium VIP Access</span>
                    </span>
                  ) : (
                    <span className="py-1 px-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg font-semibold flex items-center justify-center space-x-1 text-[10px]">
                      <span>Active Student Session</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Sidebar list items */}
              <nav className="space-y-1">
                {sidebarTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center space-x-3 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? `${tab.activeBg} font-extrabold`
                          : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-950/60'
                      }`}
                    >
                      <span className={isActive ? tab.color : 'text-gray-500'}>
                        <Icon size={16} />
                      </span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Footnotes */}
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full py-2 border border-gray-800 hover:bg-rose-950/15 hover:text-rose-450 hover:border-rose-500/25 rounded-xl text-xs text-gray-400 transition duration-200 font-semibold cursor-pointer"
              >
                Sign Out Account
              </button>
            </div>
          </aside>

          {/* RIGHT SIDE MAIN MODULE WRAPPER CONTAINER */}
          <div className="flex-1 flex flex-col min-h-screen md:pl-64 lg:pl-72 pb-[72px] md:pb-8 bg-[#0f1117] relative">
            
            {/* MOBILE ONLY TOP HEADER */}
            <header className="sticky top-0 z-30 flex md:hidden items-center justify-between p-4 bg-[#0f1117]/95 border-b border-gray-800 backdrop-blur-md w-full">
              <div className="flex items-center space-x-2.5 cursor-pointer select-none" onClick={() => isLoggedIn && setActiveTab('home')}>
                <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-[1.5px] overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-[#0f1117] rounded-xl flex items-center justify-center overflow-hidden relative">
                    <img
                      src="/logo.png"
                      alt="CodeSolver AI"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onLoad={() => setLogoLoaded(true)}
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-sm font-black tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    CodeSolver AI
                  </h1>
                  <p className="text-[9px] text-gray-500 font-mono tracking-tighter">Academic Companion</p>
                </div>
              </div>

              {isLoggedIn && (
                <div className="flex items-center space-x-2 text-xs font-sans">
                  {isPremium ? (
                    <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full font-bold flex items-center space-x-1 uppercase text-[9px] tracking-wide shadow-sm animate-pulse">
                      <Award size={10} />
                      <span>Premium VIP</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 block font-semibold text-[10px]">
                      Student Mode
                    </span>
                  )}
                </div>
              )}
            </header>

            {/* MAIN DESKTOP SCROLL INTERACTION */}
            <main className="flex-1 px-4 py-5 md:py-8 space-y-6 font-sans max-w-5xl w-full mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  {/* Home Code Generator */}
                  {activeTab === 'home' && (
                    <HomeSolver
                      onCameraClick={handleCameraTrigger}
                      useSolveCredit={useSolveCredit}
                      isPremium={isPremium}
                      onGoToPremium={() => setActiveTab('profile')}
                    />
                  )}

                  {/* Code Converter */}
                  {activeTab === 'convert' && (
                    <Converter
                      onCameraClick={handleCameraTrigger}
                      useSolveCredit={useSolveCredit}
                      isPremium={isPremium}
                      onGoToPremium={() => setActiveTab('profile')}
                    />
                  )}

                  {/* Code Debugger */}
                  {activeTab === 'debug' && (
                    <Debugger
                      onCameraClick={handleCameraTrigger}
                      isPremium={isPremium}
                      onGoToPremium={() => setActiveTab('profile')}
                    />
                  )}

                  {/* Programming Q&A / Tutor (Combined) */}
                  {activeTab === 'ask' && (
                    <Tutor
                      onCameraClick={handleCameraTrigger}
                      isPremium={isPremium}
                    />
                  )}

                  {/* Textbook Assistant / Learn (Combined) */}
                  {activeTab === 'book' && (
                    <Learn
                      onCameraClick={handleCameraTrigger}
                      isPremium={isPremium}
                    />
                  )}

                  {/* General Subject Tutor */}
                  {activeTab === 'ai' && (
                    <Tutor
                      onCameraClick={handleCameraTrigger}
                      isPremium={isPremium}
                    />
                  )}

                  {/* Beginner Academy Path */}
                  {activeTab === 'learn' && (
                    <Learn
                      onCameraClick={handleCameraTrigger}
                      isPremium={isPremium}
                    />
                  )}

                  {/* Full OCR tab scanner page redirected to Book Study / Learn Hub */}
                  {activeTab === 'scan' && (
                    <Learn
                      onCameraClick={handleCameraTrigger}
                      isPremium={isPremium}
                    />
                  )}

                  {/* Student Profile Setting view */}
                  {activeTab === 'profile' && (
                    <ProfileView
                      profile={profile}
                      setProfile={setProfile}
                      isPremium={isPremium}
                      onLogout={handleLogout}
                      theme={theme}
                      setTheme={setTheme}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* BOTTOM NAV BAR (Hidden on modern desktops) */}
            <div className="block md:hidden">
              <BottomNavBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isPremium={isPremium}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
        </div>
      )}

      {/* UNIVERSAL CAMERA OCR MODAL STREAM DIALOG */}
      <CameraOCRModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onExtractSuccess={(text) => {
          if (cameraTargetCallback) {
            cameraTargetCallback(text);
          }
        }}
        taskType={
          activeTab === 'convert'
            ? 'convert'
            : activeTab === 'debug'
            ? 'debug'
            : activeTab === 'ask'
            ? 'ask'
            : activeTab === 'book'
            ? 'scan'
            : 'solve'
        }
      />

      {/* DYNAMIC ACTIVITY HISTORY OVERLAY SIDE DRAWER */}
      <AnimatePresence>
        {historyDrawerOpen && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-[2px] z-50 cursor-pointer animate-[fade_0.2s]"
            />

            {/* Drawer content panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#0b0c10] border-l border-gray-800 shadow-2xl z-55 flex flex-col font-sans overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-gray-800 bg-[#0f1118]/90 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-cyan-950/50 border border-cyan-500/20 rounded-xl text-cyan-400">
                    <History size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-100 tracking-tight">Personal Solve History</h3>
                    <p className="text-[10px] text-gray-500 mt-1 leading-none">Kept on your local device storage</p>
                  </div>
                </div>
                <button
                  onClick={() => setHistoryDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-850 border border-gray-800 text-gray-400 hover:text-gray-100 transition whitespace-nowrap cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search & Type Filters */}
              <div className="p-4 border-b border-gray-800 bg-[#121620]/20 space-y-3">
                {/* Search */}
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-650">
                    <Search size={14} />
                  </span>
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Search past prompts or generated terms..."
                    className="w-full text-xs pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-200 outline-none focus:border-cyan-500/40"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1">
                  {(['all', 'solve', 'convert', 'debug', 'tutor'] as const).map((tab) => {
                    const active = historyTypeFilter === tab;
                    const labels = {
                      all: 'All Logs',
                      solve: 'Solver',
                      convert: 'Converter',
                      debug: 'Debugger',
                      tutor: 'Tutor Q&A',
                    };
                    return (
                      <button
                        key={tab}
                        onClick={() => {
                          setHistoryTypeFilter(tab);
                          setExpandedHistoryId(null);
                        }}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition cursor-pointer ${
                          active
                            ? 'bg-cyan-950/30 text-cyan-400 border-cyan-500/20'
                            : 'bg-gray-950 border-gray-850 text-gray-400 hover:text-gray-200 hover:bg-gray-900'
                        }`}
                      >
                        {labels[tab]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* List Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {(() => {
                  const listFiltered = historyItems.filter((item) => {
                    if (historyTypeFilter !== 'all' && item.type !== historyTypeFilter) {
                      return false;
                    }
                    if (historySearchQuery) {
                      const q = historySearchQuery.toLowerCase();
                      return (
                        item.title.toLowerCase().includes(q) ||
                        item.input.toLowerCase().includes(q) ||
                        item.output.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  });

                  if (listFiltered.length === 0) {
                    return (
                      <div className="h-48 flex flex-col items-center justify-center text-center space-y-2.5 opacity-60">
                        <div className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-500">
                          <History size={18} />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-gray-300">No matching activities</h5>
                          <p className="text-[10px] text-gray-500 mt-1 max-w-xs leading-normal">
                            Successful requests log here automatically. Submit prompts to save traces!
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return listFiltered.map((item) => {
                    const isExpanded = expandedHistoryId === item.id;
                    const badgeColors = {
                      solve: { bg: 'bg-cyan-950/40 text-cyan-400 border-cyan-500/15', label: 'Generator' },
                      convert: { bg: 'bg-indigo-950/40 text-indigo-400 border-indigo-500/15', label: 'Converter' },
                      debug: { bg: 'bg-rose-955/40 text-rose-400 border-rose-500/15', label: 'Debugger' },
                      tutor: { bg: 'bg-fuchsia-955/40 text-fuchsia-400 border-fuchsia-500/15', label: 'AI Tutor' },
                    }[item.type] || { bg: 'bg-gray-900 text-gray-400 border-gray-800', label: 'Other' };

                    return (
                      <div
                        key={item.id}
                        className={`border rounded-xl transition duration-200 bg-[#12141c]/50 overflow-hidden ${
                          isExpanded ? 'border-gray-700 bg-gray-950/40 shadow-lg' : 'border-gray-850 hover:border-gray-800'
                        }`}
                      >
                        {/* Summary Header block */}
                        <div
                          onClick={() => setExpandedHistoryId(isExpanded ? null : item.id)}
                          className="p-3.5 cursor-pointer flex flex-col gap-2 group select-none"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <span className={`inline-block px-1.5 py-0.5 border text-[8px] font-bold font-mono rounded tracking-normal uppercase leading-none ${badgeColors.bg}`}>
                                {badgeColors.label}
                              </span>
                              <h4 className="text-xs font-bold text-gray-200 line-clamp-1 leading-tight group-hover:text-cyan-400 transition-colors">
                                {item.title}
                              </h4>
                            </div>
                            <span className="text-[9px] text-gray-500 font-mono shrink-0 whitespace-nowrap self-start mt-0.5">
                              {item.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Collateral View Expand details */}
                        {isExpanded && (
                          <div className="border-t border-gray-850 p-3.5 space-y-4 bg-gray-950/20">
                            {/* Input Prompt trace */}
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold font-mono uppercase text-gray-500 tracking-wider">Input Snippet:</span>
                              <div className="p-2.5 bg-gray-950 rounded-lg text-[10px] font-mono text-gray-300 leading-normal border border-gray-900/60 max-h-24 overflow-y-auto select-all whitespace-pre-wrap">
                                {item.input}
                              </div>
                            </div>

                            {/* Output Prompt trace */}
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold font-mono uppercase text-gray-505 tracking-wider">Generated Output:</span>
                              <div className="p-2.5 bg-gray-950 rounded-lg text-[10px] font-mono text-gray-300 leading-relaxed border border-gray-900/60 max-h-40 overflow-y-auto overflow-x-auto select-all whitespace-pre-wrap">
                                {item.output}
                              </div>
                            </div>

                            {/* Row Action bars */}
                            <div className="flex justify-end space-x-2 pt-2 border-t border-gray-800/40">
                              <button
                                onClick={(e) => handleCopyHistoryOutput(e, item.id, item.output)}
                                className="px-2.5 py-1.5 bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-gray-750 text-gray-350 hover:text-gray-100 font-extrabold rounded-lg text-[10px] flex items-center space-x-1 cursor-pointer transition"
                              >
                                {historyCopiedId === item.id ? (
                                  <>
                                    <CheckCircle size={10} className="text-emerald-450" />
                                    <span className="text-emerald-450">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={10} />
                                    <span>Copy Output</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleRestoreHistoryItem(item)}
                                className="px-2.5 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-650 hover:from-cyan-500 hover:to-indigo-500 text-white font-black rounded-lg text-[10px] flex items-center space-x-1 outline-none shadow-sm cursor-pointer transition active:scale-95"
                              >
                                <History size={10} />
                                <span>Restore State</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Clear History Panel Footer control */}
              {historyItems.length > 0 && (
                <div className="p-4 bg-gray-950 border-t border-gray-800 flex flex-col justify-stretch gap-2 z-10">
                  {confirmClearOpen ? (
                    <div className="p-2.5 border border-rose-500/25 rounded-xl bg-rose-950/10 flex items-center justify-between gap-1.5 animate-pulse">
                      <span className="text-[10px] font-bold text-rose-350">Confirm wipe out all history?</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleClearHistory}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded text-[10px] cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmClearOpen(false)}
                          className="px-2.5 py-1 bg-gray-900 border border-gray-800 text-gray-400 rounded text-[10px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmClearOpen(true)}
                      className="w-full py-2.5 bg-rose-950/10 hover:bg-rose-955/20 border border-rose-900/30 text-rose-400 font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 transition cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete All Solve History ({historyItems.length})</span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
