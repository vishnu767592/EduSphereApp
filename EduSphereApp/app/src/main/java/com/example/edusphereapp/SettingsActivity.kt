package com.example.edusphereapp

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class SettingsActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        findViewById<Button>(R.id.themeBtn).setOnClickListener {
            val currentTheme = ThemeHelper.getTheme(this)
            val newTheme = if (currentTheme == ThemeHelper.LIGHT_MODE) ThemeHelper.DARK_MODE else ThemeHelper.LIGHT_MODE
            ThemeHelper.applyTheme(this, newTheme)
            recreate() // Apply immediately
        }

        findViewById<Button>(R.id.logoutBtn).setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
            finishAffinity()
        }
    }
}