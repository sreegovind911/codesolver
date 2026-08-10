/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  colorTheme?: 'emerald' | 'cyan' | 'purple' | 'indigo' | 'rose' | 'fuchsia' | 'teal';
}

export default function VoiceInputButton({
  onTranscript,
  className = '',
  colorTheme = 'cyan',
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setErrorMsg(null);
    }, 3500);
  };

  const toggleListening = async () => {
    setErrorMsg(null);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!supported || !SpeechRecognition) {
      triggerError("Voice recognition is not available on this device.");
      return;
    }
    
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
    } else {
      // First ensure microphone permission is prompted / requested via getUserMedia
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((track) => track.stop());
        } catch (err: any) {
          console.warn("Microphone permission check failed:", err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            triggerError("Microphone permission is required for voice input.");
          } else {
            triggerError("Voice recognition is not available on this device.");
          }
          return;
        }
      }

      try {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0]?.transcript;
          if (transcript) {
            onTranscript(transcript);
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            triggerError("Microphone permission is required for voice input.");
          } else if (event.error === 'no-speech') {
            triggerError("No speech detected. Please speak clearly.");
          } else if (event.error === 'audio-capture') {
            triggerError("Microphone not detected or in use by another app.");
          } else {
            triggerError("Voice recognition is not available on this device.");
          }
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
        rec.start();
      } catch (err: any) {
        console.error("Failed to start speech recognition:", err);
        triggerError("Voice recognition is not available on this device.");
        setIsListening(false);
      }
    }
  };

  const themeMap = {
    cyan: {
      active: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500 animate-pulse',
      idle: 'bg-white hover:bg-gray-100 dark:bg-cyan-950/70 dark:hover:bg-cyan-900 border-gray-200 dark:border-cyan-500/30 text-emerald-600 dark:text-cyan-400',
    },
    emerald: {
      active: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500 animate-pulse',
      idle: 'bg-white hover:bg-gray-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900 border-gray-200 dark:border-emerald-400/30 text-emerald-600 dark:text-emerald-400',
    },
    purple: {
      active: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500 animate-pulse',
      idle: 'bg-white hover:bg-gray-100 dark:bg-purple-950/70 dark:hover:bg-purple-900 border-gray-200 dark:border-purple-400/30 text-emerald-600 dark:text-purple-400',
    },
    indigo: {
      active: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500 animate-pulse',
      idle: 'bg-white hover:bg-gray-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 border-gray-200 dark:border-indigo-500/30 text-emerald-600 dark:text-indigo-400',
    },
    rose: {
      active: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500 animate-pulse',
      idle: 'bg-white hover:bg-gray-100 dark:bg-rose-950/70 dark:hover:bg-rose-900 border-gray-200 dark:border-rose-400/30 text-emerald-600 dark:text-rose-400',
    },
    fuchsia: {
      active: 'bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500 animate-pulse',
      idle: 'bg-white hover:bg-gray-100 dark:bg-fuchsia-950/70 dark:hover:bg-fuchsia-900 border-gray-200 dark:border-fuchsia-400/30 text-emerald-600 dark:text-fuchsia-400',
    },
    teal: {
      active: 'bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500 animate-pulse',
      idle: 'bg-white hover:bg-gray-100 dark:bg-teal-950/70 dark:hover:bg-teal-900 border-gray-200 dark:border-teal-500/30 text-emerald-600 dark:text-teal-400',
    },
  };

  const activeTheme = themeMap[colorTheme] || themeMap.cyan;

  return (
    <div className="relative inline-block">
      {errorMsg && (
        <div className="absolute bottom-full right-0 mb-1.5 z-50 whitespace-nowrap px-3 py-1.5 bg-red-600 text-white dark:bg-rose-900 dark:text-rose-100 rounded-lg text-xs font-medium shadow-md flex items-center gap-1.5 animate-[fadeIn_0.15s_ease-out]">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      <button
        onClick={toggleListening}
        type="button"
        title={isListening ? "Listening... click to stop" : "Voice Input (Speech-to-text)"}
        className={`p-2 border rounded-xl flex items-center justify-center transition cursor-pointer group ${
          isListening ? activeTheme.active : activeTheme.idle
        } ${className}`}
      >
        {isListening ? (
          <div className="flex items-center space-x-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <MicOff size={14} className="animate-pulse" />
          </div>
        ) : (
          <Mic size={14} className="group-hover:scale-110 transition" />
        )}
      </button>
    </div>
  );
}

