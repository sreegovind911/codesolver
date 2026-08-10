/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Camera, Copy, Check, Info, Trash2, ArrowRight } from 'lucide-react';
import VoiceInputButton from '../VoiceInputButton';
import CameraButton from '../CameraButton';

interface HomeSolverProps {
  onCameraClick: (onExtract: (text: string) => void) => void;
  useSolveCredit: () => boolean;
  isPremium: boolean;
  onGoToPremium: () => void;
}

export default function HomeSolver({
  onCameraClick,
  useSolveCredit,
  isPremium,
  onGoToPremium,
}: HomeSolverProps) {
  const [problemPrompt, setProblemPrompt] = useState('');
  const [language, setLanguage] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseHtml, setResponseHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    const handleRestore = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.input) {
        setProblemPrompt(detail.input);
        if (detail.language) {
          setLanguage(detail.language);
        }
        if (detail.output) {
          setResponseHtml(detail.output);
        }
      }
    };
    window.addEventListener('codesolver_restore_solve', handleRestore);
    return () => window.removeEventListener('codesolver_restore_solve', handleRestore);
  }, []);

  const handleSolve = async () => {
    if (!problemPrompt.trim()) return;
    setError(null);

    // Deduct credit check
    const allowed = useSolveCredit();
    if (!allowed) return; // parent handles notifications or triggers popups

    setLoading(true);
    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: problemPrompt, language }),
      });

      const data = await response.json();
      if (response.ok) {
        setResponseHtml(data.text);
        window.dispatchEvent(
          new CustomEvent('codesolver_add_history', {
            detail: {
              type: 'solve',
              title: problemPrompt.trim().slice(0, 45) + (problemPrompt.trim().length > 45 ? '...' : ''),
              input: problemPrompt,
              output: data.text,
              language: language === 'auto' ? 'Auto-Detect' : language,
            },
          })
        );
      } else {
        throw new Error(data.error || 'Server rejected request');
      }
    } catch (err: any) {
      setError(err.message || 'Connecting to solver failed. Check network.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (responseHtml) {
      navigator.clipboard.writeText(responseHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const triggerCameraScanner = () => {
    onCameraClick((extractedText) => {
      setProblemPrompt(extractedText);
    });
  };

  return (
    <div className="space-y-6">
      {/* Visual Identity */}
      <div className="p-5 bg-gradient-to-r from-cyan-950/40 to-indigo-950/20 border border-cyan-500/20 rounded-2xl">
        <h2 className="text-xl font-bold text-cyan-400 flex items-center space-x-2">
          <Sparkles className="animate-pulse" size={20} />
          <span>AI Code Generator</span>
        </h2>
        <p className="text-xs text-gray-300 mt-1">
          Paste any homework program description, pseudocode description, or CS question to generate correct, complete, copyable solutions!
        </p>
      </div>

      {/* Input container */}
      <div className="bg-[#151821] border border-gray-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-gray-300">Target Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs bg-gray-950 border border-gray-800 rounded-lg py-1 px-2.5 text-gray-200 outline-none focus:border-cyan-500/40"
            >
              <option value="auto">Auto-Detect Language</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript / TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C / C++ (GCC)</option>
              <option value="rust">Rust</option>
              <option value="html/css">HTML / CSS</option>
              <option value="sql">SQL / Postgres</option>
            </select>
          </div>

          <button
            onClick={() => setProblemPrompt('')}
            title="Clear text field"
            className="p-1 px-2 text-[10px] text-gray-500 hover:text-gray-300 flex items-center space-x-1"
          >
            <Trash2 size={12} />
            <span>Clear</span>
          </button>
        </div>

        {/* Input box with Camera inside input field */}
        <div className="relative">
          <textarea
            value={problemPrompt}
            onChange={(e) => setProblemPrompt(e.target.value)}
            placeholder="Type your homework puzzle here... E.g., 'Write a python script that searches binary files recursively and logs mismatch counts'"
            className="w-full min-h-[140px] p-3.5 pb-16 bg-gray-950 hover:bg-gray-950/80 border border-gray-800 rounded-xl text-xs md:text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-cyan-500/40 resize-y"
          />

          {/* Floating unified camera container trigger */}
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <VoiceInputButton
              colorTheme="cyan"
              onTranscript={(text) => setProblemPrompt((prev) => prev ? prev + ' ' + text : text)}
            />
            <CameraButton
              colorTheme="cyan"
              onClick={triggerCameraScanner}
            />
          </div>
        </div>

        {/* Solve Status & Submit Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Info size={14} className="text-gray-500" />
            <span>AI Code & Logic Solver Engine</span>
          </div>

          <button
            onClick={handleSolve}
            disabled={loading || !problemPrompt.trim()}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-800 disabled:text-gray-500 text-gray-950 font-bold rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Generating Solution...</span>
              </>
            ) : (
              <>
                <span className="text-xs">Generate Solution</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Connection Errors */}
      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl text-rose-300 text-xs text-center">
          {error}
        </div>
      )}

      {/* Response Box */}
      {responseHtml && (
        <div className="bg-[#151821] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#0f1117] border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center space-x-1.5">
              <Sparkles size={14} />
              <span>Generated Solution Output</span>
            </span>

            <button
              onClick={handleCopy}
              className="p-1 px-2.5 text-xs bg-gray-950 hover:bg-gray-900 text-gray-400 hover:text-white border border-gray-800 rounded-lg flex items-center space-x-1.5 transition"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div id="solver-result-md" className="p-4 md:p-6 overflow-x-auto whitespace-pre-wrap text-xs md:text-sm text-gray-300 font-sans leading-relaxed space-y-4">
            {/* Simple formatted sections by splitting headers just to make a superb readable student experience */}
            {responseHtml.split('\n').map((line, idx) => {
              if (line.startsWith('## ') || line.startsWith('### ') || line.startsWith('**')) {
                return (
                  <h4 key={idx} className="font-bold text-gray-100 text-sm md:text-base text-cyan-300 mt-4 mb-2">
                    {line.replace(/[#*]/g, '').trim()}
                  </h4>
                );
              }
              if (line.startsWith('🎯') || line.startsWith('🧠') || line.startsWith('🚀')) {
                return (
                  <h3 key={idx} className="font-bold text-white text-base border-b border-gray-800 pb-1 mt-6 mb-3">
                    {line}
                  </h3>
                );
              }
              if (line.startsWith('```')) {
                // Skips lines with ticks but styles code cleanly
                return null;
              }
              const isCodeLine = line.includes('def ') || line.includes('import ') || line.includes('public class ') || line.includes('const ') || line.includes('cout <<') || line.startsWith('    ') || line.startsWith('\t');
              return (
                <div
                  key={idx}
                  className={
                    isCodeLine
                      ? 'font-mono text-xs text-teal-300 bg-gray-950/70 px-2 py-0.5 rounded'
                      : 'text-gray-300'
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
