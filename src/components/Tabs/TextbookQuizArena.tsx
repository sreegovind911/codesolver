/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  BookMarked,
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  RefreshCw,
  AlertCircle,
  FileText,
  Layers,
  ArrowLeft,
  Code
} from 'lucide-react';
import { outputQuizzes, OutputQuiz } from '../../data/tutorial';

export interface TextbookQuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_in_blank' | 'concept_based';
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  chapter: string;
}

interface TextbookQuizArenaProps {
  onGoToTextbookStudy: () => void;
}

export default function TextbookQuizArena({
  onGoToTextbookStudy,
}: TextbookQuizArenaProps) {
  // Read active textbook parameters from localStorage
  const [bookName, setBookName] = useState(() => localStorage.getItem('codesolver_tb_name') || '');
  const [bookImage, setBookImage] = useState<string | null>(() => localStorage.getItem('codesolver_tb_image') || null);
  const [bookResponse, setBookResponse] = useState<string | null>(() => localStorage.getItem('codesolver_tb_response') || null);

  // Sync state if localStorage changes
  useEffect(() => {
    const syncTextbookState = () => {
      setBookName(localStorage.getItem('codesolver_tb_name') || '');
      setBookImage(localStorage.getItem('codesolver_tb_image') || null);
      setBookResponse(localStorage.getItem('codesolver_tb_response') || null);
    };

    window.addEventListener('storage', syncTextbookState);
    syncTextbookState();
    return () => window.removeEventListener('storage', syncTextbookState);
  }, []);

  // Quiz state management
  const categories = ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Mixed Quiz', 'Revision Quiz'];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [questions, setQuestions] = useState<TextbookQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, { selected: string; correct: boolean }>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Secondary Programming Quizzes toggle (kept separate per requirement 12)
  const [showProgrammingQuizzes, setShowProgrammingQuizzes] = useState(false);
  const [progAnswers, setProgAnswers] = useState<Record<string, { guessed: string; correct: boolean }>>({});

  const hasTextbook = !!(bookName.trim() || bookImage || bookResponse);

  // Fallback textbook question generator
  const generateFallbackTextbookQuestions = (
    bookTitle: string,
    content: string,
    chapter: string
  ): TextbookQuizQuestion[] => {
    const cleanTitle = bookTitle.trim() || 'Scanned Textbook';

    if (chapter === 'Chapter 1') {
      return [
        {
          id: 'fb_1_1',
          type: 'multiple_choice',
          questionNumber: 1,
          question: `What is the primary topic covered in Chapter 1 of "${cleanTitle}"?`,
          options: [
            'Foundational definitions, core principles, and basic terminology',
            'Advanced multi-variable calculus equations',
            'Historical timeline of unrelated non-academic events',
            'Unrelated code compilation traps'
          ],
          correctAnswer: 'Foundational definitions, core principles, and basic terminology',
          explanation: `Chapter 1 of "${cleanTitle}" establishes foundational principles, core definitions, and baseline concepts for the subject.`,
          chapter: 'Chapter 1'
        },
        {
          id: 'fb_1_2',
          type: 'true_false',
          questionNumber: 2,
          question: `True or False: Mastering the fundamental formulas in Chapter 1 is required to solve advanced problems in later chapters.`,
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'Initial chapter definitions provide the necessary foundation for advanced multi-step exercises.',
          chapter: 'Chapter 1'
        },
        {
          id: 'fb_1_3',
          type: 'fill_in_blank',
          questionNumber: 3,
          question: `Fill in the blank: According to Chapter 1, scientific analysis requires backing theoretical models with empirical _____.`,
          options: ['evidence and observations', 'random guesses', 'unverified opinions', 'abstract art'],
          correctAnswer: 'evidence and observations',
          explanation: 'Academic textbooks emphasize pairing theoretical framework models with rigorous empirical evidence.',
          chapter: 'Chapter 1'
        },
        {
          id: 'fb_1_4',
          type: 'concept_based',
          questionNumber: 4,
          question: `Which methodology is emphasized in Chapter 1 of "${cleanTitle}" for conceptual review?`,
          options: [
            'Step-by-step problem breakdown and formula verification',
            'Memorization without context',
            'Skipping practice exercises',
            'Reading only summary bullet points'
          ],
          correctAnswer: 'Step-by-step problem breakdown and formula verification',
          explanation: 'Deconstructing problems systematically ensures comprehensive conceptual understanding.',
          chapter: 'Chapter 1'
        },
        {
          id: 'fb_1_5',
          type: 'multiple_choice',
          questionNumber: 5,
          question: `What primary outcome should a student achieve upon completing Chapter 1?`,
          options: [
            'Clear understanding of core concepts and fundamental analytical skills',
            'Complete mastery of post-graduate research papers',
            'Memorization of random page numbers',
            'Skipping remaining chapters entirely'
          ],
          correctAnswer: 'Clear understanding of core concepts and fundamental analytical skills',
          explanation: 'Chapter 1 aims to equip students with baseline terminology and core analytical skills.',
          chapter: 'Chapter 1'
        }
      ];
    } else if (chapter === 'Chapter 2') {
      return [
        {
          id: 'fb_2_1',
          type: 'multiple_choice',
          questionNumber: 1,
          question: `In Chapter 2 of "${cleanTitle}", how do core mechanisms build upon Chapter 1?`,
          options: [
            'By applying foundational rules to specific relationships, laws, and equations',
            'By discarding all terms defined in Chapter 1',
            'By focusing exclusively on non-academic anecdotes',
            'By avoiding mathematical or logical proofs'
          ],
          correctAnswer: 'By applying foundational rules to specific relationships, laws, and equations',
          explanation: 'Chapter 2 expands initial definitions into specific governing laws and functional relationships.',
          chapter: 'Chapter 2'
        },
        {
          id: 'fb_2_2',
          type: 'true_false',
          questionNumber: 2,
          question: `True or False: Standard SI/Metric unit conversions must be maintained throughout Chapter 2 calculations.`,
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'Maintaining consistent standard units is essential for accurate quantitative problem-solving.',
          chapter: 'Chapter 2'
        },
        {
          id: 'fb_2_3',
          type: 'fill_in_blank',
          questionNumber: 3,
          question: `Fill in the blank: Key systems described in Chapter 2 operate under the principle of conservation of _____.`,
          options: ['mass and energy', 'random variables', 'arbitrary constants', 'page numbers'],
          correctAnswer: 'mass and energy',
          explanation: 'Conservation laws form the backbone of physical, chemical, and analytical sciences.',
          chapter: 'Chapter 2'
        },
        {
          id: 'fb_2_4',
          type: 'concept_based',
          questionNumber: 4,
          question: `What primary problem-solving tool is introduced in Chapter 2 of "${cleanTitle}"?`,
          options: [
            'Diagrammatic representation and structural system analysis',
            'Trial-and-error guessing',
            'Ignoring boundary conditions',
            'Relying solely on intuition'
          ],
          correctAnswer: 'Diagrammatic representation and structural system analysis',
          explanation: 'Visualizing components through diagrams and structural analysis clarifies complex problem scenarios.',
          chapter: 'Chapter 2'
        },
        {
          id: 'fb_2_5',
          type: 'multiple_choice',
          questionNumber: 5,
          question: `When starting a workout problem in Chapter 2, what is the recommended first step?`,
          options: [
            'Identify given variables, target unknowns, and select governing formulas',
            'Jump directly to calculation without writing given data',
            'Guess the numerical answer',
            'Copy answers without reading'
          ],
          correctAnswer: 'Identify given variables, target unknowns, and select governing formulas',
          explanation: 'Systematically listing given parameters and target unknowns prevents common calculation errors.',
          chapter: 'Chapter 2'
        }
      ];
    } else if (chapter === 'Chapter 3') {
      return [
        {
          id: 'fb_3_1',
          type: 'multiple_choice',
          questionNumber: 1,
          question: `Chapter 3 of "${cleanTitle}" explores real-world applications. What is a core principle?`,
          options: [
            'Complex real-world systems can be broken down into interacting sub-components',
            'Sub-components operate independently without feedback',
            'External factors have no impact on real systems',
            'Practical applications do not relate to theoretical principles'
          ],
          correctAnswer: 'Complex real-world systems can be broken down into interacting sub-components',
          explanation: 'Modular analysis decomposes real-world systems into manageable interacting sub-components.',
          chapter: 'Chapter 3'
        },
        {
          id: 'fb_3_2',
          type: 'true_false',
          questionNumber: 2,
          question: `True or False: Experimental results may vary slightly from ideal theoretical models due to environmental friction, resistance, or measurement limits.`,
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'Real-world environments introduce friction, loss, or measurement variance compared to ideal models.',
          chapter: 'Chapter 3'
        },
        {
          id: 'fb_3_3',
          type: 'fill_in_blank',
          questionNumber: 3,
          question: `Fill in the blank: In Chapter 3, system efficiency is calculated as useful work output divided by total _____.`,
          options: ['input energy', 'wasted effort', 'initial time', 'arbitrary factor'],
          correctAnswer: 'input energy',
          explanation: 'System efficiency measures useful work output relative to total energy input.',
          chapter: 'Chapter 3'
        },
        {
          id: 'fb_3_4',
          type: 'concept_based',
          questionNumber: 4,
          question: `How should multi-step application problems in Chapter 3 be evaluated?`,
          options: [
            'Solve intermediate steps sequentially and verify physical dimensions',
            'Combine all numbers into one unverified calculation',
            'Ignore intermediate values',
            'Round numbers arbitrarily at every step'
          ],
          correctAnswer: 'Solve intermediate steps sequentially and verify physical dimensions',
          explanation: 'Dimensional analysis and sequential calculation prevent compounding rounding errors.',
          chapter: 'Chapter 3'
        },
        {
          id: 'fb_3_5',
          type: 'multiple_choice',
          questionNumber: 5,
          question: `What key lesson is learned from Chapter 3 case studies in "${cleanTitle}"?`,
          options: [
            'Applying theoretical formulas to practical scenarios requires accounting for boundary constraints',
            'Formulas work identically regardless of real-world constraints',
            'Case studies hold no academic value',
            'Boundary conditions only exist in pure mathematics'
          ],
          correctAnswer: 'Applying theoretical formulas to practical scenarios requires accounting for boundary constraints',
          explanation: 'Real-world application requires accounting for practical boundary conditions.',
          chapter: 'Chapter 3'
        }
      ];
    } else if (chapter === 'Revision Quiz') {
      return [
        {
          id: 'fb_rev_1',
          type: 'multiple_choice',
          questionNumber: 1,
          question: `[Revision Quiz] Reviewing "${cleanTitle}": What is the main relationship between theoretical models and practical exercises?`,
          options: [
            'Theory provides abstract framework models, while practical exercises validate and refine these models',
            'Theory and practice are completely opposite and incompatible',
            'Practical exercises remove the need for theory',
            'Theory guarantees exact real-world results without testing'
          ],
          correctAnswer: 'Theory provides abstract framework models, while practical exercises validate and refine these models',
          explanation: 'Revision reinforces that empirical problem solving validates and refines theoretical models.',
          chapter: 'Revision Quiz'
        },
        {
          id: 'fb_rev_2',
          type: 'true_false',
          questionNumber: 2,
          question: `True or False: Regular active revision of previous chapter formulas significantly improves exam retention and confidence.`,
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'Active recall and periodic revision strengthen neural retention and conceptual accuracy.',
          chapter: 'Revision Quiz'
        },
        {
          id: 'fb_rev_3',
          type: 'fill_in_blank',
          questionNumber: 3,
          question: `Fill in the blank: Checking dimensional units when solving exam questions from "${cleanTitle}" helps prevent _____ errors.`,
          options: ['calculation', 'formatting', 'printing', 'spelling'],
          correctAnswer: 'calculation',
          explanation: 'Dimensional consistency checks flag algebraic and unit conversion errors early during exams.',
          chapter: 'Revision Quiz'
        },
        {
          id: 'fb_rev_4',
          type: 'concept_based',
          questionNumber: 4,
          question: `Which study strategy is most effective for textbook exam revision?`,
          options: [
            'Active recall and practicing unsolved textbook exercises',
            'Passive re-reading of text without solving questions',
            'Cramming right before entering the exam room',
            'Memorizing answers without understanding steps'
          ],
          correctAnswer: 'Active recall and practicing unsolved textbook exercises',
          explanation: 'Active recall by practicing problems builds exam readiness and highlights areas for improvement.',
          chapter: 'Revision Quiz'
        },
        {
          id: 'fb_rev_5',
          type: 'multiple_choice',
          questionNumber: 5,
          question: `What approach should you take when encountering a challenging textbook problem during revision?`,
          options: [
            'Break down the problem into given parameters, relevant formulas, and step-by-step logic',
            'Skip it permanently',
            'Guess immediately without reading',
            'Assume the question is incorrect'
          ],
          correctAnswer: 'Break down the problem into given parameters, relevant formulas, and step-by-step logic',
          explanation: 'Deconstructing complex problems systematically turns difficult questions into manageable steps.',
          chapter: 'Revision Quiz'
        }
      ];
    } else {
      // Mixed Quiz
      return [
        {
          id: 'fb_mix_1',
          type: 'multiple_choice',
          questionNumber: 1,
          question: `[Mixed Quiz] Across all chapters in "${cleanTitle}", what is the unifying goal of textbook learning?`,
          options: [
            'Developing systematic analytical reasoning to solve domain-specific problems',
            'Memorizing answers for specific page numbers',
            'Writing as many pages of notes as possible',
            'Guessing answers by eliminating option letters'
          ],
          correctAnswer: 'Developing systematic analytical reasoning to solve domain-specific problems',
          explanation: 'Textbook study across all subjects aims to build systematic analytical reasoning.',
          chapter: 'Mixed Quiz'
        },
        {
          id: 'fb_mix_2',
          type: 'true_false',
          questionNumber: 2,
          question: `True or False: In "${cleanTitle}", foundational concepts learned in Chapter 1 directly serve as prerequisites for Chapters 2 and 3.`,
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'Academic textbooks build knowledge hierarchically across chapters.',
          chapter: 'Mixed Quiz'
        },
        {
          id: 'fb_mix_3',
          type: 'fill_in_blank',
          questionNumber: 3,
          question: `Fill in the blank: Mastery of "${cleanTitle}" requires balancing theoretical understanding with consistent problem-solving _____.`,
          options: ['practice', 'guesswork', 'hesitation', 'speculation'],
          correctAnswer: 'practice',
          explanation: 'Combining theoretical clarity with regular practice ensures long-term subject mastery.',
          chapter: 'Mixed Quiz'
        },
        {
          id: 'fb_mix_4',
          type: 'concept_based',
          questionNumber: 4,
          question: `How should a student approach a Mixed Quiz question that combines multiple chapter topics?`,
          options: [
            'Identify each core concept involved, select relevant formulas, and integrate them logically',
            'Focus only on one topic and ignore the rest',
            'Use trial-and-error guessing',
            'Rely exclusively on external calculators'
          ],
          correctAnswer: 'Identify each core concept involved, select relevant formulas, and integrate them logically',
          explanation: 'Mixed questions test your ability to synthesize multiple concepts into a unified solution.',
          chapter: 'Mixed Quiz'
        },
        {
          id: 'fb_mix_5',
          type: 'multiple_choice',
          questionNumber: 5,
          question: `What defines a successful performance on a textbook Mixed Quiz?`,
          options: [
            'Demonstrating flexibility in applying different chapter principles to varied question types',
            'Knowing only one specific chapter perfectly',
            'Finishing in under 10 seconds without reading',
            'Memorizing option letters A, B, C, D'
          ],
          correctAnswer: 'Demonstrating flexibility in applying different chapter principles to varied question types',
          explanation: 'Mixed quizzes assess your adaptability and cross-chapter conceptual mastery.',
          chapter: 'Mixed Quiz'
        }
      ];
    }
  };

  // Start a quiz for a specific category
  const handleStartQuiz = async (category: string) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers({});
    setIsQuizCompleted(false);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/quizzes/textbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookName,
          bookImage,
          bookResponse,
          chapter: category,
          count: 5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setQuestions(generateFallbackTextbookQuestions(bookName, bookResponse || '', category));
        }
      } else {
        setQuestions(generateFallbackTextbookQuestions(bookName, bookResponse || '', category));
      }
    } catch (err: any) {
      console.warn('Falling back to local textbook quiz generator:', err);
      setQuestions(generateFallbackTextbookQuestions(bookName, bookResponse || '', category));
    } finally {
      setLoading(false);
    }
  };

  // Option selection
  const handleSelectOption = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  // Submit current question answer
  const handleSubmitAnswer = () => {
    if (!selectedOption || isSubmitted) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;

    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: {
        selected: selectedOption,
        correct: isCorrect,
      },
    }));

    setIsSubmitted(true);
  };

  // Next Question or Finish
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  // Reset / Retry current category
  const handleRetryQuiz = () => {
    if (selectedCategory) {
      handleStartQuiz(selectedCategory);
    }
  };

  // Return to chapter selection
  const handleReturnToQuizArena = () => {
    setSelectedCategory(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers({});
    setIsQuizCompleted(false);
  };

  // Handle guess for programming secondary quiz tab
  const handleGuessProgQuiz = (quizId: string, choice: string, correctAns: string) => {
    if (progAnswers[quizId]) return;
    setProgAnswers({
      ...progAnswers,
      [quizId]: { guessed: choice, correct: choice === correctAns },
    });
  };

  // 1. EMPTY STATE (No textbook added yet in Textbook Study)
  if (!hasTextbook) {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-5 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-indigo-950/20 border border-amber-500/20 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-xl font-bold text-amber-400 flex items-center space-x-2">
            <Award className="animate-pulse text-amber-400" size={20} />
            <span>Textbook Quiz Arena</span>
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            Generate custom textbook-based practice quizzes tailored to your active syllabus & chapters!
          </p>
        </div>

        {/* Helpful Empty State Card (Requirement 13) */}
        <div className="bg-[#151821] border border-gray-800 rounded-2xl p-8 sm:p-10 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-purple-950/40 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto text-purple-400 shadow-inner">
            <BookMarked size={32} />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-base font-bold text-gray-100">No textbook available</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              No textbook available. Upload or select a textbook in Textbook Study to start a quiz.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onGoToTextbookStudy}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition inline-flex items-center space-x-2 cursor-pointer shadow-lg hover:shadow-purple-500/20"
            >
              <BookOpen size={15} />
              <span>Go to Textbook Study</span>
            </button>
          </div>
        </div>

        {/* Optional Secondary Programming Quizzes Link */}
        <div className="pt-4 border-t border-gray-850 flex justify-end">
          <button
            onClick={() => setShowProgrammingQuizzes(!showProgrammingQuizzes)}
            className="text-xs font-mono text-gray-400 hover:text-amber-300 flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Code size={13} />
            <span>
              {showProgrammingQuizzes
                ? 'Back to Textbook Quiz System'
                : 'Switch to Programming Language Quizzes'}
            </span>
          </button>
        </div>

        {showProgrammingQuizzes && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between bg-[#151821] border border-gray-800 p-3 px-4 rounded-xl">
              <span className="text-xs font-bold text-amber-400 font-mono flex items-center space-x-1.5">
                <Code size={14} />
                <span>Programming Language Quizzes</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                XP Score: {((Object.values(progAnswers) as { guessed: string; correct: boolean }[]).filter((a) => a.correct).length * 10)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outputQuizzes.slice(0, 4).map((quiz) => {
                const res = progAnswers[quiz.id];
                return (
                  <div key={quiz.id} className="bg-[#151821] border border-gray-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2 py-0.5 bg-gray-900 border border-gray-800 text-gray-400 rounded">
                        {quiz.language}
                      </span>
                      {res && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${res.correct ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                          {res.correct ? 'Correct! +10XP' : 'Incorrect'}
                        </span>
                      )}
                    </div>
                    <pre className="p-2.5 bg-gray-950 border border-gray-850 rounded text-xs text-yellow-300 font-mono overflow-x-auto">
                      {quiz.code}
                    </pre>
                    <div className="space-y-1">
                      {quiz.options.map((opt) => (
                        <button
                          key={opt}
                          disabled={!!res}
                          onClick={() => handleGuessProgQuiz(quiz.id, opt, quiz.correctAnswer)}
                          className="w-full text-left p-2 bg-gray-950 hover:bg-gray-900 border border-gray-850 rounded text-xs text-gray-300 transition"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. SECONDARY PROGRAMMING QUIZZES VIEW (Requirement 12)
  if (showProgrammingQuizzes) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-[#151821] border border-amber-500/20 p-4 rounded-2xl">
          <div className="flex items-center space-x-2">
            <Code size={18} className="text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-amber-400 font-mono">Programming Language Quizzes</h3>
              <p className="text-[10px] text-gray-400">Practice code output prediction for Python, JS, C++, Java, Rust, SQL</p>
            </div>
          </div>
          <button
            onClick={() => setShowProgrammingQuizzes(false)}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
          >
            <BookOpen size={13} />
            <span>Return to Textbook Quizzes</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outputQuizzes.map((quiz) => {
            const res = progAnswers[quiz.id];
            return (
              <div key={quiz.id} className="bg-[#151821] border border-gray-800 rounded-2xl p-4 space-y-3 shadow-md">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 bg-gray-900 border border-gray-800 text-gray-300 rounded font-bold">
                    {quiz.language}
                  </span>
                  {res && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${res.correct ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                      {res.correct ? 'Correct! +10XP' : 'Incorrect'}
                    </span>
                  )}
                </div>
                <div className="p-3 bg-gray-950 border border-gray-850 rounded-xl font-mono text-xs text-yellow-300">
                  <pre className="whitespace-pre-wrap">{quiz.code}</pre>
                </div>
                <div className="space-y-1.5">
                  {quiz.options.map((opt) => {
                    const isGuessed = res?.guessed === opt;
                    const isCorrectOpt = opt === quiz.correctAnswer;
                    let btnStyle = 'border-gray-850 hover:bg-gray-900 text-gray-300';
                    if (res) {
                      if (isCorrectOpt) btnStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-400 font-bold';
                      else if (isGuessed) btnStyle = 'border-rose-500 bg-rose-950/30 text-rose-400 font-bold';
                      else btnStyle = 'border-gray-850 opacity-40 text-gray-500';
                    }
                    return (
                      <button
                        key={opt}
                        disabled={!!res}
                        onClick={() => handleGuessProgQuiz(quiz.id, opt, quiz.correctAnswer)}
                        className={`w-full text-left p-2.5 border rounded-lg text-xs transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {res && isCorrectOpt && <CheckCircle2 size={12} className="text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
                {res && (
                  <div className="p-2.5 bg-gray-950 border border-gray-850 rounded-lg text-[10px] text-gray-400">
                    <strong>Why?</strong> {quiz.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. CHAPTER SELECTION VIEW (When textbook is available & no quiz active yet)
  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        {/* Active Textbook Banner */}
        <div className="p-5 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 border border-purple-500/20 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold font-mono text-purple-400 uppercase tracking-widest flex items-center space-x-1">
                <Sparkles size={11} className="text-amber-400" />
                <span>Active Textbook Quiz System</span>
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <BookOpen size={20} className="text-purple-400 shrink-0" />
                <span className="truncate max-w-md">
                  {bookName || 'Uploaded Textbook Page / Photo'}
                </span>
              </h2>
              <p className="text-xs text-gray-300">
                Quizzes are dynamically generated from your selected textbook content and syllabus.
              </p>
            </div>

            <button
              onClick={onGoToTextbookStudy}
              className="px-3.5 py-2 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-purple-500/30 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition shrink-0 flex items-center space-x-1.5 cursor-pointer"
            >
              <BookMarked size={13} className="text-purple-400" />
              <span>Change Textbook</span>
            </button>
          </div>
        </div>

        {/* Textbook Preview bar if snapshot is available */}
        {bookImage && (
          <div className="p-3 bg-[#151821] border border-gray-800 rounded-xl flex items-center space-x-3">
            <img
              src={bookImage}
              alt="Textbook Snapshot"
              className="w-12 h-12 object-cover rounded-lg border border-purple-500/20 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-0.5 text-xs">
              <span className="font-bold text-gray-200 block">Loaded Page Scan</span>
              <p className="text-[10px] text-gray-400">Questions will directly reference formulas, text, and context from this snap.</p>
            </div>
          </div>
        )}

        {/* Chapter Quiz Categories Grid (Requirements 7 & 8) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider flex items-center space-x-1.5">
              <Layers size={14} className="text-purple-400" />
              <span>Select Chapter / Quiz Category:</span>
            </span>
            <span className="text-[10px] text-gray-500 font-mono">5 Questions per Quiz</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, idx) => {
              let badgeColor = 'bg-purple-950/40 text-purple-300 border-purple-500/20';
              let desc = 'Targeted chapter concepts, formulas & definitions';
              if (cat === 'Mixed Quiz') {
                badgeColor = 'bg-teal-950/40 text-teal-300 border-teal-500/20';
                desc = 'Comprehensive questions aggregated across all chapters';
              } else if (cat === 'Revision Quiz') {
                badgeColor = 'bg-amber-950/40 text-amber-300 border-amber-500/20';
                desc = 'Key recall exercises, formulas & final exam prep';
              }

              return (
                <button
                  key={cat}
                  onClick={() => handleStartQuiz(cat)}
                  className="bg-[#151821] hover:bg-[#191d29] border border-gray-800 hover:border-purple-500/40 rounded-2xl p-5 text-left transition group shadow-lg flex flex-col justify-between space-y-4 cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-md border ${badgeColor}`}>
                        {cat}
                      </span>
                      <ChevronRight size={16} className="text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-100 group-hover:text-purple-300 transition">
                      {cat} Practice Quiz
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                  </div>

                  <div className="pt-2 border-t border-gray-850 flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <span>MCQ • T/F • Blanks</span>
                    <span className="text-purple-400 font-bold group-hover:underline flex items-center space-x-1">
                      <span>Start Quiz</span>
                      <ArrowRight size={10} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Programming Quiz Option Link (Requirement 12) */}
        <div className="pt-4 border-t border-gray-850 flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>Looking for code output traps?</span>
          <button
            onClick={() => setShowProgrammingQuizzes(true)}
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Code size={13} />
            <span>Switch to Programming Language Quizzes</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. LOADING STATE
  if (loading) {
    return (
      <div className="bg-[#151821] border border-purple-500/20 rounded-2xl p-12 text-center space-y-4 shadow-xl">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-purple-300 animate-pulse font-mono">
            Generating {selectedCategory} Textbook Quiz...
          </h3>
          <p className="text-xs text-gray-400">
            Parsing textbook content and creating multi-choice, true/false, fill-in-the-blanks, and concept questions.
          </p>
        </div>
      </div>
    );
  }

  // 5. FINAL RESULTS SCREEN (Requirement 11)
  if (isQuizCompleted) {
    const totalCount = questions.length;
    const correctCount = (Object.values(userAnswers) as { selected: string; correct: boolean }[]).filter((a) => a.correct).length;
    const incorrectCount = totalCount - correctCount;
    const percentage = Math.round((correctCount / totalCount) * 100);

    let feedbackBadge = '🎉 Outstanding Mastery!';
    let badgeBg = 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400';
    if (percentage < 50) {
      feedbackBadge = '📚 Keep Studying & Practice Again!';
      badgeBg = 'bg-rose-950/60 border-rose-500/30 text-rose-300';
    } else if (percentage < 80) {
      feedbackBadge = '👍 Good Job! Minor Review Needed.';
      badgeBg = 'bg-amber-950/60 border-amber-500/30 text-amber-300';
    }

    return (
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-[#151821] border border-gray-800 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-purple-950/40 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-lg">
            <Award size={36} />
          </div>

          <div className="space-y-1">
            <span className={`inline-block text-xs font-bold font-mono px-3 py-1 rounded-full border ${badgeBg}`}>
              {feedbackBadge}
            </span>
            <h2 className="text-2xl font-black text-gray-100 font-mono pt-2">
              {selectedCategory} Quiz Results
            </h2>
            <p className="text-xs text-gray-400">
              Textbook: <strong className="text-purple-300">{bookName || 'Uploaded Textbook'}</strong>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
            <div className="bg-gray-950 p-3 rounded-xl border border-gray-850">
              <span className="text-[10px] text-gray-500 uppercase font-mono block">Total Questions</span>
              <span className="text-lg font-bold text-gray-200 font-mono">{totalCount}</span>
            </div>

            <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] text-emerald-400 uppercase font-mono block">Correct</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{correctCount}</span>
            </div>

            <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-500/20">
              <span className="text-[10px] text-rose-400 uppercase font-mono block">Incorrect</span>
              <span className="text-lg font-bold text-rose-400 font-mono">{incorrectCount}</span>
            </div>

            <div className="bg-purple-950/30 p-3 rounded-xl border border-purple-500/30">
              <span className="text-[10px] text-purple-300 uppercase font-mono block">Score</span>
              <span className="text-lg font-bold text-purple-300 font-mono">{percentage}%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gray-850">
            <button
              onClick={handleRetryQuiz}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <RotateCcw size={14} />
              <span>Retry Quiz</span>
            </button>

            <button
              onClick={handleReturnToQuizArena}
              className="px-4 py-2.5 bg-gray-950 hover:bg-gray-900 border border-gray-800 text-gray-300 hover:text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Return to Quiz Arena</span>
            </button>
          </div>
        </div>

        {/* Question Review List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider flex items-center space-x-1.5">
            <FileText size={14} className="text-purple-400" />
            <span>Detailed Answer Breakdown:</span>
          </h3>

          <div className="space-y-3">
            {questions.map((q, idx) => {
              const ans = userAnswers[idx];
              const isUserCorrect = ans?.correct;

              return (
                <div
                  key={q.id}
                  className={`bg-[#151821] border rounded-2xl p-4 sm:p-5 space-y-3 shadow-md ${
                    isUserCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-purple-400 font-mono">
                      Q{idx + 1}. {q.question}
                    </span>
                    <span
                      className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded shrink-0 flex items-center space-x-1 ${
                        isUserCorrect
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {isUserCorrect ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      <span>{isUserCorrect ? 'Correct' : 'Incorrect'}</span>
                    </span>
                  </div>

                  <div className="text-xs text-gray-300 space-y-1 bg-gray-950/60 p-3 rounded-xl border border-gray-850">
                    <div>
                      <span className="text-gray-500">Your Answer: </span>
                      <span className={isUserCorrect ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                        {ans?.selected || 'Skipped'}
                      </span>
                    </div>
                    {!isUserCorrect && (
                      <div>
                        <span className="text-gray-500">Correct Answer: </span>
                        <span className="text-emerald-400 font-semibold">{q.correctAnswer}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 bg-purple-950/20 p-3 rounded-xl border border-purple-500/10 leading-relaxed">
                    <strong className="text-purple-300">💡 Explanation: </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 6. ACTIVE QUESTION SCREEN (Question-by-Question flow)
  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="space-y-6">
      {/* Quiz Top Navigation Bar */}
      <div className="bg-[#151821] border border-gray-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between text-xs font-mono">
          <button
            onClick={handleReturnToQuizArena}
            className="text-gray-400 hover:text-white flex items-center space-x-1 transition cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Quiz Arena</span>
          </button>

          <span className="px-2.5 py-0.5 bg-purple-950 border border-purple-500/20 text-purple-300 rounded font-bold">
            {selectedCategory}
          </span>

          <span className="text-gray-400 font-semibold">
            Question <strong className="text-white">{currentIndex + 1}</strong> of {questions.length}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-gray-950 rounded-full h-1.5 overflow-hidden border border-gray-800">
          <div
            className="bg-purple-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Active Question Card */}
      <div className="bg-[#151821] border border-purple-500/20 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
        {/* Question Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-gray-900 border border-gray-800 text-purple-400 rounded uppercase">
              {currentQ.type.replace('_', ' ')}
            </span>
            <span className="text-[10px] text-gray-500 font-mono">
              Based on {bookName || 'Textbook Content'}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-gray-100 leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === currentQ.correctAnswer;

            let cardStyle = 'border-gray-800 bg-gray-950/60 hover:border-purple-500/40 text-gray-300';

            if (isSelected && !isSubmitted) {
              cardStyle = 'border-purple-500 bg-purple-950/30 text-purple-200 font-bold shadow-md';
            }

            if (isSubmitted) {
              if (isCorrectOption) {
                cardStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-300 font-bold';
              } else if (isSelected) {
                cardStyle = 'border-rose-500 bg-rose-950/30 text-rose-300 font-bold';
              } else {
                cardStyle = 'border-gray-850 bg-gray-950/20 opacity-40 text-gray-500';
              }
            }

            return (
              <button
                key={option}
                disabled={isSubmitted}
                onClick={() => handleSelectOption(option)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition flex items-center justify-between cursor-pointer ${cardStyle}`}
              >
                <div className="flex items-center space-x-3 pr-2">
                  <span className="w-6 h-6 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-xs font-mono font-bold shrink-0 text-gray-400">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-xs sm:text-sm">{option}</span>
                </div>

                {isSubmitted && isCorrectOption && (
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                )}
                {isSubmitted && isSelected && !isCorrectOption && (
                  <XCircle size={16} className="text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card (Appears after submitting answer) */}
        {isSubmitted && (
          <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-xl space-y-1.5 animate-fadeIn">
            <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5 font-mono">
              <Sparkles size={13} className="text-amber-400" />
              <span>Explanation:</span>
            </span>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Action Controls (Submit / Next Question) */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-850">
          <button
            onClick={handleReturnToQuizArena}
            className="text-xs font-mono text-gray-500 hover:text-gray-300 transition cursor-pointer"
          >
            Exit Quiz
          </button>

          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOption}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-550 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Quiz Results'}</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
