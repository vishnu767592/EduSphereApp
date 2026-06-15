package com.example.edusphereapp

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class QuizResultActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_quiz_result)

        findViewById<Button>(R.id.reviewBtn).setOnClickListener {
            startActivity(Intent(this, ReviewAnswersActivity::class.java))
        }

        findViewById<Button>(R.id.homeBtn).setOnClickListener {
            startActivity(Intent(this, HomeActivity::class.java))
            finishAffinity()
        }
    }
}