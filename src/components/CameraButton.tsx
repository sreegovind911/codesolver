/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Camera } from 'lucide-react';

interface CameraButtonProps {
  onClick: () => void;
  className?: string;
  colorTheme?: 'cyan' | 'emerald' | 'purple' | 'indigo' | 'rose' | 'fuchsia' | 'teal';
  title?: string;
}

export default function CameraButton({
  onClick,
  className = '',
  colorTheme = 'cyan',
  title = "Snap code or textbook question with camera"
}: CameraButtonProps) {
  const themeMap = {
    cyan: 'bg-white hover:bg-gray-100 dark:bg-cyan-950/70 dark:hover:bg-cyan-900 border-gray-200 dark:border-cyan-500/30 text-emerald-600 dark:text-cyan-400',
    emerald: 'bg-white hover:bg-gray-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900 border-gray-200 dark:border-emerald-400/30 text-emerald-600 dark:text-emerald-400',
    purple: 'bg-white hover:bg-gray-100 dark:bg-purple-950/70 dark:hover:bg-purple-900 border-gray-200 dark:border-purple-400/30 text-emerald-600 dark:text-purple-400',
    indigo: 'bg-white hover:bg-gray-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 border-gray-200 dark:border-indigo-500/30 text-emerald-600 dark:text-indigo-400',
    rose: 'bg-white hover:bg-gray-100 dark:bg-rose-950/70 dark:hover:bg-rose-900 border-gray-200 dark:border-rose-400/30 text-emerald-600 dark:text-rose-400',
    fuchsia: 'bg-white hover:bg-gray-100 dark:bg-fuchsia-950/70 dark:hover:bg-fuchsia-900 border-gray-200 dark:border-fuchsia-400/30 text-emerald-600 dark:text-fuchsia-400',
    teal: 'bg-white hover:bg-gray-100 dark:bg-teal-950/70 dark:hover:bg-teal-900 border-gray-200 dark:border-teal-500/30 text-emerald-600 dark:text-teal-400',
  };

  const themeClass = themeMap[colorTheme] || themeMap.cyan;

  return (
    <button
      onClick={onClick}
      type="button"
      title={title}
      className={`p-2 border rounded-xl flex items-center justify-center transition cursor-pointer group ${themeClass} ${className}`}
    >
      <Camera size={14} className="group-hover:scale-110 transition" />
    </button>
  );
}
