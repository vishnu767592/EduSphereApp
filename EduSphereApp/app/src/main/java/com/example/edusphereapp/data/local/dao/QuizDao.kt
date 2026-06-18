package com.example.edusphereapp.data.local.dao

import androidx.room.*
import com.example.edusphereapp.data.local.entity.QuizResult
import kotlinx.coroutines.flow.Flow

@Dao
interface QuizDao {
    @Query("SELECT * FROM quiz_results ORDER BY timestamp DESC")
    fun getAllResults(): Flow<List<QuizResult>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertResult(result: QuizResult)

    @Query("SELECT AVG(percentage) FROM quiz_results")
    fun getAveragePercentage(): Flow<Int>
}