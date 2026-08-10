/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RefreshCw, Camera, Copy, Check, Trash2, ArrowRight } from 'lucide-react';
import VoiceInputButton from '../VoiceInputButton';
import CameraButton from '../CameraButton';

interface ConverterProps {
  onCameraClick: (onExtract: (text: string) => void) => void;
  useSolveCredit: () => boolean;
  isPremium: boolean;
  onGoToPremium: () => void;
}

export default function Converter({
  onCameraClick,
  useSolveCredit,
  isPremium,
  onGoToPremium,
}: ConverterProps) {
  const [sourceCode, setSourceCode] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('python');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [convertedCode, setConvertedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    const handleRestore = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.input) {
        setSourceCode(detail.input);
        if (detail.language) {
          setTargetLang(detail.language);
        }
        if (detail.output) {
          setConvertedCode(detail.output);
        }
      }
    };
    window.addEventListener('codesolver_restore_convert', handleRestore);
    return () => window.removeEventListener('codesolver_restore_convert', handleRestore);
  }, []);

  const handleConvert = async () => {
    if (!sourceCode.trim()) return;
    setError(null);

    const allowed = useSolveCredit();
    if (!allowed) return;

    setLoading(true);
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: sourceCode,
          sourceLanguage: sourceLang === 'auto' ? '' : sourceLang,
          targetLanguage: targetLang,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setConvertedCode(data.text);
        window.dispatchEvent(
          new CustomEvent('codesolver_add_history', {
            detail: {
              type: 'convert',
              title: `Convert to ${targetLang.toUpperCase()}`,
              input: sourceCode,
              output: data.text,
              language: targetLang,
            },
          })
        );
      } else {
        throw new Error(data.error || 'Conversion failed on model');
      }
    } catch (err: any) {
      setError(err.message || 'Connecting to converter failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (convertedCode) {
      navigator.clipboard.writeText(convertedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const triggerCameraScanner = () => {
    onCameraClick((extractedText) => {
      setSourceCode(extractedText);
    });
  };

  return (
    <div className="space-y-6">
      {/* Tab Banner */}
      <div className="p-5 bg-gradient-to-r from-indigo-950/40 to-cyan-950/20 border border-indigo-500/20 rounded-2xl">
        <h2 className="text-xl font-bold text-indigo-400 flex items-center space-x-2">
          <RefreshCw className="animate-spin-slow" size={20} />
          <span>Universal Code Converter</span>
        </h2>
        <p className="text-xs text-gray-300 mt-1">
          Instantly convert any script or algorithm from one vocabulary into another. Preserves all logic structures.
        </p>
      </div>

      {/* Input container */}
      <div className="bg-[#151821] border border-gray-800 rounded-2xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-1">
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-bold text-gray-400">Source Language:</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="text-xs bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200 outline-none focus:border-indigo-500/40"
            >
              <option value="auto">Auto-Detect Language</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript / Node</option>
              <option value="java">Java</option>
              <option value="cpp">C++ (GCC)</option>
              <option value="sql">SQL / Databases</option>
              <option value="typescript">TypeScript</option>
              <option value="rust">Rust</option>
              <option value="html/css">HTML/CSS</option>
              <option value="bash">Bash / Shell</option>
            </select>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-bold text-gray-300">Target Language:</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="text-xs bg-gray-950 border border-indigo-500/30 rounded-lg p-2 text-gray-200 font-semibold outline-none focus:border-indigo-500/40"
            >
              <option value="python">Convert to Python</option>
              <option value="javascript">Convert to JavaScript</option>
              <option value="typescript">Convert to TypeScript</option>
              <option value="java">Convert to Java</option>
              <option value="cpp">Convert to C++</option>
              <option value="c">Convert to C</option>
              <option value="rust">Convert to Rust</option>
              <option value="php">Convert to PHP</option>
              <option value="sql">Convert to SQL</option>
              <option value="bash">Convert to Shell Script</option>
            </select>
          </div>
        </div>

        {/* Input Text Box with Camera integration */}
        <div className="relative">
          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            placeholder="Paste your source program or text here..."
            className="w-full min-h-[140px] p-3.5 pb-16 bg-gray-950 border border-gray-800 rounded-xl text-xs font-mono text-indigo-300 placeholder-gray-700 outline-none focus:border-indigo-500/40 resize-y"
          />

          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <VoiceInputButton
              colorTheme="indigo"
              onTranscript={(text) => setSourceCode((prev) => prev ? prev + ' ' + text : text)}
            />
            <CameraButton
              colorTheme="indigo"
              onClick={triggerCameraScanner}
            />
          </div>
        </div>

        {/* Actions panel */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSourceCode('')}
            className="text-[10px] text-gray-500 hover:text-gray-300 flex items-center space-x-1"
          >
            <Trash2 size={12} />
            <span>Clear Grid</span>
          </button>

          <button
            onClick={handleConvert}
            disabled={loading || !sourceCode.trim()}
            className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:bg-gray-800 disabled:text-gray-500 text-gray-950 font-bold rounded-xl flex items-center space-x-2 transition cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Converting Logic...</span>
              </>
            ) : (
              <>
                <span className="text-xs">Convert Code</span>
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

      {/* Output Converted Box */}
      {convertedCode && (
        <div className="bg-[#151821] border border-indigo-500/20 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#0f1117] border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 flex items-center space-x-1.5">
              <RefreshCw size={14} />
              <span>Converted Code output</span>
            </span>

            <button
              onClick={handleCopy}
              className="p-1 px-2.5 text-xs bg-gray-950 hover:bg-gray-900 text-gray-400 hover:text-white border border-gray-800 rounded-lg flex items-center space-x-1.5 transition"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 md:p-6 bg-gray-950/40 text-xs md:text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap space-y-4">
            {convertedCode.split('\n').map((line, idx) => {
              if (line.startsWith('## ') || line.startsWith('### ')) {
                return (
                  <h4 key={idx} className="font-bold text-indigo-300 font-sans text-sm md:text-base mt-2 mb-1">
                    {line.replace(/#/g, '').trim()}
                  </h4>
                );
              }
              const isInfoLine = line.startsWith('-') || line.startsWith('*') || !line.includes(';');
              return (
                <div
                  key={idx}
                  className={isInfoLine ? 'text-gray-400 font-sans text-xs' : 'text-teal-300'}
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
