package com.example.edusphereapp

import android.os.Bundle
import android.view.View
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

class NotesActivity : AppCompatActivity() {

    private val apiKey = "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"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val themeMode = ThemeHelper.getTheme(this)
        ThemeHelper.applyTheme(this, themeMode)
        setContentView(R.layout.activity_notes)

        val topicName = intent.getStringExtra("TOPIC_NAME") ?: "Topic"

        findViewById<TextView>(R.id.notesTitleTv).text = "📓 $topicName Notes"
        findViewById<ImageButton>(R.id.notesBackBtn).setOnClickListener { finish() }

        loadNotes(topicName)
    }

    private fun loadNotes(topic: String) {
        val loadingBar = findViewById<ProgressBar>(R.id.notesLoadingBar)
        val notesTv = findViewById<TextView>(R.id.notesContentTv)
        val definitionTv = findViewById<TextView>(R.id.definitionTv)
        val formulaTv = findViewById<TextView>(R.id.formulaTv)
        val keyPointsTv = findViewById<TextView>(R.id.keyPointsTv)

        loadingBar.visibility = View.VISIBLE

        val client = OkHttpClient()
        val messagesArray = JSONArray()

        messagesArray.put(JSONObject().apply {
            put("role", "system")
            put("content", "You are EduSphere AI. Generate structured study notes.")
        })
        messagesArray.put(JSONObject().apply {
            put("role", "user")
            put("content", """
                Generate complete study notes for '$topic' with these exact sections:
                
                DEFINITION:
                (Write a clear 2-3 sentence definition)
                
                KEY FORMULAS OR FACTS:
                (List 3-4 important formulas or facts with bullet points)
                
                KEY POINTS:
                (List 5-6 important bullet points to remember)
                
                SUMMARY:
                (Write a 3-4 sentence summary)
                
                EXAM TIPS:
                (List 3 important exam tips)
            """.trimIndent())
        })

        val json = JSONObject().apply {
            put("model", "llama-3.3-70b-versatile")
            put("messages", messagesArray)
            put("max_tokens", 1000)
            put("temperature", 0.5)
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
                    notesTv.text = getOfflineNotes(topic)
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
                            parseAndDisplayNotes(text, definitionTv, formulaTv, keyPointsTv, notesTv)
                        } else {
                            notesTv.text = getOfflineNotes(topic)
                        }
                    } catch (e: Exception) {
                        notesTv.text = getOfflineNotes(topic)
                    }
                }
            }
        })
    }

    private fun parseAndDisplayNotes(
        text: String,
        definitionTv: TextView,
        formulaTv: TextView,
        keyPointsTv: TextView,
        notesTv: TextView
    ) {
        try {
            val defStart = text.indexOf("DEFINITION:") + 11
            val defEnd = text.indexOf("KEY FORMULAS")
            val definition = if (defStart > 10 && defEnd > defStart)
                text.substring(defStart, defEnd).trim() else ""

            val formulaStart = text.indexOf("KEY FORMULAS OR FACTS:") + 22
            val formulaEnd = text.indexOf("KEY POINTS:")
            val formula = if (formulaStart > 21 && formulaEnd > formulaStart)
                text.substring(formulaStart, formulaEnd).trim() else ""

            val keyStart = text.indexOf("KEY POINTS:") + 11
            val keyEnd = text.indexOf("SUMMARY:")
            val keyPoints = if (keyStart > 10 && keyEnd > keyStart)
                text.substring(keyStart, keyEnd).trim() else ""

            if (definition.isNotEmpty()) definitionTv.text = definition
            if (formula.isNotEmpty()) formulaTv.text = formula
            if (keyPoints.isNotEmpty()) keyPointsTv.text = keyPoints

            notesTv.text = text

        } catch (e: Exception) {
            notesTv.text = text
        }
    }

    private fun getOfflineNotes(topic: String): String {
        return """
📖 DEFINITION:
$topic is a fundamental concept that plays a key role in its field of study. Understanding it provides a foundation for more advanced topics.

🔢 KEY FORMULAS OR FACTS:
- Core principle 1 of $topic
- Mathematical relationship involved
- Key measurement or value
- Important law or theorem

🔑 KEY POINTS:
- $topic was discovered/developed through scientific research
- It applies to real-world situations around us
- Understanding it requires basic prior knowledge
- It connects to several other important concepts
- Researchers continue to find new applications
- It has both theoretical and practical importance

📋 SUMMARY:
$topic is an essential subject that students must understand deeply. It forms the backbone of many advanced concepts in this field. Regular practice and revision will help master this topic effectively.

💡 EXAM TIPS:
- Always understand the concept before memorizing
- Practice solving related problems
- Connect this topic to real-world examples
        """.trimIndent()
    }
}