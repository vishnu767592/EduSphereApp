package com.example.edusphereapp

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.edusphereapp.data.local.entity.Note
import java.text.SimpleDateFormat
import java.util.*

class NoteAdapter(private val onNoteClick: (Note) -> Unit) : 
    ListAdapter<Note, NoteAdapter.NoteViewHolder>(DiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NoteViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_note, parent, false)
        return NoteViewHolder(view)
    }

    override fun onBindViewHolder(holder: NoteViewHolder, position: Int) {
        val note = getItem(position)
        holder.titleTv.text = note.title
        holder.contentTv.text = note.content
        
        val sdf = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
        holder.dateTv.text = sdf.format(Date(note.timestamp))
        
        holder.itemView.setOnClickListener { onNoteClick(note) }
    }

    class NoteViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val titleTv: TextView = itemView.findViewById(R.id.noteTitle)
        val contentTv: TextView = itemView.findViewById(R.id.noteContent)
        val dateTv: TextView = itemView.findViewById(R.id.noteDate)
    }

    class DiffCallback : DiffUtil.ItemCallback<Note>() {
        override fun areItemsTheSame(oldItem: Note, newItem: Note) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: Note, newItem: Note) = oldItem == newItem
    }
}