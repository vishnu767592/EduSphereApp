package com.example.edusphereapp

import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.VideoView
import androidx.appcompat.app.AppCompatActivity

class HologramViewerActivity : AppCompatActivity() {

    lateinit var videoView: VideoView
    lateinit var playBtn: View
    lateinit var pauseBtn: View

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_hologram_viewer)

        // Link UI (using View for compatibility)
        videoView = findViewById(R.id.videoView)
        playBtn = findViewById(R.id.playBtn)
        pauseBtn = findViewById(R.id.pauseBtn)

        // Video path
        val uri = Uri.parse(
            "android.resource://" + packageName + "/" + R.raw.hologram
        )

        videoView.setVideoURI(uri)

        // Auto start + loop
        videoView.setOnPreparedListener {
            it.isLooping = true
            videoView.start()
        }

        // Play button
        playBtn.setOnClickListener {
            videoView.start()
        }

        // Pause button
        pauseBtn.setOnClickListener {
            videoView.pause()
        }
    }
}