package com.codesolver.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.FlashOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codesolver.ai.ui.components.VoiceInputButton
import com.codesolver.ai.ui.theme.CyanPrimary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeSolverScreen(
    output: String,
    isSolving: Boolean,
    onSolve: (input: String, language: String) -> Unit,
    onOpenCamera: () -> Unit
) {
    var problemInput by remember { mutableStateOf("") }
    var selectedLanguage by remember { mutableStateOf("Python") }
    var isLangMenuExpanded by remember { mutableStateOf(false) }

    val languages = listOf("Python", "JavaScript", "C++", "Java", "Rust", "SQL", "Auto-Detect")
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        Text(
            text = "⚡ AI Problem & Code Solver",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = "Instant solutions, step-by-step logic, and clean code blocks.",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Language Dropdown
        ExposedDropdownMenuBox(
            expanded = isLangMenuExpanded,
            onExpandedChange = { isLangMenuExpanded = it }
        ) {
            OutlinedTextField(
                value = selectedLanguage,
                onValueChange = {},
                readOnly = true,
                label = { Text("Target Language") },
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = isLangMenuExpanded) },
                modifier = Modifier
                    .fillMaxWidth()
                    .menuAnchor()
            )
            ExposedDropdownMenu(
                expanded = isLangMenuExpanded,
                onDismissRequest = { isLangMenuExpanded = false }
            ) {
                languages.forEach { lang ->
                    DropdownMenuItem(
                        text = { Text(lang) },
                        onClick = {
                            selectedLanguage = lang
                            isLangMenuExpanded = false
                        }
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Text input area
        OutlinedTextField(
            value = problemInput,
            onValueChange = { problemInput = it },
            placeholder = { Text("Write or paste your coding problem, math question, or algorithm prompt here...") },
            modifier = Modifier
                .fillMaxWidth()
                .height(160.dp)
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Input Action Row (Voice Input + Camera Scan)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                VoiceInputButton(onSpeechRecognized = { text ->
                    problemInput = if (problemInput.isBlank()) text else "$problemInput $text"
                })

                OutlinedIconButton(onClick = onOpenCamera) {
                    Icon(Icons.Default.CameraAlt, contentDescription = "Camera OCR Scan", tint = CyanPrimary)
                }
            }

            Text(
                text = "${problemInput.length} chars",
                fontSize = 11.sp,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { onSolve(problemInput, selectedLanguage) },
            enabled = !isSolving && problemInput.isNotBlank(),
            colors = ButtonDefaults.buttonColors(containerColor = CyanPrimary),
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
        ) {
            if (isSolving) {
                CircularProgressIndicator(modifier = Modifier.size(24.dp), color = Color.White)
            } else {
                Icon(Icons.Default.FlashOn, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Solve Problem", fontWeight = FontWeight.Bold)
            }
        }

        if (output.isNotBlank()) {
            Spacer(modifier = Modifier.height(20.dp))

            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "🎯 AI Solution",
                        fontWeight = FontWeight.Bold,
                        color = CyanPrimary,
                        fontSize = 16.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = output,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }
        }
    }
}
