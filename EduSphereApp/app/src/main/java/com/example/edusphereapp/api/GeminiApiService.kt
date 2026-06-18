package com.example.edusphereapp.api

import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException

class GeminiApiService(private val apiKey: String) {

    private val client = OkHttpClient()
    private val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

    fun getAiResponse(userPrompt: String, callback: (String?) -> Unit) {
        val json = JSONObject()
        val contents = JSONArray()
        val messageObject = JSONObject()
        val partsArray = JSONArray()
        val textPart = JSONObject()

        textPart.put("text", userPrompt)
        partsArray.put(textPart)
        messageObject.put("parts", partsArray)
        contents.put(messageObject)
        json.put("contents", contents)

        val body = json.toString().toRequestBody("application/json".toMediaTypeOrNull())
        val request = Request.Builder()
            .url("$url?key=$apiKey")
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                callback(null)
            }

            override fun onResponse(call: Call, response: Response) {
                val responseBody = response.body?.string()
                try {
                    val obj = JSONObject(responseBody!!)
                    val text = obj.getJSONArray("candidates")
                        .getJSONObject(0)
                        .getJSONObject("content")
                        .getJSONArray("parts")
                        .getJSONObject(0)
                        .getString("text")
                    callback(text)
                } catch (e: Exception) {
                    callback(null)
                }
            }
        })
    }
}