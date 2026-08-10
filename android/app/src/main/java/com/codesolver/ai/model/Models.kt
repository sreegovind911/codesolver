package com.codesolver.ai.model

enum class TabRoute(val title: String, val iconName: String) {
    HOME("Home", "⚡"),
    CONVERTER("Convert", "🔄"),
    DEBUGGER("Debug", "🐛"),
    TUTOR("Tutor", "🎓"),
    LEARN("Practice", "🧠")
}

data class SolveHistoryItem(
    val id: String,
    val type: String,
    val title: String,
    val input: String,
    val output: String,
    val language: String,
    val timestamp: String = "Just now"
)

data class QuizItem(
    val id: String,
    val language: String,
    val code: String,
    val options: List<String>,
    val correctAnswer: String,
    val explanation: String
)

data class UserProfile(
    val name: String = "Student Developer",
    val email: String = "student@university.edu",
    val role: String = "College Student",
    val major: String = "Computer Science & Eng",
    val streakDays: Int = 7,
    val solvesUsed: Int = 12,
    val maxSolves: Int = 15,
    val isPro: Boolean = false
)

data class TutorMessage(
    val id: String,
    val sender: String, // "USER" or "BOT"
    val text: String,
    val timestamp: Long = System.currentTimeMillis()
)
