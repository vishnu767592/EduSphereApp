package com.example.edusphereapp

import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.edusphereapp.data.local.entity.Note
import com.example.edusphereapp.databinding.ActivityAddNotesBinding
import com.example.edusphereapp.ui.viewmodel.NotesViewModel
import com.example.edusphereapp.ui.viewmodel.NotesViewModelFactory

class AddNotesActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAddNotesBinding
    private val viewModel: NotesViewModel by viewModels {
        NotesViewModelFactory((application as EduSphereApplication).repository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAddNotesBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.toolbar.setNavigationOnClickListener { finish() }

        binding.saveNoteFab.setOnClickListener {
            saveNote()
        }
    }

    private fun saveNote() {
        val title = binding.noteTitleEt.text.toString().trim()
        val content = binding.noteContentEt.text.toString().trim()

        if (title.isEmpty() || content.isEmpty()) {
            Toast.makeText(this, "Please enter both title and content", Toast.LENGTH_SHORT).show()
            return
        }

        val note = Note(
            title = title,
            content = content,
            timestamp = System.currentTimeMillis()
        )

        viewModel.insert(note)
        Toast.makeText(this, "Note saved successfully", Toast.LENGTH_SHORT).show()
        finish()
    }
}