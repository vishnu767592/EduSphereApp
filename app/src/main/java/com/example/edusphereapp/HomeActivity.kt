package com.example.edusphereapp

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity

class HomeActivity : AppCompatActivity() {

    lateinit var hologramBtn: View
    lateinit var aiChatBtn: View
    lateinit var learningBtn: View
    lateinit var settingsBtn: View

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_home)

        // Link buttons (using View to support CardView/Button)
        hologramBtn = findViewById(R.id.hologramBtn)
        aiChatBtn = findViewById(R.id.aiChatBtn)
        learningBtn = findViewById(R.id.learningBtn)
        settingsBtn = findViewById(R.id.settingsBtn)

        // Open Hologram Screen
        hologramBtn.setOnClickListener {

            startActivity(
                Intent(this, HologramViewerActivity::class.java)
            )

        }

        // Open AI Chat Screen
        aiChatBtn.setOnClickListener {

            startActivity(
                Intent(this, ChatActivity::class.java)
            )

        }

        // Open Learning Screen
        learningBtn.setOnClickListener {

            startActivity(
                Intent(this, SubjectListActivity::class.java)
            )

        }

        // Open Settings Screen
        settingsBtn.setOnClickListener {

            startActivity(
                Intent(this, SettingsActivity::class.java)
            )

        }
    }
}