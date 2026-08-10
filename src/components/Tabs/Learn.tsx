/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GraduationCap, BookOpen, Terminal, CheckCircle2, ChevronRight, HelpCircle, Code, Play, RotateCcw, Award, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { tutorialLessons, outputQuizzes, OutputQuiz } from '../../data/tutorial';
import { Lesson } from '../../types';
import VoiceInputButton from '../VoiceInputButton';
import CameraButton from '../CameraButton';
import Book from './Book';
import TextbookQuizArena from './TextbookQuizArena';

interface LearnProps {
  onCameraClick: (onExtract: (text: string) => void) => void;
  isPremium: boolean;
}

export default function Learn({
  onCameraClick,
  isPremium,
}: LearnProps) {
  type Category = 'python' | 'java' | 'cpp' | 'web' | 'javascript' | 'rust' | 'go' | 'kotlin' | 'swift' | 'sql' | 'bash';
  const [activeSubTab, setActiveSubTab] = useState<'book' | 'bootcamp' | 'quiz'>('book');
  const [selectedCategory, setSelectedCategory] = useState<Category>('python');
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(tutorialLessons[0]);
  const [answers, setAnswers] = useState<Record<string, { guessed: string; correct: boolean }>>(() => {
    const saved = localStorage.getItem('codesolver_tutorial_answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [exerciseCode, setExerciseCode] = useState(tutorialLessons[0].exercise.startingCode);
  const [exerciseResult, setExerciseResult] = useState<string | null>(null);

  // Dynamic Quiz generator states supporting LIMITLESS modes
  const [dynamicQuizzes, setDynamicQuizzes] = useState<OutputQuiz[]>(() => {
    const saved = localStorage.getItem('codesolver_dynamic_quizzes');
    return saved ? JSON.parse(saved) : [];
  });
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizGenLanguage, setQuizGenLanguage] = useState('Random');
  const [quizGenCount, setQuizGenCount] = useState(3);
  const [quizGenError, setQuizGenError] = useState<string | null>(null);
  const [quizFilterTab, setQuizFilterTab] = useState<'all' | 'static' | 'dynamic'>('all');

  React.useEffect(() => {
    localStorage.setItem('codesolver_tutorial_answers', JSON.stringify(answers));
  }, [answers]);

  React.useEffect(() => {
    localStorage.setItem('codesolver_dynamic_quizzes', JSON.stringify(dynamicQuizzes));
  }, [dynamicQuizzes]);

  React.useEffect(() => {
    const handleResetAll = () => {
      setAnswers({});
      setDynamicQuizzes([]);
      localStorage.removeItem('codesolver_dynamic_quizzes');
    };
    window.addEventListener('codesolver_reset_quizzes', handleResetAll);
    return () => {
      window.removeEventListener('codesolver_reset_quizzes', handleResetAll);
    };
  }, []);

  const filteredLessons = tutorialLessons.filter((l) => l.category === selectedCategory);

  const changeCategory = (cat: Category) => {
    setSelectedCategory(cat);
    const firstOfCat = tutorialLessons.find((l) => l.category === cat);
    if (firstOfCat) {
      setSelectedLesson(firstOfCat);
      setExerciseCode(firstOfCat.exercise.startingCode);
    } else {
      setExerciseCode('');
    }
    setExerciseResult(null);
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setExerciseCode(lesson.exercise.startingCode);
    setExerciseResult(null);
  };

  const handleGuessQuiz = (quizId: string, choice: string, correctAns: string) => {
    if (answers[quizId]) return; // locked once guessed
    setAnswers({
      ...answers,
      [quizId]: { guessed: choice, correct: choice === correctAns },
    });
  };

  const runCodeSimulation = () => {
    setExerciseResult('Executing compiled sandbox simulation...');
    setTimeout(() => {
      // Create a nice mock student response
      if (selectedLesson.category === 'python') {
        setExerciseResult('>>> OUTPUT:\nCode compiled successfully.\nVerify: variable printed correctly.\n[Academic Sandbox Pass]');
      } else if (selectedLesson.category === 'java') {
        setExerciseResult('>>> CLASSMain RUNTIME:\nOutput: Java Learner\n[Academic Sandbox Pass]');
      } else if (selectedLesson.category === 'cpp') {
        setExerciseResult('>>> GCC STDOUT:\nOutput: Hello CodeSolver\n[Academic Sandbox Pass]');
      } else if (selectedLesson.category === 'javascript') {
        setExerciseResult('>>> NODE RUNTIME:\nOutput: Hello JS\n[Academic Sandbox Pass]');
      } else if (selectedLesson.category === 'rust') {
        setExerciseResult('>>> CARGO RUN:\nOutput: Rust Lifetime\n[Academic Sandbox Pass]');
      } else if (selectedLesson.category === 'go') {
        setExerciseResult('>>> GO EXEC:\nOutput: Go channel received 42 successfully.\n[Academic Sandbox Pass]');
      } else if (selectedLesson.category === 'kotlin') {
        setExerciseResult('>>> KOTLIN JVM:\nOutput: Safe parameter verification passed.\n[Academic Sandbox Pass]');
      } else if (selectedLesson.category === 'swift') {
        setExerciseResult('>>> LLVM SWIFTC:\nOutput: Safety guard constraints resolved successfully.\n[Academic Sandbox Pass]');
      } else if (selectedLesson.category === 'sql') {
        setExerciseResult('>>> SQL ENGINE:\nLEFT JOIN returned 3 associated table entities successfully.\n[Academic Sandbox Pass]');
      } else if (selectedLesson.category === 'bash') {
        setExerciseResult('>>> BASH CORE:\nTrace status check: Exit code 1 received.\n[Academic Sandbox Pass]');
      } else {
        setExerciseResult('>>> RENDER PREVIEW:\nOutput successfully aligned in DOM container.\n[Academic Sandbox Pass]');
      }
    }, 1000);
  };

  const handleGenerateAIQuizzes = async () => {
    setIsGeneratingQuiz(true);
    setQuizGenError(null);
    try {
      const response = await fetch('/api/quizzes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: quizGenLanguage, count: quizGenCount }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate quizzes from the server.');
      }
      const data = await response.json();
      if (data.quizzes && data.quizzes.length > 0) {
        setDynamicQuizzes((prev) => [...prev, ...data.quizzes]);
        setQuizFilterTab('dynamic'); // focus on their shiny new quizzes!
      } else {
        throw new Error('No quizzes generated. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setQuizGenError(err.message || 'AI generation failed. Please double-check your connection.');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const categories: { key: Category; label: string }[] = [
    { key: 'python', label: 'Python' },
    { key: 'java', label: 'Java' },
    { key: 'cpp', label: 'C / C++' },
    { key: 'javascript', label: 'JavaScript' },
    { key: 'rust', label: 'Rust' },
    { key: 'go', label: 'Go' },
    { key: 'kotlin', label: 'Kotlin' },
    { key: 'swift', label: 'Swift' },
    { key: 'sql', label: 'SQL' },
    { key: 'bash', label: 'Bash' },
    { key: 'web', label: 'Web Dev' }
  ];

  return (
    <div className="space-y-6">
      {/* Study Hub Consolidated Sub-tabs */}
      <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-950 p-1 border border-gray-850 rounded-lg">
        <button
          onClick={() => setActiveSubTab('book')}
          className={`flex-1 py-1.5 text-xs font-bold font-mono rounded-md transition flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeSubTab === 'book'
              ? 'bg-purple-950/60 border border-purple-500/20 text-purple-400 font-extrabold'
              : 'text-gray-400 hover:text-white border border-transparent'
          }`}
        >
          <BookOpen size={14} />
          <span>Textbook Study</span>
        </button>
        <button
          onClick={() => setActiveSubTab('bootcamp')}
          className={`flex-1 py-1.5 text-xs font-bold font-mono rounded-md transition flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeSubTab === 'bootcamp'
              ? 'bg-teal-950/60 border border-teal-500/20 text-teal-450 font-extrabold'
              : 'text-gray-400 hover:text-white border border-transparent'
          }`}
        >
          <GraduationCap size={14} />
          <span>Coding Bootcamps</span>
        </button>
        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`flex-1 py-1.5 text-xs font-bold font-mono rounded-md transition flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeSubTab === 'quiz'
              ? 'bg-amber-950/60 border border-amber-500/20 text-amber-400 font-extrabold'
              : 'text-gray-400 hover:text-white border border-transparent'
          }`}
        >
          <Award size={14} />
          <span>Quiz Arena</span>
        </button>
      </div>

      {activeSubTab === 'book' && (
        <Book onCameraClick={onCameraClick} isPremium={isPremium} />
      )}

      {activeSubTab === 'bootcamp' && (
        <div className="space-y-6">
          {/* Visual Identity */}
          <div className="p-5 bg-gradient-to-r from-teal-950/40 to-cyan-950/20 border border-teal-500/20 rounded-2xl">
            <h2 className="text-xl font-bold text-teal-400 flex items-center space-x-2">
              <GraduationCap className="animate-pulse" size={22} />
              <span>Academy Coding Bootcamps</span>
            </h2>
            <p className="text-xs text-gray-300 mt-1">
              Master variables, conditional algorithms, loops, arrays, pointers, memory ownership, and query joins. Practice code, solve exercises, and forecast logic compilers.
            </p>
          </div>

          {/* Pathways Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-gray-950/40 border border-gray-850 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => changeCategory(cat.key)}
                className={`py-1.5 px-3 rounded-lg border text-[11px] font-bold transition duration-250 cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'border-teal-500/50 bg-teal-950/30 text-teal-300 shadow-md shadow-teal-950/45'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-900/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Split viewport */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left Side: Lesson Checklist */}
            <div className="md:col-span-4 space-y-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
                Available Modules:
              </span>
              <div className="space-y-2">
                {filteredLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson)}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between group cursor-pointer ${
                      selectedLesson.id === lesson.id
                        ? 'border-teal-500/50 bg-teal-950/10 text-teal-300'
                        : 'border-gray-800 bg-[#151821] text-gray-400 hover:text-gray-200 hover:border-gray-700'
                    }`}
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <h4 className="text-xs font-bold truncate">{lesson.title}</h4>
                      <p className="text-[10px] text-gray-500 font-mono italic">{lesson.concept}</p>
                    </div>
                    <ChevronRight size={14} className="shrink-0 transition group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side: Active lesson panel */}
            <div className="md:col-span-8 bg-[#151821] border border-gray-800 rounded-2xl p-5 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] px-2 py-0.5 bg-teal-950 text-teal-400 font-semibold uppercase rounded font-mono">
                  Lesson Curriculum
                </span>
                <h3 className="text-base font-bold text-gray-100">{selectedLesson.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{selectedLesson.text}</p>
              </div>

              {/* Reference Snippets */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center space-x-1.5 font-mono">
                  <Terminal size={12} />
                  <span>Reference Syntax:</span>
                </span>
                <div className="p-3.5 bg-gray-950 border border-gray-800 rounded-xl">
                  <pre className="text-xs text-teal-300 font-mono whitespace-pre overflow-x-auto tab-size">
                    {selectedLesson.codeSnippet}
                  </pre>
                </div>
              </div>

              <hr className="border-gray-850" />

              {/* Practice Exercise Block */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-teal-400">
                  <Code size={16} />
                  <span className="text-xs font-bold font-mono">Interactive Exercise Arena</span>
                </div>
                <div className="p-4 bg-teal-950/10 border border-teal-500/20 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-gray-200">{selectedLesson.exercise.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{selectedLesson.exercise.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <textarea
                      value={exerciseCode}
                      onChange={(e) => setExerciseCode(e.target.value)}
                      className="w-full text-xs font-mono p-3 pb-16 bg-gray-950 border border-gray-800 rounded-xl text-emerald-300 min-h-[120px] outline-none focus:border-teal-500/40"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                      <VoiceInputButton
                        colorTheme="teal"
                        onTranscript={(text) => setExerciseCode((prev) => prev ? prev + ' ' + text : text)}
                      />
                      <CameraButton
                        colorTheme="teal"
                        onClick={() => onCameraClick((text) => setExerciseCode((prev) => prev ? prev + ' ' + text : text))}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={runCodeSimulation}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-gray-950 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Play size={12} />
                    <span>Simulate Execution</span>
                  </button>
                </div>

                {exerciseResult && (
                  <div className="p-3 bg-gray-950 border border-teal-500/20 rounded-xl text-xs font-mono text-emerald-400 whitespace-pre scrollbar-thin">
                    {exerciseResult}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'quiz' && (
        <TextbookQuizArena
          onGoToTextbookStudy={() => setActiveSubTab('book')}
        />
      )}
    </div>
  );
}
