package com.example.edusphereapp

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class NotesViewerActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notes_viewer)

        findViewById<Button>(R.id.addNotesBtn).setOnClickListener {
            startActivity(Intent(this, AddNotesActivity::class.java))
        }
    }
}