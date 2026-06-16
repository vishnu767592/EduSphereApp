package com.example.edusphereapp

import android.os.Bundle
import android.widget.RadioGroup
import androidx.appcompat.app.AppCompatActivity

class ThemeSettingsActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_theme_settings)

        val themeRg = findViewById<RadioGroup>(R.id.themeRg)
        themeRg.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.lightRb -> ThemeHelper.applyTheme(this, ThemeHelper.LIGHT_MODE)
                R.id.darkRb -> ThemeHelper.applyTheme(this, ThemeHelper.DARK_MODE)
                R.id.systemRb -> ThemeHelper.applyTheme(this, ThemeHelper.SYSTEM_DEFAULT)
            }
        }
    }
}