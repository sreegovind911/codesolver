/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, RefreshCw, Bug, Bot, Award, GraduationCap, UserCircle } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavBarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isPremium: boolean;
  isLoggedIn: boolean;
}

export default function BottomNavBar({
  activeTab,
  setActiveTab,
  isPremium,
  isLoggedIn,
}: BottomNavBarProps) {
  const tabs = [
    { id: 'home' as AppTab, label: 'Home', icon: Home, color: 'text-cyan-400' },
    { id: 'convert' as AppTab, label: 'Convert', icon: RefreshCw, color: 'text-indigo-400' },
    { id: 'debug' as AppTab, label: 'Debug', icon: Bug, color: 'text-rose-400' },
    { id: 'ai' as AppTab, label: 'AI Tutor', icon: Bot, color: 'text-fuchsia-400' },
    { id: 'learn' as AppTab, label: 'Learn Hub', icon: GraduationCap, color: 'text-teal-400' },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f1117]/95 border-t border-gray-800 backdrop-blur-md pb-safe"
    >
      <div className="w-full max-w-lg mx-auto px-1 py-1 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 flex flex-col items-center justify-center transition-all duration-200 relative rounded-xl ${
                isActive
                  ? 'text-gray-100 scale-110 font-bold bg-white/[0.03]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full"></span>
              )}
              <div className={`p-1 rounded-lg ${isActive ? tab.color : ''}`}>
                <Icon size={19} className="stroke-[2px]" />
              </div>
              <span className="text-[9px] mt-0.5 tracking-tight hidden md:inline truncate max-w-full">
                {tab.label}
              </span>
              <span className="text-[8px] mt-0.5 tracking-tighter md:hidden truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Global profile indicator / toggle button */}
        <button
          onClick={() => setActiveTab(isLoggedIn ? 'profile' : 'login')}
          className={`px-1.5 py-1 flex flex-col items-center justify-center transition rounded-xl ${
            activeTab === 'profile' || activeTab === 'login' || activeTab === 'signup'
              ? 'text-pink-400 scale-110 bg-white/[0.03]'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {isPremium ? (
            <div className="relative">
              <Award size={19} className="text-amber-400 stroke-[2px]" />
              <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
            </div>
          ) : (
            <UserCircle size={19} className="stroke-[2.5px]" />
          )}
          <span className="text-[8px] md:text-[9px] mt-0.5 tracking-tight truncate max-w-full">
            {isLoggedIn ? 'Profile' : 'Sign In'}
          </span>
        </button>
      </div>
    </nav>
  );
}
