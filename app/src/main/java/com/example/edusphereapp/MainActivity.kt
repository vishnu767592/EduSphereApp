package com.example.edusphereapp

import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.VideoView
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

class MainActivity : AppCompatActivity() {

    lateinit var userInput: EditText
    lateinit var askBtn: Button
    lateinit var responseText: TextView
    lateinit var videoView: VideoView

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // UI linking
        userInput = findViewById(R.id.userInput)
        askBtn = findViewById(R.id.askBtn)
        responseText = findViewById(R.id.responseText)
        videoView = findViewById(R.id.videoView)

        askBtn.setOnClickListener {

            thread {

                try {

                    // ✅ YOUR FLASK BACKEND URL
                    val url =
                        URL("http://172.25.48.131:5000/ask")

                    val connection =
                        url.openConnection() as HttpURLConnection

                    connection.requestMethod = "POST"

                    connection.setRequestProperty(
                        "Content-Type",
                        "application/json",
                    )

                    connection.doOutput = true

                    // Send question
                    val jsonInput = JSONObject()

                    jsonInput.put(
                        "question",
                        userInput.text.toString()
                    )

                    val writer =
                        OutputStreamWriter(connection.outputStream)

                    writer.write(jsonInput.toString())
                    writer.flush()

                    // Get response
                    val response =
                        connection.inputStream.bufferedReader()
                            .readText()

                    val jsonResponse =
                        JSONObject(response)

                    val answer =
                        jsonResponse.getString("answer")

                    val video =
                        jsonResponse.getString("video")

                    runOnUiThread {

                        // Show answer
                        responseText.text = answer

                        // Play video
                        val videoPath =
                            "android.resource://$packageName/raw/" +
                                    video.replace(".mp4", "")

                        val uri = Uri.parse(videoPath)

                        videoView.setVideoURI(uri)

                        videoView.setOnPreparedListener { mp ->
                            mp.isLooping = true
                            videoView.start()
                        }
                    }

                } catch (e: Exception) {

                    runOnUiThread {
                        responseText.text =
                            "Error: ${e.message}"
                    }

                }

            }

        }

    }

}
