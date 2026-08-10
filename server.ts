/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables for local testing
dotenv.config();

const app = express();
const PORT = 3000;

// Setup JSON limit to support base64 snapshot uploads from OCR camera scanner
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lazy init the GenAI client to prevent startup crashes when API key is missing
let aiClientInstance: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClientInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is missing. Please configure it in your AI Studio Secrets.');
    }
    aiClientInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClientInstance;
}

/**
 * Robust wrapper around ai.models.generateContent that retries across
 * fallback model aliases when facing temporary 503 high demand spikes or model errors.
 */
async function generateWithFallback(ai: GoogleGenAI, params: any) {
  const modelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        ...params,
        model,
      });
      return response;
    } catch (err: any) {
      console.warn(`Model ${model} request failed, attempting fallback... Error:`, err?.message || err);
      lastError = err;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  throw lastError;
}

// Global active-solves checking / ad-earning helpers can be client-side stored, but let's provide some server confirmation
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    currentTime: new Date().toISOString(),
    apiKeyAvailable: !!process.env.GEMINI_API_KEY,
  });
});

/**
 * Endpoint: /api/solve
 * Goal: Generates a complete programming solution for a specified prompt
 */
app.post('/api/solve', async (req, res) => {
  try {
    const { prompt, language } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Snippet prompt is required.' });
    }

    const ai = getAIClient();
    const targetLang = language && language !== 'auto' ? language : 'the language specified, implied, or most appropriate for the question';
    const systemPrompt = `You are a helpful software tutor at "CodeSolver AI".
Provide direct, clean, and concise programming solutions. Avoid any self-praise or grandiose framing (like "Senior Silicon Valley Staff Software Engineer" or similar).
If the user asks a simple question, answer it directly and shortly in a single sentence or line. Give direct short answers.
You MUST write all programming solution code blocks strictly in the following target language: ${targetLang}.
Provide the solution using markdown code blocks, keeping explanations brief and clear.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Solve Error:', error);
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
});

/**
 * Endpoint: /api/convert
 * Goal: Translates code from one programming language to another while preserving structure
 */
app.post('/api/convert', async (req, res) => {
  try {
    const { code, targetLanguage, sourceLanguage } = req.body;
    if (!code || !targetLanguage) {
      return res.status(400).json({ error: 'Code to convert and target language are required.' });
    }

    const ai = getAIClient();
    const systemPrompt = `You are an automated code converter at "CodeSolver AI" that converts code from one language to another.
Convert this code ${sourceLanguage ? `from ${sourceLanguage}` : '(auto-detected)'} to ${targetLanguage}.
Provide the converted code inside a code block, keeping any additional explanation and comments minimal, direct, and short. Avoid verbose introductory text, grandiose roles, or self-praise.`;

    const response = await generateWithFallback(ai, {
      contents: code,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.1,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Convert Error:', error);
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
});

/**
 * Endpoint: /api/debug
 * Goal: Analyzes, corrects, and provides optimizations for a buggy snippet of code
 */
app.post('/api/debug', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Code block is required.' });
    }

    const ai = getAIClient();
    const systemPrompt = `You are a helpful software debugging assistant at "CodeSolver AI".
Identify the bug in the provided code, briefly explain what is wrong, and provide the corrected code directly and briefly.
Avoid grandiose titles, self-praise, or unnecessary introductory fluff. Keep your answers as short, concise, and direct as possible.`;

    const response = await generateWithFallback(ai, {
      contents: code,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Debug Error:', error);
    res.status(500).json({ error: error.message || 'AI generation failed' });
  }
});

/**
 * Endpoint: /api/ask
 * Goal: Programming Q&A logic, including DSA theory, algorithms or academic curriculum doubts
 */
app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const ai = getAIClient();
    const systemPrompt = `You are a helpful computer science tutor at "CodeSolver AI".
Answer coding doubts, theoretical questions, or simple math/computer science queries directly and concisely.
If the student asks a simple question (e.g., "1+1" or similar direct simple queries), provide a polite, extremely short, direct answer (e.g., "2" or "The answer is 2.") without any grandiose prefixes, unsolicited explanations, pre-pended branding, or extra conversational fluff.`;

    const response = await generateWithFallback(ai, {
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Ask Q&A Error:', error);
    res.status(500).json({ error: error.message || 'AI Q&A failed' });
  }
});

/**
 * Endpoint: /api/scan
 * Goal: Takes a camera base64 snapshot image, extracts textbook writing or code equations with multimodal OCR, and answers the textbooks' queries.
 */
app.post('/api/scan', async (req, res) => {
  try {
    const { image, mimeType, taskType } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Base64 image is required.' });
    }

    const base64Data = image.split(',')[1] || image;
    const ai = getAIClient();

    let scanPrompt = 'Perform OCR and extract all readable text, math formula, or program from this image. Then present a detailed breakdown explaining standard concepts present in the text.';
    if (taskType === 'solve') {
      scanPrompt = 'Perform OCR to read the text or programming question in this image. Then provide a complete, well-commented step-by-step solution to the problem, showing equations or code as fits.';
    } else if (taskType === 'debug') {
      scanPrompt = 'Perform OCR to extract the programming source code in this image. Then pinpoint all syntax or logical errors, and provide a corrected, fully-working copyable program block.';
    } else if (taskType === 'convert') {
      scanPrompt = 'Perform OCR to read the code in this image. Reconstruct and output the text. Indicate what language it is, making it copyable.';
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/png',
        data: base64Data,
      },
    };

    const textPart = {
      text: scanPrompt,
    };

    const response = await generateWithFallback(ai, {
      contents: { parts: [imagePart, textPart] },
    });

    // Extract the parsed text
    res.json({ text: response.text });
  } catch (error: any) {
    console.error('OCR Scan Error:', error);
    res.status(500).json({ error: error.message || 'OCR Image Scanning failed' });
  }
});

/**
 * Endpoint: /api/book/analyze
 * Goal: Combined textbook analyzer endpoint which:
 *  - Identifies a textbook from base64 image or title name (or both)
 *  - Dynamically extracts syllabus-relevant practice questions
 *  - Resolves exact doubts or conceptual queries about the book content
 */
app.post('/api/book/analyze', async (req, res) => {
  try {
    const { image, mimeType, bookName, query, task } = req.body;
    const ai = getAIClient();

    const systemInstruction = `You are a helpful and experienced academic tutor at "CodeSolver AI".
Your specialization is identifying textbooks from snapshots, covers, index pages, or written chapters and helping students study from them.
Provide direct, highly educational, structured, and easy-to-understand explanations.
Avoid dry or grandiose language and introduce complex topics with friendly real-world examples.`;

    const parts: any[] = [];

    if (image) {
      const base64Data = image.split(',')[1] || image;
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/png',
          data: base64Data,
        },
      });
    }

    let userPrompt = '';
    if (task === 'syllabus_questions') {
      userPrompt = `Based on the provided textbook name/reference and/or image content details:
Textbook Reference: ${bookName || 'Identified from scanned image'}

Step 1: Identify or estimate the textbook (if clear), and outline its standard academic curriculum/syllabus or core chapters clearly in a visual structured format.
Step 2: Generate 3 custom high-quality student practice multiple-choice questions (with options and hidden answers) and 2 logical workout exercises based on this textbook's syllabus.`;
    } else {
      // doubt_resolution
      userPrompt = `Based on the provided textbook description or scanned page:
Textbook Reference: ${bookName || 'Identified from scanned image'}

Question/Doubt query: "${query || 'Please explain the core formulas and concepts in detail.'}"

Task: Address the user's specific query about this textbook content or syllabus block directly, step-by-step, with high-contrast textbook-level accuracy. Give practical code examples or mathematical methodologies if applicable.`;
    }

    parts.push({ text: userPrompt });

    const response = await generateWithFallback(ai, {
      contents: { parts },
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Book Analyze Error:', error);
    res.status(500).json({ error: error.message || 'Textbook academic analysis failed' });
  }
});

