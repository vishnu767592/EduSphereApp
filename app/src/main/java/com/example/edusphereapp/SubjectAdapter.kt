package com.example.edusphereapp

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class SubjectAdapter(
    private val subjects: List<Subject>,
    private val onSubjectClick: (Subject) -> Unit
) : RecyclerView.Adapter<SubjectAdapter.SubjectViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SubjectViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_subject, parent, false)
        return SubjectViewHolder(view)
    }

    override fun onBindViewHolder(holder: SubjectViewHolder, position: Int) {
        val subject = subjects[position]
        holder.nameTv.text = subject.name
        holder.topicCountTv.text = subject.topicCount
        holder.iconIv.setImageResource(subject.iconResId)
        
        holder.itemView.setOnClickListener { onSubjectClick(subject) }
    }

    override fun getItemCount(): Int = subjects.size

    class SubjectViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nameTv: TextView = itemView.findViewById(R.id.subjectName)
        val topicCountTv: TextView = itemView.findViewById(R.id.topicCount)
        val iconIv: ImageView = itemView.findViewById(R.id.subjectIcon)
    }
}