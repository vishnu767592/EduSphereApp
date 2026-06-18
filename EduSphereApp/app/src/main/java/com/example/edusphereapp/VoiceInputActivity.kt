package com.example.edusphereapp

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.edusphereapp.databinding.ActivityVoiceInputBinding
import java.util.*

class VoiceInputActivity : AppCompatActivity() {

    private lateinit var binding: ActivityVoiceInputBinding
    private var speechRecognizer: SpeechRecognizer? = null
    private var recognitionIntent: Intent? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityVoiceInputBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Request Audio Permission
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.RECORD_AUDIO), 1)
        }

        setupSpeechRecognizer()

        binding.micBtn.setOnClickListener {
            startListening()
        }

        binding.closeBtn.setOnClickListener { finish() }
    }

    private fun setupSpeechRecognizer() {
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this)
        recognitionIntent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
        }

        speechRecognizer?.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {
                binding.statusTv.text = "Listening..."
                binding.pulseView.visibility = View.VISIBLE
            }

            override fun onResults(results: Bundle?) {
                val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                if (!matches.isNullOrEmpty()) {
                    val spokenText = matches[0]
                    binding.resultTv.text = spokenText
                    
                    // Return result to previous activity or navigate to chat
                    val intent = Intent(this@VoiceInputActivity, ChatActivity::class.java)
                    intent.putExtra("VOICE_QUERY", spokenText)
                    startActivity(intent)
                    finish()
                }
                binding.pulseView.visibility = View.GONE
            }

            override fun onError(error: Int) {
                binding.statusTv.text = "Error occurred. Try again."
                binding.pulseView.visibility = View.GONE
            }

            override fun onBeginningOfSpeech() {}
            override fun onRmsChanged(rmsdB: Float) {}
            override fun onBufferReceived(buffer: ByteArray?) {}
            override fun onEndOfSpeech() {
                binding.statusTv.text = "Processing..."
            }
            override fun onPartialResults(partialResults: Bundle?) {}
            override fun onEvent(eventType: Int, params: Bundle?) {}
        })
    }

    private fun startListening() {
        speechRecognizer?.startListening(recognitionIntent)
    }

    override fun onDestroy() {
        super.onDestroy()
        speechRecognizer?.destroy()
    }
}