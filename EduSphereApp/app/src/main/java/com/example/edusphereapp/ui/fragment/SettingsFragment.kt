package com.example.edusphereapp.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.edusphereapp.R
import com.example.edusphereapp.ThemeHelper
import com.example.edusphereapp.databinding.FragmentSettingsBinding

class SettingsFragment : Fragment() {

    private var _binding: FragmentSettingsBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSettingsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val currentTheme = ThemeHelper.getTheme(requireContext())
        when (currentTheme) {
            ThemeHelper.LIGHT_MODE -> binding.lightRb.isChecked = true
            ThemeHelper.DARK_MODE -> binding.darkRb.isChecked = true
            ThemeHelper.SYSTEM_DEFAULT -> binding.systemRb.isChecked = true
        }

        binding.themeRadioGroup.setOnCheckedChangeListener { _, checkedId ->
            val mode = when (checkedId) {
                R.id.lightRb -> ThemeHelper.LIGHT_MODE
                R.id.darkRb -> ThemeHelper.DARK_MODE
                else -> ThemeHelper.SYSTEM_DEFAULT
            }
            ThemeHelper.applyTheme(requireContext(), mode)
            requireActivity().recreate()
        }

        binding.logoutBtn.setOnClickListener {
            // Logout logic
            requireActivity().finish()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}