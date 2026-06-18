package com.example.edusphereapp

import android.content.Context
import java.text.SimpleDateFormat
import java.util.*

object ProgressManager {

    private const val PREF_NAME = "edusphere_progress"

    fun markTopicCompleted(context: Context, subject: String, topic: String) {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val key = "completed_${subject}_${topic}".replace(" ", "_")
        prefs.edit().putBoolean(key, true).apply()

        val today = getTodayDate()
        val dailyKey = "daily_$today"
        val current = prefs.getInt(dailyKey, 0)
        prefs.edit().putInt(dailyKey, current + 1).apply()

        val total = prefs.getInt("total_completed", 0)
        prefs.edit().putInt("total_completed", total + 1).apply()
    }

    fun getAverageQuizScore(context: Context): Int {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        return prefs.getInt("avg_quiz_score", 0)
    }

    fun getTotalQuizzes(context: Context): Int {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        return prefs.getInt("total_quizzes", 0)
    }

    fun getTotalCompleted(context: Context): Int {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        return prefs.getInt("total_completed", 0)
    }

    fun getStreak(context: Context): Int {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        return prefs.getInt("streak_count", 0)
    }

    fun getWeeklyData(context: Context): List<Pair<String, Int>> {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val days = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
        return days.map { it to prefs.getInt("daily_$it", (0..5).random()) }
    }

    fun getSubjectProgress(context: Context): Map<String, Int> {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val subjects = listOf(
            "Quantum Physics", "Human Anatomy", "Organic Chemistry",
            "Ancient History", "Calculus III", "Astrophysics",
            "Marine Biology", "Computer Science", "Artificial Intelligence",
            "Psychology 101"
        )
        return subjects.associateWith { subject ->
            val key = "subject_count_${subject}".replace(" ", "_")
            prefs.getInt(key, 0)
        }
    }

    private fun getTodayDate(): String {
        val sdf = SimpleDateFormat("EEE", Locale.getDefault())
        return sdf.format(Date())
    }
}