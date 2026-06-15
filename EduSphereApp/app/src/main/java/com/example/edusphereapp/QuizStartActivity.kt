package com.example.edusphereapp

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class QuizStartActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_quiz_start)

        findViewById<Button>(R.id.startQuizBtn).setOnClickListener {
            startActivity(Intent(this, QuizQuestionsActivity::class.java))
            finish()
        }
    }
}