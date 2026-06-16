package com.example.edusphereapp

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class TopicDetailActivity2 : AppCompatActivity() {

    private val apiKey = "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"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val themeMode = ThemeHelper.getTheme(this)
        ThemeHelper.applyTheme(this, themeMode)
        setContentView(R.layout.activity_topic_detail2)

        val topicName = intent.getStringExtra("TOPIC_NAME") ?: "Topic"
        val topicDifficulty = intent.getStringExtra("TOPIC_DIFFICULTY") ?: "Beginner"
        val subjectName = intent.getStringExtra("SUBJECT_NAME") ?: "General"

        val titleTv = findViewById<TextView>(R.id.topicTitleTv)
        val difficultyTv = findViewById<TextView>(R.id.topicDifficultyTv)
        val contentTv = findViewById<TextView>(R.id.topicContentTv)
        val loadingBar = findViewById<ProgressBar>(R.id.loadingBar)
        val play3dBtn = findViewById<Button>(R.id.play3dBtn)
        val startQuizBtn = findViewById<Button>(R.id.startQuizBtn)
        val viewNotesBtn = findViewById<Button>(R.id.viewNotesBtn)
        val backBtn = findViewById<ImageButton>(R.id.backBtn)

        titleTv.text = topicName
        difficultyTv.text = topicDifficulty

        // ✅ Save progress when topic is opened
        ProgressManager.markTopicCompleted(this, subjectName, topicName)

        val diffColor = when (topicDifficulty) {
            "Beginner" -> android.graphics.Color.parseColor("#4CAF50")
            "Intermediate" -> android.graphics.Color.parseColor("#FF9800")
            "Advanced" -> android.graphics.Color.parseColor("#F44336")
            else -> android.graphics.Color.GRAY
        }
        difficultyTv.setTextColor(diffColor)

        backBtn.setOnClickListener { finish() }

        loadTopicContent(topicName, topicDifficulty, contentTv, loadingBar)

        play3dBtn.setOnClickListener {
            val videoUrl = get3DVideoUrl(topicName)
            val intent = Intent(this, VRVideoActivity::class.java)
            intent.putExtra("VIDEO_URL", videoUrl)
            intent.putExtra("TOPIC_NAME", topicName)
            startActivity(intent)
        }

        startQuizBtn.setOnClickListener {
            val intent = Intent(this,
                QuizQuestionsActivity::class.java)
            intent.putExtra("TOPIC_NAME", topicName)
            intent.putExtra("SUBJECT_NAME", subjectName)
            startActivity(intent)
        }

        viewNotesBtn.setOnClickListener {
            val intent = Intent(this, NotesActivity::class.java)
            intent.putExtra("TOPIC_NAME", topicName)
            startActivity(intent)
        }
    }

    private fun loadTopicContent(
        topic: String,
        difficulty: String,
        contentTv: TextView,
        loadingBar: ProgressBar
    ) {
        loadingBar.visibility = View.VISIBLE
        contentTv.text = ""

        val client = OkHttpClient()
        val messagesArray = JSONArray()

        messagesArray.put(JSONObject().apply {
            put("role", "system")
            put("content", "You are EduSphere AI Tutor. Explain topics clearly for students.")
        })
        messagesArray.put(JSONObject().apply {
            put("role", "user")
            put("content",
                "Explain '$topic' at $difficulty level in a clear, engaging way. " +
                        "Structure your response with: " +
                        "1. What is it? (2-3 sentences) " +
                        "2. Key Concepts (3-4 bullet points) " +
                        "3. Real World Example (1-2 sentences) " +
                        "4. Fun Fact (1 sentence) " +
                        "Keep it educational and easy to understand."
            )
        })

        val json = JSONObject().apply {
            put("model", "llama-3.3-70b-versatile")
            put("messages", messagesArray)
            put("max_tokens", 800)
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
                    loadingBar.visibility = View.GONE
                    contentTv.text = getOfflineContent(topic)
                }
            }

            override fun onResponse(call: Call, response: Response) {
                val responseBody = response.body?.string()
                runOnUiThread {
                    loadingBar.visibility = View.GONE
                    try {
                        val obj = JSONObject(responseBody!!)
                        if (obj.has("choices")) {
                            val text = obj.getJSONArray("choices")
                                .getJSONObject(0)
                                .getJSONObject("message")
                                .getString("content")
                            contentTv.text = text
                        } else {
                            contentTv.text = getOfflineContent(topic)
                        }
                    } catch (e: Exception) {
                        contentTv.text = getOfflineContent(topic)
                    }
                }
            }
        })
    }

    private fun getOfflineContent(topic: String): String {
        return """
$topic

📖 What is it?
$topic is an important concept in this subject area. It forms a fundamental part of understanding the broader topic and has wide applications in science and everyday life.

🔑 Key Concepts:
- Core principles that define $topic
- How it relates to other concepts in this field
- Mathematical or scientific framework involved
- Practical applications and use cases

🌍 Real World Example:
$topic can be observed in everyday situations around us, from natural phenomena to modern technology that we use daily.

💡 Fun Fact:
Scientists and researchers continue to discover new applications of $topic in cutting-edge fields like AI, medicine, and space exploration!
        """.trimIndent()
    }

    private fun get3DVideoUrl(topic: String): String {
        return when (topic) {
            "Wave-Particle Duality" -> "https://www.youtube.com/watch?v=Iuv6hY6zsd0"
            "Quantum Entanglement" -> "https://www.youtube.com/watch?v=JFozGfxmi8A"
            "Black Holes" -> "https://www.youtube.com/watch?v=Hd6oSAA6HG4"
            "Human Anatomy", "Skeletal System", "Nervous System",
            "Cardiovascular System" -> "https://www.youtube.com/watch?v=w6sTR6vCNNo"
            "The Big Bang" -> "https://www.youtube.com/watch?v=Iuv6hY6zsd0"
            "Solar System", "Galaxies", "Astrophysics" -> "https://www.youtube.com/watch?v=MTY1Kje0yLg"
            "DNA", "Cell Biology", "Genetics" -> "https://www.youtube.com/watch?v=7Hk9jct2ozY"
            "Coral Reefs", "Marine Biology",
            "Ocean Ecosystems" -> "https://www.youtube.com/watch?v=MXaAR0fUkCY"
            "Ancient Egypt", "Ancient History" -> "https://www.youtube.com/watch?v=nBwAjLbCBrQ"
            "Muscular System" -> "https://www.youtube.com/watch?v=w6sTR6vCNNo"
            else -> "https://www.youtube.com/watch?v=Iuv6hY6zsd0"
        }
    }
}


