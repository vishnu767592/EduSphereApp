package com.example.edusphereapp

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView

class ChatAdapter : ListAdapter<ChatMessage, ChatAdapter.ChatViewHolder>(DiffCallback()) {

    companion object {
        private const val TYPE_USER = 1
        private const val TYPE_AI = 2
    }

    override fun getItemViewType(position: Int): Int {
        return if (getItem(position).isUser) TYPE_USER else TYPE_AI
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ChatViewHolder {
        val layout = if (viewType == TYPE_USER) R.layout.item_chat_user else R.layout.item_chat_ai
        val view = LayoutInflater.from(parent.context).inflate(layout, parent, false)
        return ChatViewHolder(view)
    }

    override fun onBindViewHolder(holder: ChatViewHolder, position: Int) {
        holder.messageTv.text = getItem(position).text
    }

    class ChatViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val messageTv: TextView = itemView.findViewById(R.id.messageTv)
    }

    class DiffCallback : DiffUtil.ItemCallback<ChatMessage>() {
        override fun areItemsTheSame(oldItem: ChatMessage, newItem: ChatMessage) = 
            oldItem.text == newItem.text && oldItem.isUser == newItem.isUser

        override fun areContentsTheSame(oldItem: ChatMessage, newItem: ChatMessage) = 
            oldItem == newItem
    }
}