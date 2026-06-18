package com.example.edusphereapp.ui.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.edusphereapp.data.local.entity.QuizResult
import com.example.edusphereapp.data.repository.MainRepository
import kotlinx.coroutines.launch

class QuizViewModel(private val repository: MainRepository) : ViewModel() {

    // Logic for generating/loading quizzes and saving results
    fun saveQuizResult(subject: String, score: Int, total: Int) = viewModelScope.launch {
        val result = QuizResult(
            subject = subject,
            score = score,
            totalQuestions = total,
            percentage = (score * 100) / total,
            timestamp = System.currentTimeMillis()
        )
        // Add save to repository logic
    }
}