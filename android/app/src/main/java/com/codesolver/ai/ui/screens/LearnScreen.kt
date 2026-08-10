package com.codesolver.ai.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Help
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codesolver.ai.model.QuizItem
import com.codesolver.ai.ui.theme.CyanPrimary

@Composable
fun LearnScreen(
    quizzes: List<QuizItem>
) {
    var currentIndex by remember { mutableIntStateOf(0) }
    var selectedOption by remember { mutableStateOf<String?>(null) }
    var showExplanation by remember { mutableStateOf(false) }

    val currentQuiz = quizzes.getOrNull(currentIndex) ?: return
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        Text(
            text = "🧠 Practice & Tricky Quizzes",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = "Test your coding output prediction skills.",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(shape = RoundedCornerShape(12.dp), color = CyanPrimary.copy(alpha = 0.15f)) {
                Text(
                    text = "Question ${currentIndex + 1} of ${quizzes.size} (${currentQuiz.language})",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = CyanPrimary,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                )
            }

            TextButton(onClick = {
                selectedOption = null
                showExplanation = false
                currentIndex = (currentIndex + 1) % quizzes.size
            }) {
                Text("Next Quiz ➡️")
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Code snippet box
        Card(
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Text(
                    text = currentQuiz.code,
                    fontFamily = FontFamily.Monospace,
                    fontSize = 13.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text("Select Predicted Output:", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)

        Spacer(modifier = Modifier.height(8.dp))

        // Options grid / list
        currentQuiz.options.forEach { opt ->
            val isSelected = selectedOption == opt
            val isCorrect = opt == currentQuiz.correctAnswer

            val btnColor = when {
                selectedOption != null && isSelected && isCorrect -> Color(0xFF10B981)
                selectedOption != null && isSelected && !isCorrect -> Color(0xFFEF4444)
                else -> MaterialTheme.colorScheme.surfaceVariant
            }

            OutlinedButton(
                onClick = {
                    selectedOption = opt
                    showExplanation = true
                },
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.outlinedButtonColors(containerColor = btnColor),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(opt, fontWeight = FontWeight.Medium)
                    if (selectedOption != null && isSelected) {
                        Icon(
                            imageVector = if (isCorrect) Icons.Default.CheckCircle else Icons.Default.Help,
                            contentDescription = null,
                            tint = Color.White
                        )
                    }
                }
            }
        }

        if (showExplanation) {
            Spacer(modifier = Modifier.height(16.dp))
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = CyanPrimary.copy(alpha = 0.1f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("💡 Explanation", fontWeight = FontWeight.Bold, color = CyanPrimary)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(currentQuiz.explanation, fontSize = 13.sp)
                }
            }
        }
    }
}
