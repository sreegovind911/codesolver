/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bug, Camera, Copy, Check, Trash2, ArrowRight } from 'lucide-react';
import VoiceInputButton from '../VoiceInputButton';
import CameraButton from '../CameraButton';

interface DebuggerProps {
  onCameraClick: (onExtract: (text: string) => void) => void;
  isPremium: boolean;
  onGoToPremium: () => void;
}

export default function Debugger({
  onCameraClick,
  isPremium,
  onGoToPremium,
}: DebuggerProps) {
  const [buggyCode, setBuggyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugResult, setDebugResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    const handleRestore = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.input) {
        setBuggyCode(detail.input);
        if (detail.output) {
          setDebugResult(detail.output);
        }
      }
    };
    window.addEventListener('codesolver_restore_debug', handleRestore);
    return () => window.removeEventListener('codesolver_restore_debug', handleRestore);
  }, []);

  const handleDebug = async () => {
    if (!buggyCode.trim()) return;
    setError(null);

    setLoading(true);
    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: buggyCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setDebugResult(data.text);
        window.dispatchEvent(
          new CustomEvent('codesolver_add_history', {
            detail: {
              type: 'debug',
              title: `Debug: ${buggyCode.trim().slice(0, 30)}${buggyCode.trim().length > 30 ? '...' : ''}`,
              input: buggyCode,
              output: data.text,
            },
          })
        );
      } else {
        throw new Error(data.error || 'Server debugger timed out');
      }
    } catch (err: any) {
      setError(err.message || 'Connecting to AI debugger failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (debugResult) {
      navigator.clipboard.writeText(debugResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const triggerCameraScanner = () => {
    onCameraClick((extractedText) => {
      setBuggyCode(extractedText);
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 bg-gradient-to-r from-rose-950/40 to-indigo-950/20 border border-rose-500/20 rounded-2xl">
        <h2 className="text-xl font-bold text-rose-400 flex items-center space-x-2">
          <Bug className="animate-bounce" size={20} />
          <span>Universal Code Debugger</span>
        </h2>
        <p className="text-xs text-gray-300 mt-1">
          Paste any confusing runtime errors or buggy source code snippets. Our AI compiler will instantly repair it and explain optimizations.
        </p>
      </div>

      {/* Input container */}
      <div className="bg-[#151821] border border-gray-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-300">Paste Broken Code:</span>
          <button
            onClick={() => setBuggyCode('')}
            className="text-[10px] text-gray-500 hover:text-gray-300 flex items-center space-x-1"
          >
            <Trash2 size={12} />
            <span>Clear</span>
          </button>
        </div>

        {/* Input Text Box with Camera icon */}
        <div className="relative">
          <textarea
            value={buggyCode}
            onChange={(e) => setBuggyCode(e.target.value)}
            placeholder="Paste your code with compile issues or bugs here..."
            className="w-full min-h-[140px] p-3.5 pb-16 bg-gray-950 border border-gray-800 rounded-xl text-xs font-mono text-rose-300 placeholder-gray-700 outline-none focus:border-rose-500/40 resize-y"
          />

          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <VoiceInputButton
              colorTheme="rose"
              onTranscript={(text) => setBuggyCode((prev) => prev ? prev + ' ' + text : text)}
            />
            <CameraButton
              colorTheme="rose"
              onClick={triggerCameraScanner}
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={handleDebug}
            disabled={loading || !buggyCode.trim()}
            className="px-6 py-2.5 bg-rose-500 hover:bg-rose-400 disabled:bg-gray-800 disabled:text-gray-500 text-gray-950 font-bold rounded-xl flex items-center space-x-2 transition cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Locating Faults...</span>
              </>
            ) : (
              <>
                <span className="text-xs">Scan and Debug Code</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl text-rose-300 text-xs text-center">
          {error}
        </div>
      )}

      {/* Debug Results Block */}
      {debugResult && (
        <div className="bg-[#151821] border border-rose-500/20 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#0f1117] border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 flex items-center space-x-1.5">
              <Bug size={14} />
              <span>Diagnostic Report & Corrections</span>
            </span>

            <button
              onClick={handleCopy}
              className="p-1 px-2.5 text-xs bg-gray-950 hover:bg-gray-900 text-gray-400 hover:text-white border border-gray-800 rounded-lg flex items-center space-x-1.5 transition"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? 'Copied Report' : 'Copy Report'}</span>
            </button>
          </div>

          <div className="p-4 md:p-6 overflow-x-auto whitespace-pre-wrap text-xs md:text-sm text-gray-300 font-sans leading-relaxed space-y-4">
            {debugResult.split('\n').map((line, idx) => {
              if (line.startsWith('## ') || line.startsWith('### ') || line.startsWith('**')) {
                return (
                  <h4 key={idx} className="font-bold text-gray-100 text-sm md:text-base text-rose-300 mt-4 mb-2">
                    {line.replace(/[#*]/g, '').trim()}
                  </h4>
                );
              }
              if (line.startsWith('🐞') || line.startsWith('🛠️') || line.startsWith('📈')) {
                return (
                  <h3 key={idx} className="font-bold text-white text-base border-b border-gray-800 pb-1 mt-6 mb-3">
                    {line}
                  </h3>
                );
              }
              const isCodeLine = line.includes('def ') || line.includes('import ') || line.includes('class ') || line.includes('const ') || line.startsWith('    ') || line.startsWith('\t');
              return (
                <div
                  key={idx}
                  className={
                    isCodeLine
                      ? 'font-mono text-xs text-cyan-300 bg-gray-950/70 p-1 px-2 rounded font-semibold'
                      : 'text-gray-300 font-sans text-xs'
                  }
                >
                  {line}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
