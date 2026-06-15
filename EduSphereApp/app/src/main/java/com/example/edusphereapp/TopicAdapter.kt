package com.example.edusphereapp

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class TopicAdapter(
    private val topics: List<Topic>,
    private val onTopicClick: (Topic) -> Unit
) : RecyclerView.Adapter<TopicAdapter.TopicViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TopicViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_topic, parent, false)
        return TopicViewHolder(view)
    }

    override fun onBindViewHolder(holder: TopicViewHolder, position: Int) {
        val topic = topics[position]
        holder.nameTv.text = topic.name
        holder.difficultyTv.text = topic.difficulty
        val color = when (topic.difficulty) {
            "Beginner" -> android.graphics.Color.parseColor("#4CAF50")
            "Intermediate" -> android.graphics.Color.parseColor("#FF9800")
            "Advanced" -> android.graphics.Color.parseColor("#F44336")
            else -> android.graphics.Color.GRAY
        }
        holder.difficultyTv.setTextColor(color)
        holder.itemView.setOnClickListener { onTopicClick(topic) }
    }

    override fun getItemCount(): Int = topics.size

    class TopicViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nameTv: TextView = itemView.findViewById(R.id.topicName)
        val difficultyTv: TextView = itemView.findViewById(R.id.topicDifficulty)
    }
}