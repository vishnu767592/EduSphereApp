package com.example.edusphereapp.ui.fragment

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.edusphereapp.R
import com.example.edusphereapp.SubjectListActivity
import com.example.edusphereapp.databinding.FragmentHomeBinding

class HomeFragment : Fragment() {
    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupDashboardCards()
    }

    private fun setupDashboardCards() {
        // AI Tutor Card
        binding.cardAiTutor.cardTitle.text = "AI Tutor"
        binding.cardAiTutor.cardSubtitle.text = "Chat with Gemini"
        binding.cardAiTutor.cardIcon.setImageResource(android.R.drawable.stat_notify_chat)
        binding.cardAiTutor.root.setOnClickListener {
            findNavController().navigate(R.id.nav_ai_tutor)
        }

        // Hologram Lab Card
        binding.cardHologram.cardTitle.text = "Hologram Lab"
        binding.cardHologram.cardSubtitle.text = "Learn in 360°"
        binding.cardHologram.cardIcon.setImageResource(android.R.drawable.ic_menu_view)
        binding.cardHologram.root.setOnClickListener {
            findNavController().navigate(R.id.nav_hologram)
        }
        
        // Quiz Arena Card
        binding.cardQuiz.cardTitle.text = "Quiz Arena"
        binding.cardQuiz.cardSubtitle.text = "Challenge Yourself"
        binding.cardQuiz.cardIcon.setImageResource(android.R.drawable.ic_menu_help)
        binding.cardQuiz.root.setOnClickListener {
            findNavController().navigate(R.id.nav_quiz_arena)
        }

        // Smart Notes Card
        binding.cardNotes.cardTitle.text = "Smart Notes"
        binding.cardNotes.cardSubtitle.text = "Your digital notebook"
        binding.cardNotes.cardIcon.setImageResource(android.R.drawable.ic_menu_edit)
        binding.cardNotes.root.setOnClickListener {
            findNavController().navigate(R.id.nav_notes)
        }

        // Analytics Card
        binding.cardAnalytics.cardTitle.text = "Analytics"
        binding.cardAnalytics.cardSubtitle.text = "Track your growth"
        binding.cardAnalytics.cardIcon.setImageResource(android.R.drawable.ic_menu_compass)
        binding.cardAnalytics.root.setOnClickListener {
            findNavController().navigate(R.id.nav_analytics)
        }

        // Achievements Card
        binding.cardAchievements.cardTitle.text = "Badges"
        binding.cardAchievements.cardSubtitle.text = "Your milestones"
        binding.cardAchievements.cardIcon.setImageResource(android.R.drawable.btn_star_big_on)
        binding.cardAchievements.root.setOnClickListener {
            findNavController().navigate(R.id.nav_achievements)
        }
        
        binding.welcomeCard.setOnClickListener {
            startActivity(Intent(requireContext(), SubjectListActivity::class.java))
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}