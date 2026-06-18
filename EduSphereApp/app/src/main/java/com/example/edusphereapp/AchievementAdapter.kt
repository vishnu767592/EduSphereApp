package com.example.edusphereapp

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

data class Achievement(val title: String, val description: String, val iconResId: Int)

class AchievementAdapter(private val achievements: List<Achievement>) :
    RecyclerView.Adapter<AchievementAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_achievement, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = achievements[position]
        holder.title.text = item.title
        holder.desc.text = item.description
        holder.icon.setImageResource(item.iconResId)
    }

    override fun getItemCount() = achievements.size

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val title: TextView = view.findViewById(R.id.achievementTitle)
        val desc: TextView = view.findViewById(R.id.achievementDesc)
        val icon: ImageView = view.findViewById(R.id.achievementIcon)
    }
}