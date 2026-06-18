package com.example.edusphereapp.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "quiz_results")
data class QuizResult(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val subject: String,
    val score: Int,
    val totalQuestions: Int,
    val percentage: Int,
    val timestamp: Long
)