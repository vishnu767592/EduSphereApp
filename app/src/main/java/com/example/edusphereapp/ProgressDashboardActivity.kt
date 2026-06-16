package com.example.edusphereapp

import android.content.Intent
import android.os.Bundle
import android.widget.ImageButton
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView

class ProgressDashboardActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val themeMode = ThemeHelper.getTheme(this)
        ThemeHelper.applyTheme(this, themeMode)
        setContentView(R.layout.activity_progress_dashboard)

        findViewById<ImageButton>(R.id.progressBackBtn).setOnClickListener { finish() }

        loadProgressData()

        findViewById<CardView>(R.id.weeklyStatsCard).setOnClickListener {
            startActivity(Intent(this, WeeklyStatsActivity::class.java))
        }
        findViewById<CardView>(R.id.performanceCard).setOnClickListener {
            startActivity(Intent(this, PerformanceGraphActivity::class.java))
        }
    }

    override fun onResume() {
        super.onResume()
        loadProgressData()
    }

    private fun loadProgressData() {
        val totalCompleted = ProgressManager.getTotalCompleted(this)
        val totalQuizzes = ProgressManager.getTotalQuizzes(this)
        val avgScore = ProgressManager.getAverageQuizScore(this)
        val streak = ProgressManager.getStreak(this)
        val subjectProgress = ProgressManager.getSubjectProgress(this)

        // Stats
        findViewById<TextView>(R.id.totalTopicsTv).text = totalCompleted.toString()
        findViewById<TextView>(R.id.totalQuizzesTv).text = totalQuizzes.toString()
        findViewById<TextView>(R.id.avgScoreTv).text = "$avgScore%"
        findViewById<TextView>(R.id.streakTv).text = "$streak 🔥"

        // Overall progress bar (out of 100 total topics across all subjects)
        val overallPercent = minOf((totalCompleted * 100) / 100, 100)
        findViewById<ProgressBar>(R.id.overallProgressBar).progress = overallPercent
        findViewById<TextView>(R.id.overallPercentTv).text = "$overallPercent%"

        // Level
        val level = when {
            totalCompleted >= 50 -> "Expert 🏆"
            totalCompleted >= 30 -> "Advanced ⭐"
            totalCompleted >= 15 -> "Intermediate 📚"
            totalCompleted >= 5 -> "Beginner 🌱"
            else -> "Starter 👋"
        }
        findViewById<TextView>(R.id.levelTv).text = level

        // Subject progress cards
        loadSubjectProgress(subjectProgress)
    }

    private fun loadSubjectProgress(subjectProgress: Map<String, Int>) {
        val subjectContainer = findViewById<android.widget.LinearLayout>(R.id.subjectProgressContainer)
        subjectContainer.removeAllViews()

        if (subjectProgress.isEmpty()) {
            val emptyTv = TextView(this).apply {
                text = "📚 Start learning topics to see your progress here!"
                setTextColor(android.graphics.Color.parseColor("#888888"))
                textSize = 14f
                setPadding(0, 16, 0, 16)
            }
            subjectContainer.addView(emptyTv)
            return
        }

        for ((subject, count) in subjectProgress) {
            val totalTopics = getTotalTopicsForSubject(subject)
            val percent = minOf((count * 100) / totalTopics, 100)

            val row = layoutInflater.inflate(R.layout.item_subject_progress, subjectContainer, false)
            row.findViewById<TextView>(R.id.subjectProgressName).text = subject
            row.findViewById<TextView>(R.id.subjectProgressCount).text = "$count/$totalTopics topics"
            row.findViewById<ProgressBar>(R.id.subjectProgressBar).progress = percent
            row.findViewById<TextView>(R.id.subjectProgressPercent).text = "$percent%"
            subjectContainer.addView(row)
        }
    }

    private fun getTotalTopicsForSubject(subject: String): Int {
        return when (subject) {
            "Quantum Physics" -> 12
            "Human Anatomy" -> 15
            "Organic Chemistry" -> 10
            "Ancient History" -> 8
            "Calculus III" -> 14
            "Astrophysics" -> 11
            "Marine Biology" -> 9
            "Computer Science" -> 20
            "Artificial Intelligence" -> 18
            "Psychology 101" -> 10
            else -> 10
        }
    }
}