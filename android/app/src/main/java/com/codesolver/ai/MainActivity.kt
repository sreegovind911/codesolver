package com.codesolver.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.codesolver.ai.model.TabRoute
import com.codesolver.ai.ui.components.*
import com.codesolver.ai.ui.screens.*
import com.codesolver.ai.ui.theme.CodeSolverTheme
import com.codesolver.ai.viewmodel.CodeSolverViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: CodeSolverViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)

        setContent {
            val currentTab by viewModel.currentTab.collectAsState()
            val isDarkMode by viewModel.isDarkMode.collectAsState()
            val userProfile by viewModel.userProfile.collectAsState()
            val historyItems by viewModel.history.collectAsState()

            // Modal states
            val isHistoryOpen by viewModel.isHistoryOpen.collectAsState()
            val isProfileOpen by viewModel.isProfileOpen.collectAsState()
            val isAuthOpen by viewModel.isAuthOpen.collectAsState()
            val isCameraOCROpen by viewModel.isCameraOCROpen.collectAsState()

            // Screen outputs & state
            val homeOutput by viewModel.homeOutput.collectAsState()
            val isSolving by viewModel.isSolving.collectAsState()

            val convertedCode by viewModel.convertedCode.collectAsState()
            val isConverting by viewModel.isConverting.collectAsState()

            val debugOutput by viewModel.debugOutput.collectAsState()
            val isDebuggings by viewModel.isDebuggings.collectAsState()

            val tutorMessages by viewModel.tutorMessages.collectAsState()
            val quizzes by viewModel.quizzes.collectAsState()

            CodeSolverTheme(darkTheme = isDarkMode) {
                Scaffold(
                    topBar = {
                        TopHeaderBar(
                            solvesText = "Solves: ${userProfile.solvesUsed}/${userProfile.maxSolves}",
                            isDarkMode = isDarkMode,
                            onToggleTheme = { viewModel.toggleDarkMode() },
                            onOpenHistory = { viewModel.setHistoryOpen(true) },
                            onOpenProfile = { viewModel.setProfileOpen(true) }
                        )
                    },
                    bottomBar = {
                        BottomNavBar(
                            currentTab = currentTab,
                            onTabSelected = { viewModel.selectTab(it) }
                        )
                    }
                ) { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding)) {
                        when (currentTab) {
                            TabRoute.HOME -> HomeSolverScreen(
                                output = homeOutput,
                                isSolving = isSolving,
                                onSolve = { input, lang -> viewModel.solveProblem(input, lang) },
                                onOpenCamera = { viewModel.setCameraOCROpen(true) }
                            )
                            TabRoute.CONVERTER -> ConverterScreen(
                                convertedCode = convertedCode,
                                isConverting = isConverting,
                                onConvert = { code, src, tgt -> viewModel.convertCode(code, src, tgt) }
                            )
                            TabRoute.DEBUGGER -> DebuggerScreen(
                                debugOutput = debugOutput,
                                isDebuggings = isDebuggings,
                                onDebug = { code, err -> viewModel.debugCode(code, err) }
                            )
                            TabRoute.TUTOR -> TutorScreen(
                                messages = tutorMessages,
                                onSendQuery = { subj, q -> viewModel.sendTutorQuery(subj, q) }
                            )
                            TabRoute.LEARN -> LearnScreen(
                                quizzes = quizzes
                            )
                        }
                    }

                    // Modals
                    CameraOCRModal(
                        isOpen = isCameraOCROpen,
                        onDismiss = { viewModel.setCameraOCROpen(false) },
                        onTextExtracted = { text -> viewModel.solveProblem(text, "Auto-Detect") }
                    )

                    HistoryDrawerModal(
                        isOpen = isHistoryOpen,
                        historyItems = historyItems,
                        onDismiss = { viewModel.setHistoryOpen(false) },
                        onClearHistory = { viewModel.clearHistory() }
                    )

                    ProfileModal(
                        isOpen = isProfileOpen,
                        profile = userProfile,
                        onDismiss = { viewModel.setProfileOpen(false) },
                        onOpenAuth = { viewModel.setAuthOpen(true) }
                    )

                    AuthModal(
                        isOpen = isAuthOpen,
                        onDismiss = { viewModel.setAuthOpen(false) }
                    )
                }
            }
        }
    }
}
