# CodeSolver AI — Complete Application Wireframes & Architecture Documentation

This document provides a comprehensive wireframe specifications manual for the **CodeSolver AI** platform. It details every screen, tab, modal, component, and user flow with ASCII layout diagrams, component hierarchies, state behaviors, and API mapping.

---

## Table of Contents
1. [App Overview & Theme Architecture](#1-app-overview--theme-architecture)
2. [Global Navigation & Shell Wireframe](#2-global-navigation--shell-wireframe)
3. [Tab 1: Home — AI Code & Math Solver (`HomeSolver`)](#3-tab-1-home--ai-code--math-solver-homesolver)
4. [Tab 2: Code Converter (`Converter`)](#4-tab-2-code-converter-converter)
5. [Tab 3: AI Code Debugger (`Debugger`)](#5-tab-3-ai-code-debugger-debugger)
6. [Tab 4: AI Tutor & Concept Explainer (`Tutor`)](#6-tab-4-ai-tutor--concept-explainer-tutor)
7. [Tab 5: Interactive Learning & Code Quizzes (`Learn`)](#7-tab-5-interactive-learning--code-quizzes-learn)
8. [Modal 1: Camera OCR & Image Scanner (`CameraOCRModal`)](#8-modal-1-camera-ocr--image-scanner-cameraocrmodal)
9. [Modal 2: Activity History Drawer (`HistoryModal`)](#9-modal-2-activity-history-drawer-historymodal)
10. [Modal 3: Authentication & Onboarding (`AuthView`)](#10-modal-3-authentication--onboarding-authview)
11. [Modal 4: User Profile & Preferences (`ProfileView`)](#11-modal-4-user-profile--preferences-profileview)

---

## 1. App Overview & Theme Architecture

**CodeSolver AI** is an intelligent full-stack learning and problem-solving assistant designed for students, developers, and educators. It provides instant code solving, cross-language conversion, line-by-line debugging, general AI tutoring, dynamic programming quizzes, and textbook OCR scanning.

### Color Palette & Theme Tokens
* **Dark Mode (Default)**: Deep obsidian canvas (`#0b0f19`), elevated card surfaces (`#111827`), cyan primary accents (`#06b6d4`), indigo secondary accents (`#6366f1`), muted gray text (`#9ca3af`).
* **Light Mode**: Off-white background (`#f8fafc`), clean white cards (`#ffffff`), border outlines (`#e2e8f0`), dark slate text (`#0f172a`), vivid cyan/indigo highlights.

---

## 2. Global Navigation & Shell Wireframe

### Screen Layout Hierarchy
The global application shell wraps all active tabs and modals, maintaining a persistent top navbar, dynamic tab content area, and a bottom navigation bar on touch devices or standard desktop footer navigation.

```
+-------------------------------------------------------------------------------+
|  [Logo] CodeSolver AI    [Solves: 12/15]  [☀️/🌙]  [📜 History]  [👤 Profile] |
+-------------------------------------------------------------------------------+
|                                                                               |
|                        < ACTIVE TAB ROUTE CONTENT >                           |
|      (HomeSolver | Converter | Debugger | Tutor | Learn)                     |
|                                                                               |
+-------------------------------------------------------------------------------+
|  [⚡ Home]   [🔄 Convert]   [🐛 Debug]   [🎓 Tutor]   [🧠 Practice & Quiz]     |
+-------------------------------------------------------------------------------+
```

### Component Details
* **Top Header**:
  * **Brand Identity**: Animated gradient logo badge and title.
  * **Solves Counter Badge**: Shows daily remaining free AI solves (`Solves: X/15` or `UNLIMITED`).
  * **Theme Toggle Button**: One-click instant switch between dark and light themes.
  * **History Drawer Trigger**: Opens sliding drawer with persistent user activity logs.
  * **Profile / Auth Trigger**: Displays user name/avatar or "Sign In" button.
* **Bottom Navigation Bar (`BottomNavBar.tsx`)**:
  * Responsive 5-item tab bar with active glowing indicator pills and micro-animations using Framer Motion.

---

## 3. Tab 1: Home — AI Code & Math Solver (`HomeSolver`)

### Purpose
Allows users to enter programming problems, code snippets, or mathematical/scientific questions via text, speech, or camera scan to receive instant step-by-step solutions with runnable code.

### ASCII Wireframe
```
+-------------------------------------------------------------------------------+
| ⚡ AI Problem & Code Solver                                                   |
| Instant solutions, detailed step-by-step logic, and clean code blocks         |
+-------------------------------------------------------------------------------+
| Select Programming Language:                                                  |
| [ Python ▾ ]  ( Options: Python, JavaScript, C++, Java, Rust, SQL, Auto-Detect)|
+-------------------------------------------------------------------------------+
| Problem Description or Code Snippet:                                          |
| +---------------------------------------------------------------------------+ |
| | Write a python function to find all prime numbers up to N using sieve...  | |
| |                                                                           | |
| |                                                                           | |
| +---------------------------------------------------------------------------+ |
| [ 🎙️ Voice Input ]  [ 📷 Camera / Image OCR Scan ]        [ 120 / 2000 chars ]  |
+-------------------------------------------------------------------------------+
|                                [ 🚀 Solve Problem ]                           |
+-------------------------------------------------------------------------------+
|                                                                               |
|  OUTPUT CARD (Appears on Solve)                                               |
|  +-------------------------------------------------------------------------+  |
|  | 🎯 Solution & Explanation                              [ 📋 Copy ]      |  |
|  | ----------------------------------------------------------------------- |  |
|  |  Step 1: Initialize boolean array of size N+1 set to True...            |  |
|  |                                                                         |  |
|  |  ```python                                                              |  |
|  |  def sieve_of_eratosthenes(n):                                          |  |
|  |      is_prime = [True] * (n + 1)                                        |  |
|  |      ...                                                                |  |
|  |  ```                                                                    |  |
|  +-------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------+
```

### Interactive Features
1. **Language Dropdown Selector**: Sets target context for logic and code syntax.
2. **Multi-input Support**:
   * Direct typing in expandable textarea.
   * **Voice Input**: Web Speech API speech-to-text integration (`VoiceInputButton.tsx`).
   * **Camera Scan**: WebRTC stream or image upload OCR extraction (`CameraOCRModal.tsx`).
3. **Solve Action Trigger**: Calls `/api/solve` backend endpoint, streaming or rendering formatted Markdown with syntax-highlighted code blocks and copy triggers.

---

## 4. Tab 2: Code Converter (`Converter`)

### Purpose
Seamlessly translates code algorithms from one programming language into another while preserving variable logic and structural efficiency.

### ASCII Wireframe
```
+-------------------------------------------------------------------------------+
| 🔄 AI Code Converter                                                          |
| Translate code across Python, JavaScript, C++, Java, Go, Rust, and TypeScript |
+-------------------------------------------------------------------------------+
| Source Language:                           Target Language:                   |
| [ Python ▾ ]                               [ C++ ▾ ]                          |
+------------------------------------------+------------------------------------+
| SOURCE CODE INPUT                        | CONVERTED OUTPUT                   |
| +--------------------------------------+ | +--------------------------------+ |
| | def fibonacci(n):                    | | | #include <iostream>            | |
| |     if n <= 1:                       | | | int fibonacci(int n) {        | |
| |         return n                     | | |     if (n <= 1) return n;     | |
| |     return fibonacci(n-1) + ...      | | |     return fibonacci(n-1)...   | |
| |                                      | | | }                            | |
| +--------------------------------------+ | +--------------------------------+ |
| [ 📷 OCR Input ] [ 🧹 Clear ]             | [ 📋 Copy Code ] [ ⚡ Test Run ]   |
+------------------------------------------+------------------------------------+
|                               [ 🔄 Convert Code ]                             |
+-------------------------------------------------------------------------------+
```

### Key Interactions
* **Dual Language Controls**: Source and Target selection menus with smart swap toggle (`⇄`).
* **Side-by-Side (Desktop) / Stacked (Mobile) Layout**: Clear visual separation between input and translated code output.
* **API Integration**: Sends payload to `/api/convert` and returns cleanly formatted code snippet.

---

## 5. Tab 3: AI Code Debugger (`Debugger`)

### Purpose
Diagnoses bugs, syntax errors, logic flaws, and runtime exceptions. Provides a clear root-cause breakdown alongside bug-fixed code.

### ASCII Wireframe
```
+-------------------------------------------------------------------------------+
| 🐛 AI Code Debugger                                                            |
| Detect bugs, memory leaks, syntax errors, and get instant line-by-line fixes   |
+-------------------------------------------------------------------------------+
| Buggy Code Snippet:                                                           |
| +---------------------------------------------------------------------------+ |
| | const total = items.reduce((acc, item) => acc + item.price); // Missing 0 | |
| +---------------------------------------------------------------------------+ |
| Error Message / Console Log (Optional):                                       |
| +---------------------------------------------------------------------------+ |
| | TypeError: Cannot read properties of undefined (reading 'price')          | |
| +---------------------------------------------------------------------------+ |
|                                 [ 🔍 Analyze & Fix Bug ]                      |
+-------------------------------------------------------------------------------+
|                                                                               |
|  DEBUG ANALYSIS RESULT                                                        |
|  +-------------------------------------------------------------------------+  |
|  | 🐞 Root Cause Analysis                                                  |  |
|  | The reduce accumulator lacks an initial value parameter (0). When items |  |
|  | is empty, JavaScript throws a TypeError.                                 |  |
|  | ----------------------------------------------------------------------- |  |
|  | ✅ Corrected Code                                       [ 📋 Copy ]      |  |
|  | ```javascript                                                           |  |
|  | const total = items.reduce((acc, item) => acc + (item?.price || 0), 0); |  |
|  | ```                                                                     |  |
|  +-------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------+
```

---

## 6. Tab 4: AI Tutor & Concept Explainer (`Tutor`)

### Purpose
An interactive subject tutor catering to K-12 and College students across Mathematics, Computer Science, Physics, Chemistry, English, and General Knowledge.

### ASCII Wireframe
```
+-------------------------------------------------------------------------------+
| 🎓 AI Academic Tutor                                                          |
| Ask questions, request simplified analogies, or solve general subject problems |
+-------------------------------------------------------------------------------+
| Select Subject Discipline:                                                    |
| ( [💻 Computer Science]  [📐 Math]  [🧪 Science]  [📚 English]  [🌐 GK] )    |
+-------------------------------------------------------------------------------+
| Quick Starter Prompts:                                                        |
| [ 💡 Explain Recursion with real life example ]  [ 📐 How does Big-O work? ]  |
+-------------------------------------------------------------------------------+
| Conversation Thread:                                                          |
| +---------------------------------------------------------------------------+ |
| | 👤 Student: Explain time complexity of QuickSort in simple terms.         | |
| |                                                                           | |
| | 🤖 AI Tutor: QuickSort works on the divide-and-conquer strategy:          | |
| |    - Average Case: O(N log N) when pivots split arrays evenly.            | |
| |    - Worst Case: O(N²) if array is already sorted and pivot is poor.     | |
| +---------------------------------------------------------------------------+ |
+-------------------------------------------------------------------------------+
| Ask your question:                                                            |
| [ Write question here...                         ] [ 🎙️ ]  [ 🚀 Send ]         |
+-------------------------------------------------------------------------------+
```

---

## 7. Tab 5: Interactive Learning & Code Quizzes (`Learn`)

### Purpose
Generates dynamic, tricky code output prediction quizzes and multiple-choice programming tests to build student mastery.

### ASCII Wireframe
```
+-------------------------------------------------------------------------------+
| 🧠 Programming Practice & Tricky Quizzes                                      |
| Test your knowledge with dynamic code output prediction challenges            |
+-------------------------------------------------------------------------------+
| Filter Language: [ Python ▾ ]    Quiz Difficulty: [ Intermediate ▾ ]           |
|                                                     [ 🎲 Generate New Quiz ] |
+-------------------------------------------------------------------------------+
| QUESTION 1 / 3: What is the output of the following code snippet?             |
| +---------------------------------------------------------------------------+ |
| | x = [1, 2, 3]                                                             | |
| | y = x                                                                     | |
| | y.append(4)                                                               | |
| | print(len(x))                                                             | |
| +---------------------------------------------------------------------------+ |
|                                                                               |
| Options:                                                                      |
|  [ A ]  3                                  [ B ]  4  (Selected ✅)            |
|  [ C ]  TypeError                          [ D ]  Undefined                   |
|                                                                               |
| [ 💡 View Explanation ]                                     [ ➡️ Next Question ]|
+-------------------------------------------------------------------------------+
| EXPLANATION MODAL / ACCORDION                                                 |
| ✅ Correct! In Python, list assignment (`y = x`) creates a reference to the   |
| same object in memory. Appending to `y` modifies `x` as well.                 |
+-------------------------------------------------------------------------------+
```

---

## 8. Modal 1: Camera OCR & Image Scanner (`CameraOCRModal`)

### Purpose
Captures text or code from physical textbooks, handwritten notes, or screens using live webcam stream or file drop.

### ASCII Wireframe
```
+-------------------------------------------------------------------------------+
| 📷 Scan Problem or Textbook Page                                         [ X ] |
+-------------------------------------------------------------------------------+
|  CAMERA VIEWFINDER / DROPZONE                                                 |
|  +-------------------------------------------------------------------------+  |
|  |                                                                         |  |
|  |                  [ 📹 Live Video Feed Stream / Canvas ]                 |  |
|  |                             or                                          |  |
|  |                  [ 📁 Drag & Drop Image File Here ]                      |  |
|  |                                                                         |  |
|  +-------------------------------------------------------------------------+  |
|  [ 📸 Capture Photo ]  [ 📁 Browse Files ]  [ 🔄 Switch Camera ]              |  |
+-------------------------------------------------------------------------------+
| EXTRACTED TEXT PREVIEW                                                        |
| +---------------------------------------------------------------------------+ |
| | "Given a binary tree, write a function to compute its maximum depth..."   | |
| +---------------------------------------------------------------------------+ |
|                                             [ ❌ Retake ]  [ ✅ Use This Text ] |
+-------------------------------------------------------------------------------+
```

---

## 9. Modal 2: Activity History Drawer (`HistoryModal`)

### Purpose
Displays saved problem solves, converted scripts, debugging logs, and tutoring chats stored in user local state.

### ASCII Wireframe
```
+-------------------------------------------------------------------------------+
| 📜 Activity History & Saved Solves                                       [ X ] |
+-------------------------------------------------------------------------------+
| [ All ]   [ ⚡ Solves ]   [ 🔄 Conversions ]   [ 🐛 Debugs ]   [ 🎓 Tutor ]  |
| [ 🔍 Search past activity...                                             ]    |
+-------------------------------------------------------------------------------+
|  HISTORY ITEMS LIST                                                           |
|  +-------------------------------------------------------------------------+  |
|  | ⚡ Python Sieve of Eratosthenes                     2026-07-30 05:15  |  |
|  | Input: "Write a python function to find all prime..."                   |  |
|  | [ 👁️ View Full Output ]   [ 📋 Copy Code ]   [ 🗑️ Delete ]              |  |
|  +-------------------------------------------------------------------------+  |
|  | 🔄 Python to C++ Fibonacci                                2026-07-29    |  |
|  | Input: "def fibonacci(n)..."                                            |  |
|  | [ 👁️ View Full Output ]   [ 📋 Copy Code ]   [ 🗑️ Delete ]              |  |
|  +-------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------+
|                                                       [ 🗑️ Clear All History ] |
+-------------------------------------------------------------------------------+
```

---

## 10. Modal 3: Authentication & Onboarding (`AuthView`)

### Purpose
Allows user sign-in/up with custom profile configuration (school grade, college year, software engineering path).

### ASCII Wireframe
```
+-------------------------------------------------------------------------------+
| 🔑 Sign In to CodeSolver AI                                            [ X ] |
+-------------------------------------------------------------------------------+
| Full Name:       [ Enter your full name...                                 ] |
| Email Address:   [ student@university.edu                                  ] |
| Password:        [ ••••••••••••                                            ] |
+-------------------------------------------------------------------------------+
| Student Category:                                                             |
| (•) School Student    ( ) College Student    ( ) Working Professional         |
|                                                                               |
| Study Field / Major:                                                          |
| [ Computer Science & Engineering ▾ ]                                         |
+-------------------------------------------------------------------------------+
|                                [ 🔓 Create Account / Sign In ]                 |
|                                                                               |
|                           — OR CONTINUE WITH —                                |
|                        [ 🌐 Sign In with Google ]                             |
+-------------------------------------------------------------------------------+
```

---

## 11. Modal 4: User Profile & Preferences (`ProfileView`)

### Purpose
Manages user statistics, daily solve allowances, theme preferences, and subscription status.

### ASCII Wireframe
```
+-------------------------------------------------------------------------------+
| 👤 Student Profile & Account Settings                                   [ X ] |
+-------------------------------------------------------------------------------+
|  +-------------------------------------------------------------------------+  |
|  | [ Avatar ]  Alex Johnson                                                |  |
|  |             College Student • 1st Year CSE                              |  |
|  |             Status: ⚡ FREE TIER (12/15 Solves Remaining)                |  |
|  +-------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------+
|  STUDY STATISTICS                                                             |
|  +---------------------------+ +------------------------+ +----------------+  |
|  |  🔥 7 Day Streak         | |  ⚡ 42 Solves Completed| |  🧠 85% Accuracy|  |
|  +---------------------------+ +------------------------+ +----------------+  |
+-------------------------------------------------------------------------------+
|  PREFERENCES & SUBSCRIPTION                                                   |
|  - App Theme:               ( ) Light Theme   (•) Dark Obsidian Theme         |
|  - Sound Effects:           [ ON / OFF ]                                      |
|  - Unlimited Solves Pass:   [ 🌟 Upgrade to Premium PRO ]                     |
+-------------------------------------------------------------------------------+
|                                                            [ 🚪 Sign Out ]    |
+-------------------------------------------------------------------------------+
```

---

## Summary Matrix

| View / Screen | File Location | Key API Endpoints | Primary Features |
|---|---|---|---|
| **Home Solver** | `src/components/Tabs/HomeSolver.tsx` | `/api/solve` | Multi-language code solver, voice & OCR input, markdown code formatting |
| **Code Converter** | `src/components/Tabs/Converter.tsx` | `/api/convert` | Language-to-language translation, side-by-side snippet preview |
| **Code Debugger** | `src/components/Tabs/Debugger.tsx` | `/api/debug` | Root-cause bug detection, syntax fixing, error log inspection |
| **AI Tutor** | `src/components/Tabs/Tutor.tsx` | `/api/tutor` | Subject-specific teaching, simple math/concept explanations |
| **Quizzes & Practice** | `src/components/Tabs/Learn.tsx` | `/api/quizzes/generate` | Dynamic tricky code output prediction quizzes, instant explanations |
| **Camera OCR Scanner** | `src/components/CameraOCRModal.tsx` | `/api/ocr/scan` | Live webcam feed capture, image drag-and-drop OCR text extraction |
| **Activity History** | `src/App.tsx` | LocalStorage | Log search, filter tabs, saved code exports, item deletion |
| **Auth & Onboarding** | `src/components/AuthView.tsx` | LocalStorage / Auth | User classification, profile configuration, session management |
| **Profile & Settings** | `src/components/ProfileView.tsx` | LocalStorage | Theme toggle, solve allowance tracking, study streak stats |

---
*Generated for CodeSolver AI application layout structure.*
