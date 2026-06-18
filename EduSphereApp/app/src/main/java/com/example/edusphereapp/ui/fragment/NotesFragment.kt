package com.example.edusphereapp.ui.fragment

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.StaggeredGridLayoutManager
import com.example.edusphereapp.AddNotesActivity
import com.example.edusphereapp.EduSphereApplication
import com.example.edusphereapp.NoteAdapter
import com.example.edusphereapp.databinding.FragmentNotesBinding
import com.example.edusphereapp.ui.viewmodel.NotesViewModel
import com.example.edusphereapp.ui.viewmodel.NotesViewModelFactory

class NotesFragment : Fragment() {
    private var _binding: FragmentNotesBinding? = null
    private val binding get() = _binding!!

    private val viewModel: NotesViewModel by viewModels {
        NotesViewModelFactory((requireActivity().application as EduSphereApplication).repository)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentNotesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val adapter = NoteAdapter { note ->
            // Handle note click (edit)
        }
        
        binding.notesRv.layoutManager = StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL)
        binding.notesRv.adapter = adapter

        viewModel.allNotes.observe(viewLifecycleOwner) { notes ->
            adapter.submitList(notes)
        }

        binding.addNoteFab.setOnClickListener {
            startActivity(Intent(requireContext(), AddNotesActivity::class.java))
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}