package com.example.edusphereapp.ui.viewmodel

import androidx.lifecycle.*
import com.example.edusphereapp.data.local.entity.Note
import com.example.edusphereapp.data.local.entity.User
import com.example.edusphereapp.data.repository.MainRepository
import kotlinx.coroutines.launch

class MainViewModel(private val repository: MainRepository) : ViewModel() {

    val user: LiveData<User?> = repository.user.asLiveData()
    val allNotes: LiveData<List<Note>> = repository.allNotes.asLiveData()

    fun insertUser(user: User) = viewModelScope.launch {
        repository.insertUser(user)
    }

    fun insertNote(note: Note) = viewModelScope.launch {
        repository.insertNote(note)
    }

    fun deleteNote(note: Note) = viewModelScope.launch {
        repository.deleteNote(note)
    }
}

class MainViewModelFactory(private val repository: MainRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(MainViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return MainViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}