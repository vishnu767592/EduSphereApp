package com.example.edusphereapp.data.repository

import com.example.edusphereapp.data.local.dao.NoteDao
import com.example.edusphereapp.data.local.dao.QuizDao
import com.example.edusphereapp.data.local.dao.UserDao
import com.example.edusphereapp.data.local.entity.Note
import com.example.edusphereapp.data.local.entity.QuizResult
import com.example.edusphereapp.data.local.entity.User
import kotlinx.coroutines.flow.Flow

class MainRepository(
    private val userDao: UserDao,
    private val noteDao: NoteDao,
    private val quizDao: QuizDao
) {
    val user: Flow<User?> = userDao.getUser()
    val allNotes: Flow<List<Note>> = noteDao.getAllNotes()
    val allQuizResults: Flow<List<QuizResult>> = quizDao.getAllResults()

    suspend fun insertUser(user: User) = userDao.insertUser(user)
    suspend fun updateUser(user: User) = userDao.updateUser(user)

    suspend fun insertNote(note: Note) = noteDao.insertNote(note)
    suspend fun deleteNote(note: Note) = noteDao.deleteNote(note)
    fun searchNotes(query: String) = noteDao.searchNotes(query)

    suspend fun insertQuizResult(result: QuizResult) = quizDao.insertResult(result)
}