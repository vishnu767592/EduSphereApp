package com.example.edusphereapp.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.example.edusphereapp.ProgressManager
import com.example.edusphereapp.R
import com.example.edusphereapp.databinding.FragmentAnalyticsBinding

class AnalyticsFragment : Fragment() {

    private var _binding: FragmentAnalyticsBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAnalyticsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupWeeklyChart()
        setupTopSubjects()
    }

    private fun setupWeeklyChart() {
        val weeklyData = ProgressManager.getWeeklyData(requireContext())
        val maxVal = weeklyData.maxOfOrNull { it.second } ?: 1
        
        binding.barChartContainer.removeAllViews()

        for ((day, count) in weeklyData) {
            val col = layoutInflater.inflate(R.layout.item_bar_chart, binding.barChartContainer, false)
            val bar = col.findViewById<View>(R.id.bar)
            val dayTv = col.findViewById<TextView>(R.id.barDayTv)
            val countTv = col.findViewById<TextView>(R.id.barCountTv)

            val maxBarHeight = binding.barChartContainer.height.coerceAtLeast(180)
            val barHeight = (count * maxBarHeight) / maxVal
            
            val params = bar.layoutParams
            params.height = barHeight.coerceAtLeast(8)
            bar.layoutParams = params

            dayTv.text = day
            countTv.text = if (count > 0) count.toString() else ""
            
            binding.barChartContainer.addView(col)
        }
    }

    private fun setupTopSubjects() {
        val subjectProgress = ProgressManager.getSubjectProgress(requireContext())
        binding.subjectScoreContainer.removeAllViews()

        for ((subject, count) in subjectProgress.toList().take(5)) {
            val row = layoutInflater.inflate(R.layout.item_subject_score, binding.subjectScoreContainer, false)
            row.findViewById<TextView>(R.id.scoreSubjectName).text = subject
            row.findViewById<TextView>(R.id.scorePercent).text = "$count topics"
            // Set progress bar based on arbitrary max topics (e.g., 20)
            row.findViewById<android.widget.ProgressBar>(R.id.scoreBar).progress = (count * 100) / 20
            binding.subjectScoreContainer.addView(row)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}