package com.codesolver.ai.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codesolver.ai.ui.theme.CyanPrimary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConverterScreen(
    convertedCode: String,
    isConverting: Boolean,
    onConvert: (code: String, sourceLang: String, targetLang: String) -> Unit
) {
    var codeInput by remember { mutableStateOf("") }
    var sourceLang by remember { mutableStateOf("Python") }
    var targetLang by remember { mutableStateOf("C++") }
    var isSourceMenuExpanded by remember { mutableStateOf(false) }
    var isTargetMenuExpanded by remember { mutableStateOf(false) }

    val languages = listOf("Python", "JavaScript", "C++", "Java", "Go", "Rust", "TypeScript")
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        Text(
            text = "🔄 AI Code Converter",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = "Translate code between major programming languages effortlessly.",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(modifier = Modifier.weight(1f)) {
                ExposedDropdownMenuBox(
                    expanded = isSourceMenuExpanded,
                    onExpandedChange = { isSourceMenuExpanded = it }
                ) {
                    OutlinedTextField(
                        value = sourceLang,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("From") },
                        modifier = Modifier.menuAnchor()
                    )
                    ExposedDropdownMenu(
                        expanded = isSourceMenuExpanded,
                        onDismissRequest = { isSourceMenuExpanded = false }
                    ) {
                        languages.forEach { lang ->
                            DropdownMenuItem(text = { Text(lang) }, onClick = {
                                sourceLang = lang
                                isSourceMenuExpanded = false
                            })
                        }
                    }
                }
            }

            IconButton(onClick = {
                val temp = sourceLang
                sourceLang = targetLang
                targetLang = temp
            }) {
                Icon(Icons.Default.Sync, contentDescription = "Swap", tint = CyanPrimary)
            }

            Box(modifier = Modifier.weight(1f)) {
                ExposedDropdownMenuBox(
                    expanded = isTargetMenuExpanded,
                    onExpandedChange = { isTargetMenuExpanded = it }
                ) {
                    OutlinedTextField(
                        value = targetLang,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("To") },
                        modifier = Modifier.menuAnchor()
                    )
                    ExposedDropdownMenu(
                        expanded = isTargetMenuExpanded,
                        onDismissRequest = { isTargetMenuExpanded = false }
                    ) {
                        languages.forEach { lang ->
                            DropdownMenuItem(text = { Text(lang) }, onClick = {
                                targetLang = lang
                                isTargetMenuExpanded = false
                            })
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = codeInput,
            onValueChange = { codeInput = it },
            placeholder = { Text("Paste source code snippet here...") },
            modifier = Modifier
                .fillMaxWidth()
                .height(160.dp)
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { onConvert(codeInput, sourceLang, targetLang) },
            enabled = !isConverting && codeInput.isNotBlank(),
            colors = ButtonDefaults.buttonColors(containerColor = CyanPrimary),
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
        ) {
            if (isConverting) {
                CircularProgressIndicator(modifier = Modifier.size(24.dp), color = Color.White)
            } else {
                Text("Convert Code", fontWeight = FontWeight.Bold)
            }
        }

        if (convertedCode.isNotBlank()) {
            Spacer(modifier = Modifier.height(20.dp))
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Translated Output ($targetLang)", fontWeight = FontWeight.Bold, color = CyanPrimary)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(convertedCode, fontFamily = FontFamily.Monospace, fontSize = 13.sp)
                }
            }
        }
    }
}
