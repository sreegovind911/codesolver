package com.codesolver.ai.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val ObsidianBackground = Color(0xFF0B0F19)
val ObsidianSurface = Color(0xFF111827)
val ObsidianCardBorder = Color(0xFF1E293B)
val CyanPrimary = Color(0xFF06B6D4)
val CyanSecondary = Color(0xFF0891B2)
val IndigoAccent = Color(0xFF6366F1)
val TextGrayMuted = Color(0xFF9CA3AF)
val TextLight = Color(0xFFF3F4F6)

val LightBackground = Color(0xFFF8FAFC)
val LightSurface = Color(0xFFFFFFFF)
val LightCardBorder = Color(0xFFE2E8F0)
val TextDark = Color(0xFF0F172A)

private val DarkColorScheme = darkColorScheme(
    primary = CyanPrimary,
    secondary = IndigoAccent,
    background = ObsidianBackground,
    surface = ObsidianSurface,
    onPrimary = Color.White,
    onBackground = TextLight,
    onSurface = TextLight,
    surfaceVariant = ObsidianCardBorder
)

private val LightColorScheme = lightColorScheme(
    primary = CyanSecondary,
    secondary = IndigoAccent,
    background = LightBackground,
    surface = LightSurface,
    onPrimary = Color.White,
    onBackground = TextDark,
    onSurface = TextDark,
    surfaceVariant = LightCardBorder
)

@Composable
fun CodeSolverTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
