package com.example.edusphereapp.ui.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.edusphereapp.ChatMessage
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class ChatViewModel : ViewModel() {

    private val _messages = MutableLiveData<MutableList<ChatMessage>>(mutableListOf())
    val messages: LiveData<MutableList<ChatMessage>> = _messages

    private val _isTyping = MutableLiveData<Boolean>(false)
    val isTyping: LiveData<Boolean> = _isTyping

    private val apiKey = "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"
    private val client = OkHttpClient()

    fun sendMessage(userMessage: String) {
        val currentList = _messages.value ?: mutableListOf()
        currentList.add(ChatMessage(userMessage, true))
        _messages.value = currentList
        
        generateAIResponse(userMessage, currentList)
    }

    private fun generateAIResponse(userMessage: String, history: List<ChatMessage>) {
        _isTyping.postValue(true)

        val messagesArray = JSONArray()
        messagesArray.put(JSONObject().apply {
            put("role", "system")
            put("content", "You are EduSphere AI Tutor, a helpful and friendly educational assistant.")
        })

        for (msg in history) {
            messagesArray.put(JSONObject().apply {
                put("role", if (msg.isUser) "user" else "assistant")
                put("content", msg.text)
            })
        }

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
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                _isTyping.postValue(false)
                postAiMessage("Connection Error: ${e.message}")
            }

            override fun onResponse(call: Call, response: Response) {
                _isTyping.postValue(false)
                val responseBody = response.body?.string()
                try {
                    val obj = JSONObject(responseBody!!)
                    val text = obj.getJSONArray("choices")
                        .getJSONObject(0)
                        .getJSONObject("message")
                        .getString("content")
                    postAiMessage(text)
                } catch (e: Exception) {
                    postAiMessage("Error: Failed to parse response")
                }
            }
        })
    }

    private fun postAiMessage(text: String) {
        viewModelScope.launch(Dispatchers.Main) {
            val currentList = _messages.value ?: mutableListOf()
            currentList.add(ChatMessage(text, false))
            _messages.value = currentList
        }
    }
}