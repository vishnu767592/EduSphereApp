package com.example.edusphereapp

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class TopicDetailActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val themeMode = ThemeHelper.getTheme(this)
        ThemeHelper.applyTheme(this, themeMode)
        setContentView(R.layout.activity_topic_detail)
        
        val topicName = intent.getStringExtra("TOPIC_NAME") ?: "Topic"
        val difficulty = intent.getStringExtra("TOPIC_DIFFICULTY") ?: "Beginner"

        // Set UI Text
        findViewById<TextView>(R.id.topicTitleTv).text = topicName
        findViewById<TextView>(R.id.topicDifficultyTv).text = difficulty
        findViewById<TextView>(R.id.topicContentTv).text = "Welcome to the $topicName lesson. Here you will learn the core concepts and practical applications of this topic."
        
        findViewById<ImageButton>(R.id.backBtn).setOnClickListener { finish() }

        findViewById<Button>(R.id.startQuizBtn).setOnClickListener {
            val intent = Intent(this, QuizQuestionsActivity::class.java)
            intent.putExtra("TOPIC_NAME", topicName)
            startActivity(intent)
        }

        findViewById<Button>(R.id.viewNotesBtn).setOnClickListener {
            val intent = Intent(this, NotesActivity::class.java)
            intent.putExtra("TOPIC_NAME", topicName)
            startActivity(intent)
        }

        findViewById<Button>(R.id.watchVideoBtn).setOnClickListener {
            startActivity(Intent(this, VideoPlayerActivity::class.java))
        }

        // Hidden/Compatibility logic
        findViewById<Button>(R.id.takeQuizBtn).setOnClickListener {
            startActivity(Intent(this, QuizStartActivity::class.java))
        }

        findViewById<Button>(R.id.notesBtn).setOnClickListener {
            startActivity(Intent(this, NotesViewerActivity::class.java))
        }
    }
}