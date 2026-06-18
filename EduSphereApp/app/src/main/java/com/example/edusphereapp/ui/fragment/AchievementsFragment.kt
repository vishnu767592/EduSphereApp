package com.example.edusphereapp.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.edusphereapp.R

import androidx.recyclerview.widget.LinearLayoutManager
import com.example.edusphereapp.Achievement
import com.example.edusphereapp.AchievementAdapter
import com.example.edusphereapp.databinding.FragmentAchievementsBinding

class AchievementsFragment : Fragment() {
    private var _binding: FragmentAchievementsBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAchievementsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val list = listOf(
            Achievement("First Lesson", "Completed your first 3D module", android.R.drawable.btn_star_big_on),
            Achievement("Quiz Master", "Scored 100% in a quiz", android.R.drawable.btn_star_big_on),
            Achievement("AI Explorer", "Asked 10 questions to the AI Tutor", android.R.drawable.btn_star_big_on),
            Achievement("Study Streak", "Studied for 5 consecutive days", android.R.drawable.btn_star_big_on)
        )

        binding.achievementsRv.layoutManager = LinearLayoutManager(context)
        binding.achievementsRv.adapter = AchievementAdapter(list)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}