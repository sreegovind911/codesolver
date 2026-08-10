package com.codesolver.ai.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BugReport
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codesolver.ai.ui.theme.CyanPrimary

@Composable
fun DebuggerScreen(
    debugOutput: String,
    isDebuggings: Boolean,
    onDebug: (code: String, errorLog: String) -> Unit
) {
    var buggyCode by remember { mutableStateOf("") }
    var errorLog by remember { mutableStateOf("") }
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        Text(
            text = "🐛 AI Code Debugger",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = "Detect bugs, memory leaks, and get instant line-by-line fixes.",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = buggyCode,
            onValueChange = { buggyCode = it },
            label = { Text("Buggy Code Snippet") },
            placeholder = { Text("Paste your buggy code here...") },
            modifier = Modifier
                .fillMaxWidth()
                .height(140.dp)
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = errorLog,
            onValueChange = { errorLog = it },
            label = { Text("Console Error / Exception (Optional)") },
            placeholder = { Text("TypeError: Cannot read properties of undefined...") },
            modifier = Modifier
                .fillMaxWidth()
                .height(80.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { onDebug(buggyCode, errorLog) },
            enabled = !isDebuggings && buggyCode.isNotBlank(),
            colors = ButtonDefaults.buttonColors(containerColor = CyanPrimary),
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
        ) {
            if (isDebuggings) {
                CircularProgressIndicator(modifier = Modifier.size(24.dp), color = Color.White)
            } else {
                Icon(Icons.Default.BugReport, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Analyze & Fix Bug", fontWeight = FontWeight.Bold)
            }
        }

        if (debugOutput.isNotBlank()) {
            Spacer(modifier = Modifier.height(20.dp))
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Debug Report & Fixed Code", fontWeight = FontWeight.Bold, color = CyanPrimary)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(debugOutput, fontFamily = FontFamily.Monospace, fontSize = 13.sp)
                }
            }
        }
    }
}
