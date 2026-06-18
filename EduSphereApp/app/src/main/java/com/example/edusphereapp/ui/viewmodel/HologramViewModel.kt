package com.example.edusphereapp.ui.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

data class HologramItem(
    val title: String,
    val category: String,
    val videoUrl: String,
    val iconResId: Int
)

class HologramViewModel : ViewModel() {
    private val _items = MutableLiveData<List<HologramItem>>()
    val items: LiveData<List<HologramItem>> = _items

    init {
        loadHolograms()
    }

    private fun loadHolograms() {
        _items.value = listOf(
            HologramItem("Human Heart", "Biology", "heart_hologram", android.R.drawable.ic_menu_myplaces),
            HologramItem("Solar System", "Physics", "solar_system", android.R.drawable.ic_menu_compass),
            HologramItem("DNA Structure", "Biology", "dna_hologram", android.R.drawable.ic_menu_search),
            HologramItem("Atom Model", "Chemistry", "atom_hologram", android.R.drawable.ic_menu_view),
            HologramItem("Plant Cell", "Biology", "cell_hologram", android.R.drawable.ic_menu_camera),
            HologramItem("Tectonics", "Geography", "tectonics", android.R.drawable.ic_menu_mapmode)
        )
    }
}