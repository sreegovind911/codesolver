package com.codesolver.ai.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.codesolver.ai.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.util.UUID

class CodeSolverViewModel : ViewModel() {

    private val _currentTab = MutableStateFlow(TabRoute.HOME)
    val currentTab: StateFlow<TabRoute> = _currentTab.asStateFlow()

    private val _isDarkMode = MutableStateFlow(true)
    val isDarkMode: StateFlow<Boolean> = _isDarkMode.asStateFlow()

    private val _userProfile = MutableStateFlow(UserProfile())
    val userProfile: StateFlow<UserProfile> = _userProfile.asStateFlow()

    private val _history = MutableStateFlow<List<SolveHistoryItem>>(emptyList())
    val history: StateFlow<List<SolveHistoryItem>> = _history.asStateFlow()

    // Modals
    private val _isHistoryOpen = MutableStateFlow(false)
    val isHistoryOpen: StateFlow<Boolean> = _isHistoryOpen.asStateFlow()

    private val _isProfileOpen = MutableStateFlow(false)
    val isProfileOpen: StateFlow<Boolean> = _isProfileOpen.asStateFlow()

    private val _isAuthOpen = MutableStateFlow(false)
    val isAuthOpen: StateFlow<Boolean> = _isAuthOpen.asStateFlow()

    private val _isCameraOCROpen = MutableStateFlow(false)
    val isCameraOCROpen: StateFlow<Boolean> = _isCameraOCROpen.asStateFlow()

    // Solver states
    private val _homeOutput = MutableStateFlow("")
    val homeOutput: StateFlow<String> = _homeOutput.asStateFlow()

    private val _isSolving = MutableStateFlow(false)
    val isSolving: StateFlow<Boolean> = _isSolving.asStateFlow()

    // Converter states
    private val _convertedCode = MutableStateFlow("")
    val convertedCode: StateFlow<String> = _convertedCode.asStateFlow()

    private val _isConverting = MutableStateFlow(false)
    val isConverting: StateFlow<Boolean> = _isConverting.asStateFlow()

    // Debugger states
    private val _debugOutput = MutableStateFlow("")
    val debugOutput: StateFlow<String> = _debugOutput.asStateFlow()

    private val _isDebuggings = MutableStateFlow(false)
    val isDebuggings: StateFlow<Boolean> = _isDebuggings.asStateFlow()

    // Tutor states
    private val _tutorMessages = MutableStateFlow<List<TutorMessage>>(
        listOf(
            TutorMessage("1", "BOT", "Hello! I am your AI Tutor. Ask me any conceptual, programming, or math question!")
        )
    )
    val tutorMessages: StateFlow<List<TutorMessage>> = _tutorMessages.asStateFlow()

    // Learn / Quizzes
    private val _quizzes = MutableStateFlow<List<QuizItem>>(
        listOf(
            QuizItem(
                id = "1",
                language = "Python",
                code = "x = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))",
                options = listOf("3", "4", "TypeError", "Undefined"),
                correctAnswer = "4",
                explanation = "In Python, lists are objects passed by reference. Appending to 'y' mutates the underlying list 'x'."
            ),
            QuizItem(
                id = "2",
                language = "JavaScript",
                code = "console.log(typeof (1 / 2));",
                options = listOf("\"integer\"", "\"number\"", "\"float\"", "\"NaN\""),
                correctAnswer = "\"number\"",
                explanation = "In JavaScript, all numbers are double-precision floating points of type 'number'."
            )
        )
    )
    val quizzes: StateFlow<List<QuizItem>> = _quizzes.asStateFlow()

    fun selectTab(tab: TabRoute) {
        _currentTab.value = tab
    }

    fun toggleDarkMode() {
        _isDarkMode.value = !_isDarkMode.value
    }

    fun setHistoryOpen(open: Boolean) {
        _isHistoryOpen.value = open
    }

    fun setProfileOpen(open: Boolean) {
        _isProfileOpen.value = open
    }

    fun setAuthOpen(open: Boolean) {
        _isAuthOpen.value = open
    }

    fun setCameraOCROpen(open: Boolean) {
        _isCameraOCROpen.value = open
    }

    fun solveProblem(input: String, language: String) {
        if (input.isBlank()) return
        _isSolving.value = true

        viewModelScope.launch {
            kotlinx.coroutines.delay(1200)
            val outputText = """
                ### 🎯 AI Solution & Step-by-Step Logic
                
                **Language**: $language
                **Approach**: Standard optimal implementation with clean algorithmic structure.
                
                ```$language
                // CodeSolver AI Generated Solution
                fun solve(problemInput: String) {
                    println("Processing solution for: $problemInput")
                }
                ```
                
                **Complexity**: Time: O(N), Space: O(1).
            """.trimIndent()

            _homeOutput.value = outputText
            _isSolving.value = false

            val historyItem = SolveHistoryItem(
                id = UUID.randomUUID().toString(),
                type = "SOLVE",
                title = "Solve ($language)",
                input = input,
                output = outputText,
                language = language
            )
            _history.value = listOf(historyItem) + _history.value

            val current = _userProfile.value
            _userProfile.value = current.copy(solvesUsed = (current.solvesUsed + 1).coerceAtMost(current.maxSolves))
        }
    }

    fun convertCode(code: String, sourceLang: String, targetLang: String) {
        if (code.isBlank()) return
        _isConverting.value = true

        viewModelScope.launch {
            kotlinx.coroutines.delay(1000)
            val converted = "// Converted from $sourceLang to $targetLang\n// Generated by CodeSolver AI\n$code"
            _convertedCode.value = converted
            _isConverting.value = false

            val historyItem = SolveHistoryItem(
                id = UUID.randomUUID().toString(),
                type = "CONVERT",
                title = "Convert ($sourceLang -> $targetLang)",
                input = code,
                output = converted,
                language = targetLang
            )
            _history.value = listOf(historyItem) + _history.value
        }
    }

    fun debugCode(code: String, errorLog: String) {
        if (code.isBlank()) return
        _isDebuggings.value = true

        viewModelScope.launch {
            kotlinx.coroutines.delay(1100)
            val result = """
                ### 🐞 Root Cause Analysis
                The provided code fragment has a potential null pointer or unbound variable access.
                
                ### ✅ Corrected Code
                ```
                // Fixed Code
                $code
                ```
            """.trimIndent()
            _debugOutput.value = result
            _isDebuggings.value = false

            val historyItem = SolveHistoryItem(
                id = UUID.randomUUID().toString(),
                type = "DEBUG",
                title = "Code Debug",
                input = code,
                output = result,
                language = "Auto"
            )
            _history.value = listOf(historyItem) + _history.value
        }
    }

    fun sendTutorQuery(subject: String, query: String) {
        if (query.isBlank()) return
        val userMsg = TutorMessage(UUID.randomUUID().toString(), "USER", query)
        _tutorMessages.value = _tutorMessages.value + userMsg

        viewModelScope.launch {
            kotlinx.coroutines.delay(800)
            val botReply = "Under $subject: To answer '$query', here is a direct concise explanation..."
            val botMsg = TutorMessage(UUID.randomUUID().toString(), "BOT", botReply)
            _tutorMessages.value = _tutorMessages.value + botMsg
        }
    }

    fun clearHistory() {
        _history.value = emptyList()
    }
}
