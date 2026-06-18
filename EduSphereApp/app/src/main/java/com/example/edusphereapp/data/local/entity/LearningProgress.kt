package com.example.edusphereapp.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "learning_progress")
data class LearningProgress(
    @PrimaryKey val topicId: String,
    val subject: String,
    val topicName: String,
    val isCompleted: Boolean = false,
    val studyHours: Float = 0f,
    val lastAccessed: Long
)