/**
 * Endpoint: /api/tutor
 * Goal: General subject ChatGPT-like teaching assistant for K-12 and College (Math, Science, English, Computer, GK)
 */
app.post('/api/tutor', async (req, res) => {
  try {
    const { subject, query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required.' });
    }

    const ai = getAIClient();
    const subjectPrefix = subject ? `specifically under the discipline of ${subject}` : '';
    const systemPrompt = `You are a helpful and patient tutor at the "CodeSolver AI" academy. 
Your objective is to explain concepts for subjects (Math, Science, English, Computers, General Knowledge), ${subjectPrefix}.
Provide direct, short, highly clear answers.
If the student asks a simple question (for example, a simple math problem like "1+1" or similar direct queries), answer it directly and immediately (e.g., "2" or "The answer is 2.") without any extra conversational fluff or unnecessary long lessons. Do not use grandiose titles or self-praise.`;

    const response = await generateWithFallback(ai, {
      contents: query,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.5,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Tutor Error:', error);
    res.status(500).json({ error: error.message || 'AI Tutor failed' });
  }
});

/**
 * Endpoint: /api/quizzes/generate
 * Goal: Generates high-quality, tricky on-demand programming quizzes dynamically using Gemini.
 */
app.post('/api/quizzes/generate', async (req, res) => {
  try {
    const { language = 'Random', count = 3 } = req.body;
    const ai = getAIClient();

    const targetLang = language && language !== 'Random' ? language : 'a popular mainstream programming language (like Python, JavaScript, Java, C++, Go, Rust, SQL)';

    const systemPrompt = `You are a professional software engineering tutor at "CodeSolver AI".
Your goal is to generate extremely high-quality, tricky, and educational code output prediction quizzes for students.
Create exactly ${count} educational quizzes for ${targetLang}.
Each quiz must contain:
1. "language": Name of the programming language.
2. "code": A short, tricky, compilable snippet of code (3-8 lines) that has a specific, neat, non-obvious output or is a common trap/quiz question.
3. "options": Exactly 4 possible string options for the predicted stdout output or error.
4. "correctAnswer": The exact correct answer, which must be exactly identical to one of the 4 options.
5. "explanation": A detailed, clear, and reassuring explanation of why the output is correct and what the trap is.
Avoid generic or trivial print statement codes. Make them interesting for developers.
Format the JSON response array strictly according to the defined schema.`;

    let quizzes: any[] = [];
    try {
      const response = await generateWithFallback(ai, {
        contents: `Generate ${count} tricky code prediction quizzes.`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                language: { type: Type.STRING },
                code: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ['language', 'code', 'options', 'correctAnswer', 'explanation']
            }
          }
        },
      });

      const text = response.text || '[]';
      quizzes = JSON.parse(text.trim());
    } catch (aiErr: any) {
      console.warn('AI Quiz generation error, serving fallback quizzes:', aiErr?.message || aiErr);
      // Fallback quizzes when API limit/spike is reached
      const chosenLang = language && language !== 'Random' ? language : 'Python';
      quizzes = [
        {
          language: chosenLang,
          code: chosenLang === 'Python' ? `x = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))` : `let a = [1, 2, 3];\nlet b = a;\nb.push(4);\nconsole.log(a.length);`,
          options: ['3', '4', 'TypeError', 'Undefined'],
          correctAnswer: '4',
          explanation: 'In Python and JavaScript, objects and lists are passed by reference. Modifying y/b mutates the underlying array x/a.',
        },
        {
          language: chosenLang,
          code: chosenLang === 'Python' ? `print(type(1 / 1))` : `console.log(typeof (1 / 2));`,
          options: chosenLang === 'Python' ? ["<class 'int'>", "<class 'float'>", "<class 'number'>", 'SyntaxError'] : ['"integer"', '"number"', '"float"', 'NaN'],
          correctAnswer: chosenLang === 'Python' ? "<class 'float'>" : '"number"',
          explanation: 'In Python 3, division with / always returns a float. In JavaScript, all numbers are double-precision floats of type "number".',
        },
      ];
    }
    
    // Assign random unique IDs to each generated quiz
    const decoratedQuizzes = quizzes.map((quiz: any, idx: number) => ({
      ...quiz,
      id: `ai_${Date.now()}_${idx}_${Math.floor(Math.random() * 1000)}`
    }));

    res.json({ quizzes: decoratedQuizzes });
  } catch (error: any) {
    console.error('Quiz Generation Error:', error);
    res.status(500).json({ error: error.message || 'AI quiz generation failed' });
  }
});

