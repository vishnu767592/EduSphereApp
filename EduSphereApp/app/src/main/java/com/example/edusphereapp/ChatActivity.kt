package com.example.edusphereapp

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ProgressBar
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.floatingactionbutton.FloatingActionButton
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class ChatActivity : AppCompatActivity() {

    private lateinit var chatRv: RecyclerView
    private lateinit var messageEt: EditText
    private lateinit var sendBtn: FloatingActionButton
    private lateinit var typingIndicator: ProgressBar
    private lateinit var adapter: ChatAdapter
    private val messages = mutableListOf<ChatMessage>()

    // ✅ PASTE YOUR GROQ KEY HERE (starts with gsk_...)
    private val apiKey = "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"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val themeMode = ThemeHelper.getTheme(this)
        ThemeHelper.applyTheme(this, themeMode)

        setContentView(R.layout.activity_chat)

        chatRv = findViewById(R.id.chatRv)
        messageEt = findViewById(R.id.messageEt)
        sendBtn = findViewById(R.id.sendBtn)
        typingIndicator = findViewById(R.id.typingIndicator)
        val voiceBtn = findViewById<ImageButton>(R.id.voiceBtn)

        adapter = ChatAdapter()
        chatRv.layoutManager = LinearLayoutManager(this).apply {
            stackFromEnd = true
        }
        chatRv.adapter = adapter

        addMessage("Hello! I am your EduSphere AI Tutor. Ask me anything!", false)

        sendBtn.setOnClickListener {
            val text = messageEt.text.toString().trim()
            if (text.isNotEmpty()) {
                addMessage(text, true)
                messageEt.setText("")
                generateAIResponse(text)
            }
        }

        voiceBtn.setOnClickListener {
            startActivity(Intent(this, VoiceInputActivity::class.java))
        }
    }

    private fun addMessage(text: String, isUser: Boolean) {
        val currentList = messages.toMutableList()
        currentList.add(ChatMessage(text, isUser))
        messages.clear()
        messages.addAll(currentList)
        adapter.submitList(messages.toList())
        chatRv.scrollToPosition(messages.size - 1)
    }

    private fun generateAIResponse(userMessage: String) {

        typingIndicator.visibility = View.VISIBLE

        val client = OkHttpClient()

        // Build messages array with history
        val messagesArray = JSONArray()

        // System message
        messagesArray.put(JSONObject().apply {
            put("role", "system")
            put("content",
                "You are EduSphere AI Tutor, a helpful and friendly educational assistant. " +
                        "Help students understand topics clearly, simply and in an engaging way. " +
                        "Keep answers concise and easy to understand.",
                )
        })

        // Add conversation history
        for (msg in messages) {
            messagesArray.put(JSONObject().apply {
                put("role", if (msg.isUser) "user" else "assistant")
                put("content", msg.text)
            })
        }

        // Add current user message
        messagesArray.put(JSONObject().apply {
            put("role", "user")
            put("content", userMessage)
        })

        val json = JSONObject().apply {
            put("model", "llama-3.3-70b-versatile")
            put("messages", messagesArray)
            put("max_tokens", 1024)
            put("temperature", 0.7)
        }

        val body = json.toString().toRequestBody("application/json".toMediaTypeOrNull())

        val request = Request.Builder()
            .url("https://api.groq.com/openai/v1/chat/completions")
            .addHeader("Authorization", "Bearer $apiKey")
            .addHeader("Content-Type", "application/json")
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {

            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    typingIndicator.visibility = View.GONE
                    addMessage("Connection Error: ${e.message}", false)
                }
            }

            override fun onResponse(call: Call, response: Response) {
                val responseBody = response.body?.string()
                Log.d("GroqResponse", responseBody ?: "Empty")

                runOnUiThread {
                    typingIndicator.visibility = View.GONE
                    try {
                        val obj = JSONObject(responseBody!!)

                        if (obj.has("choices")) {
                            val text = obj.getJSONArray("choices")
                                .getJSONObject(0)
                                .getJSONObject("message")
                                .getString("content")
                            addMessage(text, false)
                        } else if (obj.has("error")) {
                            val errorMsg = obj.getJSONObject("error").getString("message")
                            addMessage("Error: $errorMsg", false)
                        } else {
                            addMessage("Unexpected response: $responseBody", false)
                        }

                    } catch (e: Exception) {
                        Log.e("GroqError", responseBody ?: "Empty response")
                        addMessage("Parse Error: ${e.message}", false)
                    }
                }
            }
        })
    }
}