package com.example.edusphereapp

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class SubjectListActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Apply theme
        val themeMode = ThemeHelper.getTheme(this)
        ThemeHelper.applyTheme(this, themeMode)
        
        setContentView(R.layout.activity_subject_list)

        val subjectRv = findViewById<RecyclerView>(R.id.subjectRv)
        
        val subjects = listOf(
            Subject("Quantum Physics", "12 Topics", android.R.drawable.ic_menu_compass),
            Subject("Human Anatomy", "15 Topics", android.R.drawable.ic_menu_myplaces),
            Subject("Organic Chemistry", "10 Topics", android.R.drawable.ic_menu_day),
            Subject("Ancient History", "8 Topics", android.R.drawable.ic_menu_today),
            Subject("Calculus III", "14 Topics", android.R.drawable.ic_menu_edit),
            Subject("Astrophysics", "11 Topics", android.R.drawable.ic_menu_camera),
            Subject("Marine Biology", "9 Topics", android.R.drawable.ic_menu_gallery),
            Subject("World Geography", "13 Topics", android.R.drawable.ic_menu_mapmode),
            Subject("Computer Science", "20 Topics", android.R.drawable.ic_menu_preferences),
            Subject("Microbiology", "7 Topics", android.R.drawable.ic_menu_view),
            Subject("Psychology 101", "10 Topics", android.R.drawable.ic_menu_info_details),
            Subject("Environmental Science", "12 Topics", android.R.drawable.ic_menu_directions),
            Subject("Economics", "15 Topics", android.R.drawable.ic_menu_sort_by_size),
            Subject("Artificial Intelligence", "18 Topics", android.R.drawable.ic_menu_manage),
            Subject("Genetics", "9 Topics", android.R.drawable.ic_menu_search),
            Subject("Sociology", "11 Topics", android.R.drawable.ic_menu_agenda),
            Subject("Political Science", "8 Topics", android.R.drawable.ic_menu_mylocation),
            Subject("Philosophy", "10 Topics", android.R.drawable.ic_menu_help),
            Subject("Marketing", "14 Topics", android.R.drawable.ic_menu_send),
            Subject("Cyber Security", "16 Topics", android.R.drawable.ic_lock_idle_lock),
        )

        val adapter = SubjectAdapter(subjects) { subject ->
            val intent = Intent(this, TopicListActivity::class.java)
            intent.putExtra("SUBJECT_NAME", subject.name)
            startActivity(intent)
        }

        subjectRv.layoutManager = LinearLayoutManager(this)
        subjectRv.adapter = adapter
    }
}