# CodeSolver AI — Complete Flutter Rebuild Specification & Architecture Guide

A comprehensive, production-ready blueprint for rebuilding the **CodeSolver AI** mobile and web application using **Flutter (Dart)**. This document contains full UI/UX design specifications, color theme tokens, navigation models, page layout wireframes, feature breakdowns, state management strategies, API mappings, and Dart data models.

---

## Table of Contents
1. [App Overview & Core Value Proposition](#1-app-overview--core-value-proposition)
2. [Recommended Flutter Stack & Dependencies](#2-recommended-flutter-stack--dependencies)
3. [Project Directory & File Architecture](#3-project-directory--file-architecture)
4. [Design System & Color Theme Tokens](#4-design-system--color-theme-tokens)
5. [Global Navigation & Shell Architecture](#5-global-navigation--shell-architecture)
6. [Detailed Page & Tab Specifications](#6-detailed-page--tab-specifications)
   - [Tab 1: Home — AI Code & Math Solver (`HomeSolverScreen`)](#tab-1-home--ai-code--math-solver-homesolverscreen)
   - [Tab 2: Code Converter (`ConverterScreen`)](#tab-2-code-converter-converterscreen)
   - [Tab 3: AI Code Debugger (`DebuggerScreen`)](#tab-3-ai-code-debugger-debuggerscreen)
   - [Tab 4: AI Tutor & Academic Doubt Explainer (`TutorScreen`)](#tab-4-ai-tutor--academic-doubt-explainer-tutorscreen)
   - [Tab 5: Practice & Code Quiz Arena (`LearnScreen`)](#tab-5-practice--code-quiz-arena-learnscreen)
   - [Special Feature: Textbook AI Analyzer & Quiz Generator (`BookAnalyzerScreen`)](#special-feature-textbook-ai-analyzer--quiz-generator-bookanalyzerscreen)
7. [Modals, Drawers & Overlay Specs](#7-modals-drawers--overlay-specs)
   - [Modal 1: Camera OCR Scanner (`CameraOCRModal`)](#modal-1-camera-ocr-scanner-cameraocrmodal)
   - [Modal 2: Activity History Drawer (`HistoryDrawer`)](#modal-2-activity-history-drawer-historydrawer)
   - [Modal 3: User Authentication & Onboarding (`AuthScreen`)](#modal-3-user-authentication--onboarding-authscreen)
   - [Modal 4: Profile & Preferences (`ProfileScreen`)](#modal-4-profile--preferences-profilescreen)
8. [Data Models in Dart](#8-data-models-in-dart)
9. [API Integration & Gemini Backend Service Layer](#9-api-integration--gemini-backend-service-layer)
10. [State Management & Local Persistence (`Riverpod` / `SharedPreferences`)](#10-state-management--local-persistence)

---

## 1. App Overview & Core Value Proposition

**CodeSolver AI** is an all-in-one AI coding assistant, debugger, language converter, and academic tutor built for students (K-12 & College), self-learners, and developers. 

### Key Capabilities
- **Instant Code & Math Solver**: Multi-language support (Python, JS, C++, Java, Rust, SQL, Go, Swift, Kotlin, Bash).
- **Cross-Language Converter**: Translates algorithms between languages while preserving logic.
- **Line-by-Line Debugger**: Pinpoints root causes, syntax errors, and provides fixed, copyable code.
- **Interactive AI Tutor**: Subject-focused learning assistant (Computer Science, Mathematics, Physics, Chemistry, English, GK).
- **Tricky Code Output Quizzes**: Dynamic output prediction tests generated via Gemini AI.
- **AI Textbook Analyzer & OCR Scanner**: Camera scan textbook pages to extract syllabus, solve exercises, and generate chapter quizzes.
- **Solve Allowance Engine**: Tracks daily free solves (e.g. 15 free solves/day), rewarded ads to earn extra solves, and optional PRO subscription.

---

## 2. Recommended Flutter Stack & Dependencies

Add the following to your Flutter `pubspec.yaml`:

```yaml
name: codesolver_ai
description: "AI coding assistant and academic tutor built in Flutter"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

  # State Management
  flutter_riverpod: ^2.5.1

  # Networking & Http
  dio: ^5.4.3+1
  http: ^1.2.1

  # Local Persistence
  shared_preferences: ^2.2.3
  hive: ^2.2.3
  hive_flutter: ^1.1.0

  # Code Syntax Highlighting & Markdown Rendering
  flutter_markdown: ^0.7.2
  flutter_highlight: ^0.7.0

  # Hardware Features: Camera, OCR & Speech STT
  camera: ^0.10.5+9
  image_picker: ^1.1.1
  speech_to_text: ^6.6.1

  # UI Design & Icons
  lucide_icons: ^0.257.0
  google_fonts: ^6.2.1
  flutter_animate: ^4.5.0
  shimmer: ^3.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
```

---

## 3. Project Directory & File Architecture

Organize your codebase using a modular, feature-first or layer-first clean architecture:

```
lib/
├── main.dart                          # App Entrypoint & Theme Binding
├── app_router.dart                    # GoRouter or Navigation State Handler
│
├── core/
│   ├── theme/
│   │   ├── app_colors.dart            # Dark Obsidian & Light Material Color Tokens
│   │   ├── app_typography.dart        # GoogleFonts (Plus Jakarta Sans & JetBrains Mono)
│   │   └── app_theme.dart             # ThemeData definitions for Dark & Light modes
│   ├── utils/
│   │   ├── constants.dart             # API Base URLs, Supported Languages list
│   │   └── clipboard_helper.dart      # Copy snippet helper
│   └── services/
│       ├── api_service.dart           # Dio HTTP client wrapper for backend /api endpoints
│       ├── local_storage_service.dart # SharedPreferences wrapper for profile & history
│       └── speech_service.dart        # SpeechToText wrapper
│
├── models/
│   ├── user_profile.dart              # UserProfile model
│   ├── history_item.dart              # HistoryItem model
│   ├── quiz_question.dart             # Quiz question & option model
│   └── textbook_analysis.dart         # Textbook chapter/syllabus model
│
├── providers/
│   ├── theme_provider.dart            # Theme state ('dark' | 'light')
│   ├── auth_provider.dart             # Logged in state & user profile
│   ├── solves_counter_provider.dart   # Daily free solves logic
│   ├── history_provider.dart          # Activity history state
│   └── active_tab_provider.dart       # Bottom nav index controller
│
├── views/
│   ├── shell/
│   │   ├── main_shell_screen.dart     # Scaffold with TopBar, Active Tab & BottomNavBar
│   │   ├── components/
│   │   │   ├── top_header_bar.dart    # Brand, Solves Counter, Theme & History triggers
│   │   │   └── bottom_nav_bar.dart    # 5-Tab responsive navbar with animations
│   │
│   ├── tabs/
│   │   ├── home_solver_screen.dart    # Tab 1: AI Code & Math Solver
│   │   ├── converter_screen.dart      # Tab 2: Code Converter
│   │   ├── debugger_screen.dart       # Tab 3: Code Debugger
│   │   ├── tutor_screen.dart          # Tab 4: AI Tutor Chat
│   │   └── learn_screen.dart          # Tab 5: Tricky Code Quizzes
│   │
│   ├── features/
│   │   └── book_analyzer_screen.dart  # Textbook AI Analyzer & Quiz Arena
│   │
│   └── modals/
│       ├── camera_ocr_modal.dart      # Live Camera OCR Scanner bottom sheet/dialog
│       ├── history_drawer.dart        # Sliding drawer with search & history cards
│       ├── auth_screen.dart           # Sign In / Sign Up modal
│       └── profile_screen.dart        # User profile & subscription settings
│
└── widgets/
    ├── code_block_view.dart           # Custom syntax-highlighted code container
    ├── language_dropdown.dart         # Reusable language selection menu
    ├── voice_input_button.dart        # STT microphone floating action button
    ├── stat_badge.dart                # Solves counter badge widget
    └── prompt_chip.dart               # Quick question starter chip
```

---

## 4. Design System & Color Theme Tokens

### 1. Color Palette Tokens (`app_colors.dart`)

```dart
import 'package:flutter/material.dart';

class AppColors {
  // --- DARK OBSIDIAN THEME (DEFAULT) ---
  static const Color darkBackground = Color(0xFF0B0F19);
  static const Color darkSurface = Color(0xFF111827);
  static const Color darkSurfaceVariant = Color(0xFF1F2937);
  static const Color darkBorder = Color(0xFF374151);

  // --- LIGHT MATERIAL GREEN THEME ---
  static const Color lightBackground = Color(0xFFFFFFFF);
  static const Color lightSurface = Color(0xFFF8FAFC);
  static const Color lightSurfaceVariant = Color(0xFFF1F5F9);
  static const Color lightBorder = Color(0xFFE2E8F0);

  // --- ACCENTS & BRANDING ---
  static const Color primaryCyan = Color(0xFF06B6D4);     // Cyan Accent
  static const Color primaryEmerald = Color(0xFF16A34A);  // Material Green
  static const Color secondaryIndigo = Color(0xFF6366F1); // Indigo Accent
  static const Color accentPurple = Color(0xFFA855F7);    // Purple Accent
  static const Color errorRose = Color(0xFFF43F5E);       // Red / Bug Error Accent
  static const Color warningAmber = Color(0xFFF59E0B);    // Gold / Ad Streak Accent

  // --- TEXT COLORS ---
  static const Color textDarkPrimary = Color(0xFFF9FAFB);
  static const Color textDarkMuted = Color(0xFF9CA3AF);
  static const Color textLightPrimary = Color(0xFF0F172A);
  static const Color textLightMuted = Color(0xFF64748B);
}
```

### 2. Typography Scale (`app_typography.dart`)
- **Body & UI**: `GoogleFonts.plusJakartaSans()`
- **Code & Editor Snippets**: `GoogleFonts.jetBrainsMono()`

---

## 5. Global Navigation & Shell Architecture

### Visual Layout Diagram
```
+-------------------------------------------------------------------------------+
|  [Logo] CodeSolver AI    [Solves: 12/15]  [☀️/🌙]  [📜 History]  [👤 Profile] |
+-------------------------------------------------------------------------------+
|                                                                               |
|                         < ACTIVE TAB VIEW ROUTE >                             |
|       (HomeSolver | Converter | Debugger | Tutor | Learn)                     |
|                                                                               |
+-------------------------------------------------------------------------------+
|  [⚡ Solve]    [🔄 Convert]   [🐛 Debug]   [🎓 Tutor]   [🧠 Practice & Quiz]  |
+-------------------------------------------------------------------------------+
```

### Main Shell Implementation Pattern (`main_shell_screen.dart`)
- Use a `Scaffold` with a custom `PreferredSizeWidget` for the top header bar.
- Use `IndexedStack` or `PageView` to maintain state across the 5 main navigation tabs.
- Custom animated `BottomNavigationBar` built with `flutter_animate` or standard `NavigationBar`.

---

## 6. Detailed Page & Tab Specifications

### Tab 1: Home — AI Code & Math Solver (`HomeSolverScreen`)

#### Purpose
Enables users to input a programming question, algorithm logic requirement, or math problem and get formatted code explanations with copyable code blocks.

#### Key UI Elements & Layout
1. **Header Banner**: "AI Problem & Code Solver" subtitle.
2. **Language Selector Dropdown**: Single selection with choices like Python, JavaScript, C++, Java, Rust, Go, SQL, Auto-Detect.
3. **Multi-line Text Field**: Expandable text input (min lines 4, max 10) with character count indicator.
4. **Input Control Toolbar**:
   - `VoiceInputButton`: Toggles microphone speech-to-text recording.
   - `CameraButton`: Opens `CameraOCRModal` to scan code from screen or notebook.
5. **Action Button**: Primary `ElevatedButton` ("🚀 Solve Problem") with glowing cyan/green gradient background.
6. **Output Response Card**:
   - Rendered using `flutter_markdown` and `flutter_highlight`.
   - Header with "Copy All Code" button.
   - Step-by-step logic formatted cleanly with bullet points.

#### API Route Mapped
- `POST /api/solve`
- **Request Body**: `{ "prompt": string, "language": string }`
- **Response**: `{ "text": string }`

---

### Tab 2: Code Converter (`ConverterScreen`)

#### Purpose
Translates source code from one programming language into a target language while maintaining structural integrity.

#### Key UI Elements & Layout
1. **Source & Target Dropdowns**: Two side-by-side dropdown buttons with an interactive Swap button (`⇄`) between them.
2. **Source Code Editor Panel**: Multi-line `TextField` formatted in monospace font (`JetBrains Mono`). Includes OCR button and "Clear" trigger.
3. **Convert Trigger Button**: Primary action button ("🔄 Convert Code").
4. **Converted Output View**:
   - Displays output code in a styled box.
   - Includes "Copy Code" button and "Test Run / Verify" badge.

#### API Route Mapped
- `POST /api/convert`
- **Request Body**: `{ "code": string, "sourceLanguage": string, "targetLanguage": string }`
- **Response**: `{ "text": string }`

---

### Tab 3: AI Code Debugger (`DebuggerScreen`)

#### Purpose
Diagnoses code bugs, logic flaws, and runtime exceptions. Provides a clear root-cause analysis and corrected code.

#### Key UI Elements & Layout
1. **Buggy Code Input Box**: High-contrast text area for pasting non-working code.
2. **Error Log Field (Optional)**: Secondary input for stack traces, compiler output, or terminal console logs.
3. **Debug Trigger**: Action button ("🔍 Analyze & Fix Bug").
4. **Diagnosis Card**:
   - **Root Cause Section**: Highlighted in subtle red/rose tint with a bug icon.
   - **Corrected Code Block**: Highlighted in emerald green tint with a copy button.

#### API Route Mapped
- `POST /api/debug`
- **Request Body**: `{ "code": string }`
- **Response**: `{ "text": string }`

---

### Tab 4: AI Tutor & Academic Doubt Explainer (`TutorScreen`)

#### Purpose
Interactive conversational chat assistant for general computer science, mathematics, physics, chemistry, english, and general knowledge questions.

#### Key UI Elements & Layout
1. **Discipline Filter Chips**: Horizontal scroll view with options:
   - 💻 Computer Science
   - 📐 Mathematics
   - 🧪 Physics & Chemistry
   - 📚 English & Humanities
   - 🌐 General Knowledge
2. **Starter Prompt Chips**: Quick-click questions (e.g. "Explain Recursion with a real-life analogy", "How does Big-O work?").
3. **Chat Thread View**: Vertical list of chat bubble cards (`UserBubble` aligned right, `AITutorBubble` aligned left with avatar).
4. **Bottom Message Bar**: `TextField` with microphone voice input button and Send icon button.

#### API Route Mapped
- `POST /api/tutor`
- **Request Body**: `{ "subject": string, "query": string }`
- **Response**: `{ "text": string }`

---

### Tab 5: Practice & Code Quiz Arena (`LearnScreen`)

#### Purpose
Interactive output-prediction quizzes designed to test developer knowledge against code traps and tricky language behaviors.

#### Key UI Elements & Layout
1. **Quiz Filter Toolbar**: Language selector (e.g. Python, JS, C++, Random) and "🎲 Generate New Quiz" button.
2. **Code Challenge Card**:
   - Monospace code block showing a tricky 3-8 line snippet.
3. **Multiple Choice Options**: 4 selectable option buttons (`Option A`, `Option B`, `Option C`, `Option D`).
   - Selected option highlights green if correct, or red if wrong.
4. **Instant Feedback Accordion**:
   - Displays detailed explanation upon selection.
5. **Next Question Button**: Advances to the next generated question.

#### API Route Mapped
- `POST /api/quizzes/generate`
- **Request Body**: `{ "language": string, "count": int }`
- **Response**: `{ "quizzes": [ { "id": string, "language": string, "code": string, "options": string[], "correctAnswer": string, "explanation": string } ] }`

---

### Special Feature: Textbook AI Analyzer & Quiz Arena (`BookAnalyzerScreen`)

#### Purpose
Scan physical or PDF textbook covers, pages, or index chapters to extract syllabus structure, answer textbook questions, and generate chapter tests.

#### Key UI Elements & Layout
1. **Book Selection Header**: Upload cover photo or search book title (e.g. "NCERT Class 11 CS", "CLRS Introduction to Algorithms").
2. **Syllabus & Chapter Breakdown Card**: Displays extracted chapters and topics.
3. **Dual Mode Selector**:
   - **Mode A: Doubts & Exercise Solver**: Ask specific questions about textbook chapters.
   - **Mode B: Chapter Quiz Generator**: Generates custom multiple-choice tests based on chapter content.

#### API Routes Mapped
- `POST /api/book/analyze`
- `POST /api/quizzes/textbook`

---

## 7. Modals, Drawers & Overlay Specs

### Modal 1: Camera OCR Scanner (`CameraOCRModal`)
- **Widget**: Custom `BottomSheet` or `Dialog` using Flutter `camera` package.
- **Controls**: Live viewfinder feed, shutter button, file picker button, retake button, and "Use Extracted Text" confirmation button.
- **Backend Endpoint**: `POST /api/scan` (sends base64 image string).

### Modal 2: Activity History Drawer (`HistoryDrawer`)
- **Widget**: Sliding `Drawer` or `EndDrawer`.
- **Features**:
  - Search bar to filter past activity.
  - Filter tabs: All, Solves, Conversions, Debugs, Tutor.
  - History cards displaying timestamp, language tag, input preview, full output viewer button, and delete trigger.
  - Persistent storage handled via Hive or `SharedPreferences`.

### Modal 3: User Authentication & Onboarding (`AuthScreen`)
- **Fields**: Full Name, Email, Password.
- **Student Category Segmented Control**: School Student, College Student, Self Learner, Teacher.
- **Study Field Dropdown**: Computer Science, Data Science, Web Development, Mechanical Engineering, etc.
- **Third-Party Auth**: Google Sign-In button integration.

### Modal 4: Profile & Preferences (`ProfileScreen`)
- **User Info Header**: Avatar, Name, Student Badge, Study Field.
- **Daily Solves Meter**: Visual progress bar showing remaining solves (e.g. `12 / 15 Solves Left`).
- **Rewarded Ad Trigger**: "Watch Ad to Earn +1 Free Solve" button.
- **Preferences**: Theme Switcher (Dark Obsidian / Light Material), Clear History button, Sign Out trigger.

---

## 8. Data Models in Dart

### 1. UserProfile Model (`lib/models/user_profile.dart`)

```dart
class UserProfile {
  final String fullName;
  final String userType; // 'school' | 'college' | 'self_learner' | 'teacher'
  final String classYear;
  final String studyField;
  final String? email;
  final bool isGuest;

  UserProfile({
    required this.fullName,
    required this.userType,
    required this.classYear,
    required this.studyField,
    this.email,
    this.isGuest = false,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      fullName: json['fullName'] ?? 'Guest Student',
      userType: json['userType'] ?? 'college',
      classYear: json['classYear'] ?? '1st Year',
      studyField: json['studyField'] ?? 'Computer Science',
      email: json['email'],
      isGuest: json['isGuest'] ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'fullName': fullName,
    'userType': userType,
    'classYear': classYear,
    'studyField': studyField,
    'email': email,
    'isGuest': isGuest,
  };
}
```

### 2. HistoryItem Model (`lib/models/history_item.dart`)

```dart
class HistoryItem {
  final String id;
  final String timestamp;
  final String type; // 'solve' | 'convert' | 'debug' | 'tutor'
  final String title;
  final String input;
  final String output;
  final String? language;

  HistoryItem({
    required this.id,
    required this.timestamp,
    required this.type,
    required this.title,
    required this.input,
    required this.output,
    this.language,
  });

  factory HistoryItem.fromJson(Map<String, dynamic> json) {
    return HistoryItem(
      id: json['id'],
      timestamp: json['timestamp'],
      type: json['type'],
      title: json['title'],
      input: json['input'],
      output: json['output'],
      language: json['language'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'timestamp': timestamp,
    'type': type,
    'title': title,
    'input': input,
    'output': output,
    'language': language,
  };
}
```

### 3. QuizQuestion Model (`lib/models/quiz_question.dart`)

```dart
class QuizQuestion {
  final String id;
  final String language;
  final String code;
  final List<String> options;
  final String correctAnswer;
  final String explanation;

  QuizQuestion({
    required this.id,
    required this.language,
    required this.code,
    required this.options,
    required this.correctAnswer,
    required this.explanation,
  });

  factory QuizQuestion.fromJson(Map<String, dynamic> json) {
    return QuizQuestion(
      id: json['id'] ?? DateTime.now().millisecondsSinceEpoch.toString(),
      language: json['language'] ?? 'Python',
      code: json['code'] ?? '',
      options: List<String>.from(json['options'] ?? []),
      correctAnswer: json['correctAnswer'] ?? '',
      explanation: json['explanation'] ?? '',
    );
  }
}
```

---

## 9. API Integration & Gemini Backend Service Layer

### ApiService Class (`lib/core/services/api_service.dart`)

```dart
import 'package:dio/dio.dart';

class ApiService {
  final Dio _dio = Dio(
    BaseOptions(
      baseUrl: 'https://your-cloud-run-backend-url.run.app', // Or localhost during development
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  // Solve Endpoint
  Future<String> solveProblem(String prompt, String language) async {
    final response = await _dio.post('/api/solve', data: {
      'prompt': prompt,
      'language': language,
    });
    return response.data['text'] ?? '';
  }

  // Convert Endpoint
  Future<String> convertCode(String code, String sourceLang, String targetLang) async {
    final response = await _dio.post('/api/convert', data: {
      'code': code,
      'sourceLanguage': sourceLang,
      'targetLanguage': targetLang,
    });
    return response.data['text'] ?? '';
  }

  // Debug Endpoint
  Future<String> debugCode(String code) async {
    final response = await _dio.post('/api/debug', data: {
      'code': code,
    });
    return response.data['text'] ?? '';
  }

  // Tutor Endpoint
  Future<String> askTutor(String query, String subject) async {
    final response = await _dio.post('/api/tutor', data: {
      'query': query,
      'subject': subject,
    });
    return response.data['text'] ?? '';
  }

  // Camera OCR Scan Endpoint
  Future<String> scanOCRImage(String base64Image, String taskType) async {
    final response = await _dio.post('/api/scan', data: {
      'image': base64Image,
      'taskType': taskType,
    });
    return response.data['text'] ?? '';
  }

  // Generate Quizzes Endpoint
  Future<List<dynamic>> generateQuizzes(String language, int count) async {
    final response = await _dio.post('/api/quizzes/generate', data: {
      'language': language,
      'count': count,
    });
    return response.data['quizzes'] ?? [];
  }
}
```

---

## 10. State Management & Local Persistence

### Riverpod Providers Setup Example

#### Theme Provider (`lib/providers/theme_provider.dart`)
```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final themeProvider = StateNotifierProvider<ThemeNotifier, ThemeMode>((ref) {
  return ThemeNotifier();
});

class ThemeNotifier extends StateNotifier<ThemeMode> {
  ThemeNotifier() : super(ThemeMode.dark) {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final isLight = prefs.getBool('is_light_theme') ?? false;
    state = isLight ? ThemeMode.light : ThemeMode.dark;
  }

  Future<void> toggleTheme() async {
    final prefs = await SharedPreferences.getInstance();
    if (state == ThemeMode.dark) {
      state = ThemeMode.light;
      await prefs.setBool('is_light_theme', true);
    } else {
      state = ThemeMode.dark;
      await prefs.setBool('is_light_theme', false);
    }
  }
}
```

#### Daily Free Solves Counter Provider (`lib/providers/solves_counter_provider.dart`)
```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final solvesProvider = StateNotifierProvider<SolvesNotifier, int>((ref) {
  return SolvesNotifier();
});

class SolvesNotifier extends StateNotifier<int> {
  static const int maxFreeSolves = 15;

  SolvesNotifier() : super(maxFreeSolves) {
    _loadSolves();
  }

  Future<void> _loadSolves() async {
    final prefs = await SharedPreferences.getInstance();
    final saved = prefs.getInt('remaining_solves') ?? maxFreeSolves;
    state = saved;
  }

  Future<bool> decrementSolve() async {
    if (state <= 0) return false;
    state = state - 1;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('remaining_solves', state);
    return true;
  }

  Future<void> addEarnedSolve() async {
    state = state + 1;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('remaining_solves', state);
  }
}
```

---

## Conclusion & Next Steps for Flutter Developers

To build this Flutter app:
1. Initialize a new Flutter project: `flutter create --org com.codesolver.ai codesolver_ai`.
2. Add dependencies listed in Section 2 to `pubspec.yaml`.
3. Create the directory tree listed in Section 3.
4. Copy theme tokens from Section 4 into your theme files.
5. Implement models, services, and providers from Sections 8, 9, and 10.
6. Build pages and widgets according to wireframes in Section 6 & 7.
7. Connect API base URL to your Cloud Run server endpoint and test on iOS/Android emulators!
