/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BookOpen, Camera, Copy, Check, Sparkles, BookMarked, HelpCircle, GraduationCap, Upload, X, ArrowRight, MessageSquareCode } from 'lucide-react';
import VoiceInputButton from '../VoiceInputButton';
import CameraButton from '../CameraButton';

interface BookProps {
  onCameraClick: (onExtract: (text: string) => void) => void;
  isPremium: boolean;
}

export default function Book({
  onCameraClick,
  isPremium,
}: BookProps) {
  // Shared states for textbook workspace
  const [bookName, setBookName] = useState(() => localStorage.getItem('codesolver_tb_name') || '');
  const [bookImage, setBookImage] = useState<string | null>(() => localStorage.getItem('codesolver_tb_image') || null);
  const [userQuery, setUserQuery] = useState(() => localStorage.getItem('codesolver_tb_query') || '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookResponse, setBookResponse] = useState<string | null>(() => localStorage.getItem('codesolver_tb_response') || null);
  const [responseTask, setResponseTask] = useState<'syllabus_questions' | 'doubt_resolution' | null>(() => {
    return (localStorage.getItem('codesolver_tb_response_task') as any) || null;
  });
  
  const [copied, setCopied] = useState(false);

  // Sync state changes to storage
  useEffect(() => {
    localStorage.setItem('codesolver_tb_name', bookName);
  }, [bookName]);

  useEffect(() => {
    if (bookImage) {
      localStorage.setItem('codesolver_tb_image', bookImage);
    } else {
      localStorage.removeItem('codesolver_tb_image');
    }
  }, [bookImage]);

  useEffect(() => {
    localStorage.setItem('codesolver_tb_query', userQuery);
  }, [userQuery]);

  useEffect(() => {
    if (bookResponse) {
      localStorage.setItem('codesolver_tb_response', bookResponse);
    } else {
      localStorage.removeItem('codesolver_tb_response');
    }
  }, [bookResponse]);

  useEffect(() => {
    if (responseTask) {
      localStorage.setItem('codesolver_tb_response_task', responseTask);
    } else {
      localStorage.removeItem('codesolver_tb_response_task');
    }
  }, [responseTask]);

  // Combined textbook analyzer trigger
  const handleAnalyzeTextbook = async (task: 'syllabus_questions' | 'doubt_resolution') => {
    if (!bookImage && !bookName.trim() && task === 'syllabus_questions') {
      setError('Please provide a textbook snap/photo or type the textbook reference name first.');
      return;
    }
    if (task === 'doubt_resolution' && !userQuery.trim()) {
      setError('Please enter your specific question or doubt about the book.');
      return;
    }

    setError(null);
    setLoading(true);
    setBookResponse(null);
    setResponseTask(task);

    try {
      const response = await fetch('/api/book/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: bookImage,
          bookName: bookName,
          query: userQuery,
          task: task,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setBookResponse(data.text);
      } else {
        throw new Error(data.error || 'Server processing failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Connecting to textbook assistant failed.');
      setResponseTask(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (bookResponse) {
      navigator.clipboard.writeText(bookResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Trigger camera flow
  const triggerCameraScanner = () => {
    onCameraClick((extractedText) => {
      // In the combined interface, if they snap an image, we can pre-populate the textbook name or search context
      if (extractedText) {
        setBookName((prev) => prev ? prev + '\n' + extractedText : extractedText);
      }
    });
  };

  // Handle local file selection for snap OCR
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearAll = () => {
    setBookName('');
    setBookImage(null);
    setUserQuery('');
    setBookResponse(null);
    setResponseTask(null);
    setError(null);
    localStorage.removeItem('codesolver_tb_name');
    localStorage.removeItem('codesolver_tb_image');
    localStorage.removeItem('codesolver_tb_query');
    localStorage.removeItem('codesolver_tb_response');
    localStorage.removeItem('codesolver_tb_response_task');
  };

  return (
    <div className="space-y-6">
      {/* Visual Identity banner */}
      <div className="p-5 bg-gradient-to-r from-purple-950/40 to-indigo-950/20 border border-purple-500/20 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <h2 className="text-xl font-bold text-purple-400 flex items-center space-x-2">
          <BookOpen className="animate-pulse text-purple-400" size={20} />
          <span>Textbook Scan & Doubt Study Hub</span>
        </h2>
        <p className="text-xs text-gray-300 mt-1">
          Combine standard scans, photos, or titles to check any book's syllabus, generate related practice questions, or clear your exact homework doubts!
        </p>
      </div>

      {/* Input / Scanner Workspace */}
      <div className="bg-[#151821] border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-b border-gray-850 pb-2">
          <span className="font-bold text-purple-300 uppercase tracking-widest text-[9px]">Textbook Scan Credentials</span>
          <button
            onClick={handleClearAll}
            className="text-[10px] text-gray-500 hover:text-gray-300 transition flex items-center space-x-1"
          >
            <X size={10} />
            <span>Reset Workspace</span>
          </button>
        </div>

        {/* Dual Input Area: Upload Image or Refer Book Name */}
        <div className="grid grid-cols-1 gap-4">
          
          {/* Section A: Multi-modal Textbook Cover/Page Scan (from Scan Page) */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center space-x-1.5">
              <Camera size={11} className="text-purple-400" />
              <span>Step 1: Snap Textbook Cover / Page or Upload Image (Optional)</span>
            </label>

            {!bookImage ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Drag / Upload Button */}
                <label className="border border-dashed border-gray-800 hover:border-purple-500/40 rounded-xl p-3 bg-gray-950/60 flex items-center justify-center space-x-2.5 cursor-pointer transition group">
                  <Upload size={16} className="text-purple-400 group-hover:scale-110 transition shrink-0" />
                  <div className="text-left">
                    <span className="text-xs font-semibold text-gray-200 block">Upload book page snap</span>
                    <p className="text-[8px] text-gray-500">Supports JPG, PNG or HEIC</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>

                {/* Instant Camera Stream Button */}
                <button
                  type="button"
                  onClick={triggerCameraScanner}
                  className="border border-dashed border-gray-800 hover:border-purple-500/40 rounded-xl p-3 bg-gray-950/60 flex items-center justify-center space-x-2.5 transition group cursor-pointer text-left"
                >
                  <Camera size={16} className="text-purple-450 group-hover:scale-110 transition shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-gray-200 block">Launch OCR camera</span>
                    <p className="text-[8px] text-gray-500">Snap page text automatically</p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="relative aspect-video bg-black/60 rounded-xl overflow-hidden border border-purple-500/10 flex items-center justify-center p-2 max-h-40">
                <img
                  src={bookImage}
                  alt="Scanned Textbook Snapshot"
                  className="max-h-full max-w-full object-contain rounded"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setBookImage(null)}
                  type="button"
                  title="Remove snapshot"
                  className="absolute top-2 right-2 p-1.5 bg-gray-950/90 rounded-full text-gray-450 hover:text-white border border-gray-850 hover:border-rose-500/30 transition shadow"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Section B: Textbook Name or Referenced Title Input */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center space-x-1.5">
              <BookOpen size={11} className="text-purple-400" />
              <span>Step 2: Enter Textbook Title / Reference</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                placeholder="e.g. Concept of Physics by H.C. Verma Vol 1 (or leave blank if cover contains text)"
                className="w-full p-2.5 bg-gray-950 border border-gray-850 rounded-xl text-xs text-purple-300 placeholder-gray-700 outline-none focus:border-purple-500/40 font-sans"
              />
            </div>
          </div>

          <div className="border-t border-gray-850 pt-3 space-y-3">
            {/* Action 1: Syllabus and Related Questions Trigger */}
            <div className="p-3 bg-indigo-950/15 border border-indigo-500/10 rounded-xl flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-indigo-300 flex items-center space-x-1">
                  <GraduationCap size={13} />
                  <span>Interactive Textbook Syllabus & Practice exams</span>
                </span>
                <p className="text-[10px] text-gray-400 leading-tight">
                  AI will list the textbook syllabus framework and supply related standard practice questions instantly.
                </p>
              </div>
              
              <button
                type="button"
                onClick={() => handleAnalyzeTextbook('syllabus_questions')}
                disabled={loading}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition shrink-0 flex items-center space-x-1 shadow-md cursor-pointer"
              >
                <span>Get Syllabus & Qs</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Action 2: Dynamic doubt query and Resolution */}
            <div className="border border-gray-850 bg-gray-950/40 rounded-xl p-3.5 space-y-2.5">
              <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1">
                <MessageSquareCode size={12} />
                <span>Textbook Doubt Solver: Clear any homework questions or concepts</span>
              </label>

              <div className="relative">
                <textarea
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Ask any doubt about the scanned page or book (e.g. 'Can you explain the formula on friction in chapter 3 and code its simulation?')"
                  className="w-full min-h-[70px] max-h-[140px] p-2.5 pb-10 bg-gray-950 border border-gray-850 rounded-xl text-xs text-indigo-300 placeholder-gray-700 outline-none focus:border-teal-500/40 resize-y"
                />
                
                <div className="absolute bottom-2.5 right-2.5 flex items-center space-x-2">
                  <VoiceInputButton
                    colorTheme="indigo"
                    onTranscript={(text) => setUserQuery((prev) => prev ? prev + ' ' + text : text)}
                  />
                  <CameraButton
                    colorTheme="indigo"
                    onClick={triggerCameraScanner}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleAnalyzeTextbook('doubt_resolution')}
                  disabled={loading || !userQuery.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-550 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 cursor-pointer"
                >
                  <Sparkles size={11} className="text-white" />
                  <span>Solve Textbook Doubt</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="p-6 bg-purple-950/10 border border-purple-500/10 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-purple-300 animate-pulse font-medium">Textbook Assistant processing content...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl text-rose-300 text-xs text-center font-medium">
          {error}
        </div>
      )}

      {/* Results output view */}
      {bookResponse && !loading && (
        <div className="bg-[#151821] border border-purple-500/20 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#0f1117] border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 flex items-center space-x-1.5 font-mono">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>
                {responseTask === 'syllabus_questions'
                  ? 'Syllabus & Practice Questions Output'
                  : 'Textbook Doubt Resolution Outcome'}
              </span>
            </span>

            <button
              onClick={handleCopy}
              className="p-1 px-2.5 text-[10px] sm:text-xs bg-gray-950 hover:bg-gray-900 text-gray-400 hover:text-white border border-gray-800 rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 md:p-6 overflow-y-auto max-h-[500px] text-xs md:text-sm text-gray-300 font-sans leading-relaxed space-y-4">
            {bookResponse.split('\n').map((line, idx) => {
              if (line.startsWith('## ') || line.startsWith('### ')) {
                return (
                  <h4 key={idx} className="font-bold text-purple-400 text-sm md:text-base mt-4 mb-2 first:mt-0">
                    {line.replace(/#/g, '').trim()}
                  </h4>
                );
              }
              
              if (line.startsWith('# ')) {
                return (
                  <h3 key={idx} className="font-black text-gray-100 text-base md:text-lg border-b border-gray-850 pb-1.5 mt-5 mb-3">
                    {line.replace(/#/g, '').trim()}
                  </h3>
                );
              }

              const isListItem = line.trim().startsWith('-') || line.trim().startsWith('*');
              
              return (
                <div
                  key={idx}
                  className={`text-gray-300 ${
                    isListItem
                      ? 'text-gray-250 bg-white/[0.01] p-1 py-0.5 rounded my-1 pl-3 border-l border-purple-500/30'
                      : ''
                  }`}
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
