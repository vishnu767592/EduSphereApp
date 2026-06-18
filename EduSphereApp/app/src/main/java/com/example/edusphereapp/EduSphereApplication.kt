package com.example.edusphereapp

import android.app.Application
import com.example.edusphereapp.data.local.EduSphereDatabase
import com.example.edusphereapp.data.repository.MainRepository

class EduSphereApplication : Application() {
    val database by lazy { EduSphereDatabase.getDatabase(this) }
    val repository by lazy { MainRepository(database.userDao(), database.noteDao(), database.quizDao()) }
}