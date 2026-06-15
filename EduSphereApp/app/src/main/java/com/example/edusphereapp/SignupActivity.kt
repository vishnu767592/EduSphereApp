package com.example.edusphereapp

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class SignupActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_signup)

        val nameEt = findViewById<EditText>(R.id.nameEt)
        val emailEt = findViewById<EditText>(R.id.emailEt)
        val passwordEt = findViewById<EditText>(R.id.passwordEt)
        val signupBtn = findViewById<Button>(R.id.signupBtn)
        val loginTv = findViewById<TextView>(R.id.loginTv)

        signupBtn.setOnClickListener {
            val email = emailEt.text.toString().trim()
            val pass = passwordEt.text.toString().trim()

            if (email.isEmpty() || pass.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
            } else {
                // Save credentials in SharedPreferences
                val sharedPref = getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)
                val editor = sharedPref.edit()
                editor.putString("email", email)
                editor.putString("password", pass)
                editor.apply()

                Toast.makeText(this, "Account Created Successfully", Toast.LENGTH_SHORT).show()
                finish() // Go back to login page
            }
        }

        loginTv.setOnClickListener {
            finish()
        }
    }
}
