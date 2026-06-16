package com.example.edusphereapp

import android.os.Bundle
import android.widget.VideoView
import android.net.Uri
import android.widget.MediaController
import androidx.appcompat.app.AppCompatActivity

class VideoPlayerActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_video_player)

        val videoView = findViewById<VideoView>(R.id.videoView)
        val mediaController = MediaController(this)
        mediaController.setAnchorView(videoView)
        videoView.setMediaController(mediaController)
        
        // Example path
        // videoView.setVideoURI(Uri.parse("android.resource://" + packageName + "/" + R.raw.sample_video))
        // videoView.start()
    }
}