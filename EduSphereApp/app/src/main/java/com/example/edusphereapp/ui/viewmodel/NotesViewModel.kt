package com.example.edusphereapp.ui.viewmodel

import androidx.lifecycle.*
import com.example.edusphereapp.data.local.entity.Note
import com.example.edusphereapp.data.repository.MainRepository
import kotlinx.coroutines.launch

class NotesViewModel(private val repository: MainRepository) : ViewModel() {

    val allNotes: LiveData<List<Note>> = repository.allNotes.asLiveData()

    fun insert(note: Note) = viewModelScope.launch {
        repository.insertNote(note)
    }

    fun delete(note: Note) = viewModelScope.launch {
        repository.deleteNote(note)
    }

    fun search(query: String): LiveData<List<Note>> {
        return repository.searchNotes(query).asLiveData()
    }
}

class NotesViewModelFactory(private val repository: MainRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(NotesViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return NotesViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}