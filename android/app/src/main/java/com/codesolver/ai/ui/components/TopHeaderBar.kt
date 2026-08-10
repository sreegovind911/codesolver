package com.codesolver.ai.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.codesolver.ai.ui.theme.CyanPrimary

@Composable
fun TopHeaderBar(
    solvesText: String,
    isDarkMode: Boolean,
    onToggleTheme: () -> Unit,
    onOpenHistory: () -> Unit,
    onOpenProfile: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 4.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Brand Logo & Title
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(CyanPrimary),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Bolt,
                        contentDescription = "Logo",
                        tint = Color.White
                    )
                }
                Column {
                    Text(
                        text = "CodeSolver AI",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "Native Android Edition",
                        fontSize = 10.sp,
                        color = CyanPrimary
                    )
                }
            }

            // Right Action Controls
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Solves Badge
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = CyanPrimary.copy(alpha = 0.15f)
                ) {
                    Text(
                        text = solvesText,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = CyanPrimary,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }

                // Theme Toggle
                IconButton(
                    onClick = onToggleTheme,
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        imageVector = if (isDarkMode) Icons.Default.WbSunny else Icons.Default.NightsStay,
                        contentDescription = "Toggle Theme",
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                }

                // History Icon
                IconButton(
                    onClick = onOpenHistory,
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.History,
                        contentDescription = "History",
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                }

                // Profile Icon
                IconButton(
                    onClick = onOpenProfile,
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.AccountCircle,
                        contentDescription = "Profile",
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                }
            }
        }
    }
}
