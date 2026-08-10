package com.codesolver.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codesolver.ai.model.TutorMessage
import com.codesolver.ai.ui.theme.CyanPrimary

@Composable
fun TutorScreen(
    messages: List<TutorMessage>,
    onSendQuery: (subject: String, query: String) -> Unit
) {
    var queryInput by remember { mutableStateOf("") }
    var selectedSubject by remember { mutableStateOf("Computer Science") }
    val subjects = listOf("Computer Science", "Math", "Science", "English", "General Knowledge")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "🎓 AI Academic Tutor",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Subject Pills Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            subjects.take(3).forEach { subj ->
                FilterChip(
                    selected = selectedSubject == subj,
                    onClick = { selectedSubject = subj },
                    label = { Text(subj, fontSize = 11.sp) }
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Message Thread
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(messages) { msg ->
                val isUser = msg.sender == "USER"
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = if (isUser) Alignment.CenterEnd else Alignment.CenterStart
                ) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = if (isUser) CyanPrimary else MaterialTheme.colorScheme.surfaceVariant,
                        contentColor = if (isUser) Color.White else MaterialTheme.colorScheme.onSurface,
                        modifier = Modifier.widthIn(max = 280.dp)
                    ) {
                        Text(
                            text = msg.text,
                            fontSize = 13.sp,
                            modifier = Modifier.padding(12.dp)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = queryInput,
                onValueChange = { queryInput = it },
                placeholder = { Text("Ask a concept or question...") },
                modifier = Modifier.weight(1f),
                singleLine = true
            )

            Spacer(modifier = Modifier.width(8.dp))

            IconButton(
                onClick = {
                    if (queryInput.isNotBlank()) {
                        onSendQuery(selectedSubject, queryInput)
                        queryInput = ""
                    }
                },
                modifier = Modifier
                    .size(48.dp)
                    .background(CyanPrimary, RoundedCornerShape(12.dp))
            ) {
                Icon(Icons.Default.Send, contentDescription = "Send", tint = Color.White)
            }
        }
    }
}
