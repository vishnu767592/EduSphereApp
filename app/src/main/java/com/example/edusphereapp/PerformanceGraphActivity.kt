package com.example.edusphereapp

import android.os.Bundle
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class PerformanceGraphActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val themeMode = ThemeHelper.getTheme(this)
        ThemeHelper.applyTheme(this, themeMode)
        setContentView(R.layout.activity_performance_graph)

        findViewById<ImageButton>(R.id.perfBackBtn).setOnClickListener { finish() }

        val avgScore = ProgressManager.getAverageQuizScore(this)
        val totalQuizzes = ProgressManager.getTotalQuizzes(this)
        val totalCompleted = ProgressManager.getTotalCompleted(this)

        findViewById<TextView>(R.id.perfAvgScoreTv).text = "$avgScore%"
        findViewById<TextView>(R.id.perfTotalQuizzesTv).text = totalQuizzes.toString()
        findViewById<TextView>(R.id.perfTopicsCompletedTv).text = totalCompleted.toString()

        val grade = when {
            avgScore >= 90 -> "A+ 🏆"
            avgScore >= 80 -> "A ⭐"
            avgScore >= 70 -> "B 👍"
            avgScore >= 60 -> "C 📚"
            avgScore > 0 -> "D 💪"
            else -> "N/A"
        }
        findViewById<TextView>(R.id.perfGradeTv).text = grade

        // Score progress ring
        findViewById<ProgressBar>(R.id.perfScoreBar).progress = avgScore

        // Subject scores
        val subjects = listOf(
            "Quantum Physics", "Human Anatomy", "Organic Chemistry",
            "Calculus III", "Astrophysics", "Computer Science",
            "Artificial Intelligence", "Psychology 101"
        )

        val container = findViewById<LinearLayout>(R.id.subjectScoreContainer)
        val prefs = getSharedPreferences("edusphere_progress", MODE_PRIVATE)

        for (subject in subjects) {
            val key = "quiz_${subject}".replace(" ", "_")
            val score = prefs.getInt(key, -1)
            if (score >= 0) {
                val row = layoutInflater.inflate(R.layout.item_subject_score, container, false)
                row.findViewById<TextView>(R.id.scoreSubjectName).text = subject
                row.findViewById<TextView>(R.id.scorePercent).text = "$score%"
                row.findViewById<ProgressBar>(R.id.scoreBar).progress = score
                row.findViewById<ProgressBar>(R.id.scoreBar).progressTintList =
                    android.content.res.ColorStateList.valueOf(
                        when {
                            score >= 80 -> android.graphics.Color.parseColor("#4CAF50")
                            score >= 60 -> android.graphics.Color.parseColor("#FF9800")
                            else -> android.graphics.Color.parseColor("#F44336")
                        }
                    )
                container.addView(row)
            }
        }

        if (container.childCount == 0) {
            val emptyTv = TextView(this).apply {
                text = "📝 Complete quizzes to see your performance here!"
                setTextColor(android.graphics.Color.parseColor("#888888"))
                textSize = 14f
                setPadding(0, 24, 0, 24)
                gravity = android.view.Gravity.CENTER
            }
            container.addView(emptyTv)
        }
    }
}