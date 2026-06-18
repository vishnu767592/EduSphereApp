package com.example.edusphereapp.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class User(
    @PrimaryKey val uid: String,
    val name: String?,
    val email: String?,
    val avatarUrl: String? = null,
    val studyHours: Float = 0f,
    val totalQuizzes: Int = 0,
    val completionPercent: Int = 0
)