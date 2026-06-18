package com.example.edusphereapp.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.edusphereapp.SubjectAdapter
import com.example.edusphereapp.Subject
import com.example.edusphereapp.databinding.FragmentQuizArenaBinding

class QuizArenaFragment : Fragment() {

    private var _binding: FragmentQuizArenaBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentQuizArenaBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val subjects = listOf(
            Subject("Biology Quiz", "15 Questions", android.R.drawable.ic_menu_myplaces),
            Subject("Physics Quiz", "10 Questions", android.R.drawable.ic_menu_compass),
            Subject("Chemistry Quiz", "12 Questions", android.R.drawable.ic_menu_view)
        )

        val adapter = SubjectAdapter(subjects) { subject ->
            // Launch Quiz Question Activity
        }

        binding.subjectsRv.layoutManager = LinearLayoutManager(context)
        binding.subjectsRv.adapter = adapter
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}