package com.example.edusphereapp.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.edusphereapp.data.local.dao.*
import com.example.edusphereapp.data.local.entity.*

@Database(
    entities = [User::class, Note::class, Bookmark::class, QuizResult::class, LearningProgress::class, ChatHistory::class],
    version = 1,
    exportSchema = false
)
abstract class EduSphereDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun noteDao(): NoteDao
    abstract fun quizDao(): QuizDao

    companion object {
        @Volatile
        private var INSTANCE: EduSphereDatabase? = null

        fun getDatabase(context: Context): EduSphereDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    EduSphereDatabase::class.java,
                    "edusphere_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}