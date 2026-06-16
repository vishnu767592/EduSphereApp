package com.example.edusphereapp

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.textfield.TextInputEditText

class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Apply theme
        val themeMode = ThemeHelper.getTheme(this)
        ThemeHelper.applyTheme(this, themeMode)
        
        setContentView(R.layout.activity_login)

        val emailEt = findViewById<TextInputEditText>(R.id.emailEt)
        val passwordEt = findViewById<TextInputEditText>(R.id.passwordEt)
        val loginBtn = findViewById<Button>(R.id.loginBtn)
        val signupTv = findViewById<TextView>(R.id.signupTv)

        loginBtn.setOnClickListener {
            val emailInput = emailEt.text.toString().trim()
            val passInput = passwordEt.text.toString().trim()

            if (emailInput.isEmpty() || passInput.isEmpty()) {
                Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show()
            } else {
                // Check if user is registered locally
                val sharedPref = getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)
                val isRegistered = sharedPref.getBoolean("isRegistered", false)
                val savedEmail = sharedPref.getString("email", "")

                // NOTE: In a full implementation, this should call the backend /api/auth/login
                // endpoint and verify credentials server-side. The returned JWT should be stored
                // securely using EncryptedSharedPreferences.
                if (isRegistered && emailInput == savedEmail) {
                    Toast.makeText(this, "Login Successful", Toast.LENGTH_SHORT).show()
                    startActivity(Intent(this, HomeActivity::class.java))
                    finish()
                } else {
                    Toast.makeText(this, "Invalid credentials. Please Signup first.", Toast.LENGTH_SHORT).show()
                }
            }
        }

        signupTv.setOnClickListener {
            startActivity(Intent(this, SignupActivity::class.java))
        }
    }
}
