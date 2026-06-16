package com.example.edusphereapp

import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class AddNotesActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_notes)

        findViewById<Button>(R.id.saveNoteBtn).setOnClickListener {
            Toast.makeText(this, "Note Saved", Toast.LENGTH_SHORT).show()
            finish()
        }
    }
}