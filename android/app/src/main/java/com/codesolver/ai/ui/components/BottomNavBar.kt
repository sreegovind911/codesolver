package com.codesolver.ai.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.codesolver.ai.model.TabRoute
import com.codesolver.ai.ui.theme.CyanPrimary

@Composable
fun BottomNavBar(
    currentTab: TabRoute,
    onTabSelected: (TabRoute) -> Unit
) {
    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp
    ) {
        TabRoute.values().forEach { tab ->
            val isSelected = currentTab == tab
            val icon: ImageVector = when (tab) {
                TabRoute.HOME -> Icons.Default.FlashOn
                TabRoute.CONVERTER -> Icons.Default.Sync
                TabRoute.DEBUGGER -> Icons.Default.BugReport
                TabRoute.TUTOR -> Icons.Default.School
                TabRoute.LEARN -> Icons.Default.Psychology
            }

            NavigationBarItem(
                selected = isSelected,
                onClick = { onTabSelected(tab) },
                icon = {
                    Icon(
                        imageVector = icon,
                        contentDescription = tab.title
                    )
                },
                label = {
                    Text(text = tab.title)
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = CyanPrimary,
                    selectedTextColor = CyanPrimary,
                    indicatorColor = CyanPrimary.copy(alpha = 0.15f),
                    unselectedIconColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                    unselectedTextColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            )
        }
    }
}
