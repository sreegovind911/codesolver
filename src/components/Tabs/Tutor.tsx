/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bot, Camera, Copy, Check, Send, Sparkles, X } from 'lucide-react';
import VoiceInputButton from '../VoiceInputButton';
import CameraButton from '../CameraButton';

interface TutorProps {
  onCameraClick: (onExtract: (text: string) => void) => void;
  isPremium: boolean;
  onGoToPremium?: () => void;
}

export default function Tutor({
  onCameraClick,
}: TutorProps) {
  // Programming Q&A states
  const [question, setQuestion] = useState(() => localStorage.getItem('codesolver_qa_question') || '');
  const [qaLoading, setQaLoading] = useState(false);
  const [qaError, setQaError] = useState<string | null>(null);
  const [qaAnswer, setQaAnswer] = useState<string | null>(() => localStorage.getItem('codesolver_qa_answer') || null);
  const [qaCopied, setQaCopied] = useState(false);

  // Sync state helpers
  const handleSetQuestion = (val: string) => {
    setQuestion(val);
    localStorage.setItem('codesolver_qa_question', val);
  };
  const handleSetQaAnswer = (val: string | null) => {
    setQaAnswer(val);
    if (val) localStorage.setItem('codesolver_qa_answer', val);
    else localStorage.removeItem('codesolver_qa_answer');
  };

  React.useEffect(() => {
    const handleRestore = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.input) {
        handleSetQuestion(detail.input);
        if (detail.output) handleSetQaAnswer(detail.output);
      }
    };
    window.addEventListener('codesolver_restore_tutor', handleRestore);
    return () => window.removeEventListener('codesolver_restore_tutor', handleRestore);
  }, []);

  const handleAskQA = async () => {
    if (!question.trim()) return;
    setQaError(null);
    setQaLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      if (response.ok) {
        handleSetQaAnswer(data.text);
        window.dispatchEvent(
          new CustomEvent('codesolver_add_history', {
            detail: {
              type: 'tutor',
              title: `Q&A: ${question.trim().slice(0, 30)}${question.trim().length > 30 ? '...' : ''}`,
              input: question,
              output: data.text,
            },
          })
        );
      } else {
        throw new Error(data.error || 'Server Q&A call failed');
      }
    } catch (err: any) {
      setQaError(err.message || 'Connecting to classroom server failed.');
    } finally {
      setQaLoading(false);
    }
  };

  const handleCopyQA = () => {
    if (qaAnswer) {
      navigator.clipboard.writeText(qaAnswer);
      setQaCopied(true);
      setTimeout(() => setQaCopied(false), 2000);
    }
  };

  const triggerCameraScannerQA = () => {
    onCameraClick((extractedText) => {
      handleSetQuestion(extractedText);
    });
  };

  const handleResetWorkspace = () => {
    handleSetQuestion('');
    handleSetQaAnswer(null);
    setQaError(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 bg-gradient-to-r from-emerald-950/40 to-teal-950/20 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-emerald-400 flex items-center space-x-2">
            <Bot className="animate-pulse" size={20} />
            <span>AI Tutor & Q&A</span>
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            Ask any coding, programming, or computer science doubts to get instant step-by-step academic guidance.
          </p>
        </div>

        <button
          onClick={handleResetWorkspace}
          className="text-[10px] text-gray-400 hover:text-white bg-gray-900 border border-gray-800 px-2.5 py-1.5 rounded-lg font-mono flex items-center space-x-1 shrink-0 ml-3 cursor-pointer"
        >
          <X size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Q&A MODE */}
      <div className="space-y-6">
        {/* Input Group */}
        <div className="bg-[#151821] border border-gray-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-300">Type Your Coding or Computer Science Query:</span>
            <button
              onClick={() => handleSetQuestion('')}
              className="text-[10px] text-gray-500 hover:text-gray-300 flex items-center space-x-1 cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Input Text Box with Camera trigger inside */}
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => handleSetQuestion(e.target.value)}
              placeholder="E.g., 'What is time complexity of QuickSort on already sorted arrays?' or 'Explain binary searches in layman terms with visual examples.'"
              className="w-full min-h-[140px] p-3.5 pb-16 bg-gray-950 border border-gray-800 rounded-xl text-xs md:text-sm text-emerald-300 placeholder-gray-700 outline-none focus:border-emerald-500/40 resize-y"
            />

            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <VoiceInputButton
                colorTheme="emerald"
                onTranscript={(text) => handleSetQuestion(question ? question + ' ' + text : text)}
              />
              <CameraButton
                colorTheme="emerald"
                onClick={triggerCameraScannerQA}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={handleAskQA}
              disabled={qaLoading || !question.trim()}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-800 disabled:text-gray-500 text-gray-955 font-bold rounded-xl flex items-center space-x-2 transition cursor-pointer"
            >
              {qaLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Consulting Expert...</span>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold">Ask doubts</span>
                  <Send size={12} />
                </>
              )}
            </button>
          </div>
        </div>

        {qaError && (
          <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl text-rose-300 text-xs text-center">
            {qaError}
          </div>
        )}

        {/* Answer container */}
        {qaAnswer && !qaLoading && (
          <div className="bg-[#151821] border border-emerald-500/20 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-[#0f1117] border-b border-gray-800 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <Sparkles size={14} className="text-emerald-400" />
                <span>Academic Explanation</span>
              </span>

              <button
                onClick={handleCopyQA}
                className="p-1 px-2.5 text-xs bg-gray-950 hover:bg-gray-900 text-gray-400 hover:text-white border border-gray-800 rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
              >
                {qaCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{qaCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto max-h-[500px] text-xs md:text-sm text-gray-300 font-sans leading-relaxed space-y-4">
              {qaAnswer.split('\n').map((line, idx) => {
                if (line.startsWith('## ') || line.startsWith('### ')) {
                  return (
                    <h4 key={idx} className="font-bold text-gray-100 text-sm md:text-base text-emerald-400 mt-4 mb-2">
                      {line.replace(/#/g, '').trim()}
                    </h4>
                  );
                }
                const isNumberedList = /^\d+\./.test(line);
                return (
                  <div
                    key={idx}
                    className={`text-gray-300 ${isNumberedList ? 'pl-2 border-l-2 border-emerald-950 text-gray-200' : ''}`}
                  >
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
