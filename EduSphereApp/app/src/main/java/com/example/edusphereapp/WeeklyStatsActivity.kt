package com.example.edusphereapp

import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class WeeklyStatsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val themeMode = ThemeHelper.getTheme(this)
        ThemeHelper.applyTheme(this, themeMode)
        setContentView(R.layout.activity_weekly_stats)

        findViewById<ImageButton>(R.id.weeklyBackBtn).setOnClickListener { finish() }

        val weeklyData = ProgressManager.getWeeklyData(this)
        val totalThisWeek = weeklyData.sumOf { it.second }
        val bestDay = weeklyData.maxByOrNull { it.second }
        val activeDays = weeklyData.count { it.second > 0 }

        findViewById<TextView>(R.id.weeklyTotalTv).text = totalThisWeek.toString()
        findViewById<TextView>(R.id.weeklyBestDayTv).text = bestDay?.first ?: "-"
        findViewById<TextView>(R.id.weeklyActiveDaysTv).text = "$activeDays/7 days"
        findViewById<TextView>(R.id.weeklyStreakTv).text = "${ProgressManager.getStreak(this)} 🔥"

        // Draw bar chart
        val maxVal = weeklyData.maxOfOrNull { it.second } ?: 1
        val barContainer = findViewById<android.widget.LinearLayout>(R.id.barChartContainer)

        for ((day, count) in weeklyData) {
            val col = layoutInflater.inflate(R.layout.item_bar_chart, barContainer, false)
            val bar = col.findViewById<android.view.View>(R.id.bar)
            val dayTv = col.findViewById<TextView>(R.id.barDayTv)
            val countTv = col.findViewById<TextView>(R.id.barCountTv)

            val maxBarHeight = 180
            val barHeight = if (maxVal > 0) (count * maxBarHeight) / maxVal else 8
            val params = bar.layoutParams
            params.height = maxOf(barHeight, 8)
            bar.layoutParams = params

            bar.setBackgroundColor(
                if (count > 0)
                    android.graphics.Color.parseColor("#7C6AF7")
                else
                    android.graphics.Color.parseColor("#2A2750")
            )

            dayTv.text = day
            countTv.text = if (count > 0) count.toString() else ""
            barContainer.addView(col)
        }
    }
}