/**
 * Endpoint: /api/quizzes/textbook
 * Goal: Generates textbook-specific quizzes tailored to selected chapters based ONLY on textbook content.
 */
app.post('/api/quizzes/textbook', async (req, res) => {
  try {
    const { bookName, bookImage, bookResponse, chapter = 'Chapter 1', count = 5 } = req.body;
    const ai = getAIClient();

    const systemPrompt = `You are an academic assessment creator at "CodeSolver AI".
Your task is to generate high-quality textbook quiz questions based STRICTLY on the provided textbook title, text content, image OCR, or syllabus details.
DO NOT generate random questions unrelated to the textbook or topic.

Generate exactly ${count} quiz questions for the category: "${chapter}".
Include a variety of question types appropriate for student testing:
- multiple_choice
- true_false
- fill_in_blank
- concept_based

For each question:
1. "type": One of "multiple_choice", "true_false", "fill_in_blank", "concept_based".
2. "question": Clear, direct question text strictly about the textbook topic.
3. "options": Array of 2 to 4 answer choices.
4. "correctAnswer": Exact string matching one of the choices.
5. "explanation": A concise, accurate explanation based directly on the textbook content.

Return JSON array adhering strictly to the response schema.`;

    const parts: any[] = [];
    if (bookImage) {
      const base64Data = bookImage.split(',')[1] || bookImage;
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: base64Data,
        },
      });
    }

    const contextText = `Textbook Reference / Title: ${bookName || 'Scanned Textbook'}
Textbook Content / Syllabus / Notes: ${bookResponse || 'Standard textbook curriculum'}
Selected Category: ${chapter}`;

    parts.push({ text: `Generate ${count} quiz questions for ${chapter} based on this textbook content:\n\n${contextText}` });

    const response = await generateWithFallback(ai, {
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.5,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ['type', 'question', 'options', 'correctAnswer', 'explanation'],
          },
        },
      },
    });

    const text = response.text || '[]';
    const rawQuestions = JSON.parse(text.trim());

    const decoratedQuestions = rawQuestions.map((q: any, idx: number) => ({
      id: `tb_q_${Date.now()}_${idx}`,
      type: q.type || 'multiple_choice',
      questionNumber: idx + 1,
      question: q.question,
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      chapter: chapter,
    }));

    res.json({ questions: decoratedQuestions });
  } catch (error: any) {
    console.error('Textbook Quiz Gen Error:', error);
    res.status(500).json({ error: error.message || 'Textbook quiz generation failed' });
  }
});

// Setup Vite Dev Server / static asset routing
async function initServer() {
  if (process.env.NODE_ENV !== 'production') {
    // In dev, use Vite's Dev Server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware loaded in dev context.');
  } else {
    // In prod, serve compiled static assets from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    // Support direct root redirection html pages if loaded directly (e.g. login.html, signup.html)
    app.get('/:page.html', (req, res, next) => {
      const pageFile = req.params.page + '.html';
      if (pageFile === 'index.html') {
        return next();
      }
      const filePath = path.join(process.cwd(), pageFile);
      res.sendFile(filePath, (err) => {
        if (err) {
          next();
        }
      });
    });

    // Support clean URL routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CodeSolver AI Server booted securely on http://0.0.0.0:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error('Critical server failure:', err);
});
