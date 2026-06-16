package com.example.edusphereapp

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*

object ProgressManager {

    private const val PREF_NAME = "edusphere_progress"

    // ✅ Call this when a topic is completed
    fun markTopicCompleted(context: Context, subject: String, topic: String) {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val key = "completed_${subject}_${topic}".replace(" ", "_")
        prefs.edit().putBoolean(key, true).apply()

        // Save to daily progress
        val today = getTodayDate()
        val dailyKey = "daily_$today"
        val current = prefs.getInt(dailyKey, 0)
        prefs.edit().putInt(dailyKey, current + 1).apply()

        // Save subject progress count
        val subjectKey = "subject_count_${subject}".replace(" ", "_")
        val subjectCount = prefs.getInt(subjectKey, 0)
        prefs.edit().putInt(subjectKey, subjectCount + 1).apply()

        // Save total completed
        val total = prefs.getInt("total_completed", 0)
        prefs.edit().putInt("total_completed", total + 1).apply()

        // Save last active date
        prefs.edit().putString("last_active", today).apply()

        // Update streak
        updateStreak(context)
    }

    // ✅ Call this when a quiz is completed
    fun saveQuizResult(context: Context, subject: String, score: Int, total: Int) {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val key = "quiz_${subject}".replace(" ", "_")
        val percentage = (score * 100) / total
        prefs.edit().putInt(key, percentage).apply()

        val totalQuizzes = prefs.getInt("total_quizzes", 0)
        prefs.edit().putInt("total_quizzes", totalQuizzes + 1).apply()

        val totalScore = prefs.getInt("total_quiz_score", 0)
        prefs.edit().putInt("total_quiz_score", totalScore + percentage).apply()
    }

    fun getTotalCompleted(context: Context): Int {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .getInt("total_completed", 0)
    }

    fun getTotalQuizzes(context: Context): Int {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .getInt("total_quizzes", 0)
    }

    fun getAverageQuizScore(context: Context): Int {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val total = prefs.getInt("total_quizzes", 0)
        if (total == 0) return 0
        return prefs.getInt("total_quiz_score", 0) / total
    }

    fun getStreak(context: Context): Int {
        return context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
            .getInt("streak", 0)
    }

    fun getSubjectProgress(context: Context): Map<String, Int> {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val subjects = listOf(
            "Quantum Physics", "Human Anatomy", "Organic Chemistry",
            "Ancient History", "Calculus III", "Astrophysics",
            "Marine Biology", "Computer Science", "Artificial Intelligence",
            "Psychology 101"
        )
        val map = mutableMapOf<String, Int>()
        for (subject in subjects) {
            val key = "subject_count_${subject}".replace(" ", "_")
            val count = prefs.getInt(key, 0)
            if (count > 0) map[subject] = count
        }
        return map
    }

    fun getWeeklyData(context: Context): List<Pair<String, Int>> {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val days = mutableListOf<Pair<String, Int>>()
        val cal = Calendar.getInstance()
        val dayNames = listOf("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat")

        for (i in 6 downTo 0) {
            cal.time = Date()
            cal.add(Calendar.DAY_OF_YEAR, -i)
            val dateStr = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(cal.time)
            val dayName = dayNames[cal.get(Calendar.DAY_OF_WEEK) - 1]
            val count = prefs.getInt("daily_$dateStr", 0)
            days.add(Pair(dayName, count))
        }
        return days
    }

    fun isTopicCompleted(context: Context, subject: String, topic: String): Boolean {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val key = "completed_${subject}_${topic}".replace(" ", "_")
        return prefs.getBoolean(key, false)
    }

    private fun updateStreak(context: Context) {
        val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val today = getTodayDate()
        val lastActive = prefs.getString("last_streak_date", "") ?: ""
        val currentStreak = prefs.getInt("streak", 0)

        if (lastActive == today) return

        val yesterday = getYesterdayDate()
        val newStreak = if (lastActive == yesterday) currentStreak + 1 else 1

        prefs.edit()
            .putInt("streak", newStreak)
            .putString("last_streak_date", today)
            .apply()
    }

    private fun getTodayDate(): String {
        return SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
    }

    private fun getYesterdayDate(): String {
        val cal = Calendar.getInstance()
        cal.add(Calendar.DAY_OF_YEAR, -1)
        return SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(cal.time)
    }
}