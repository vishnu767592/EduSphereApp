package com.example.edusphereapp.ui.fragment

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.GridLayoutManager
import com.example.edusphereapp.HologramViewerActivity
import com.example.edusphereapp.SubjectAdapter
import com.example.edusphereapp.Subject
import com.example.edusphereapp.databinding.FragmentHologramBinding
import com.example.edusphereapp.ui.viewmodel.HologramViewModel

class HologramFragment : Fragment() {

    private var _binding: FragmentHologramBinding? = null
    private val binding get() = _binding!!
    private val viewModel: HologramViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHologramBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel.items.observe(viewLifecycleOwner) { items ->
            val subjects = items.map { Subject(it.title, it.category, it.iconResId) }
            val adapter = SubjectAdapter(subjects) { subject ->
                val item = items.find { it.title == subject.name }
                item?.let {
                    val intent = Intent(requireContext(), HologramViewerActivity::class.java)
                    intent.putExtra("VIDEO_URL", it.videoUrl)
                    intent.putExtra("TOPIC_NAME", it.title)
                    startActivity(intent)
                }
            }
            binding.hologramRv.layoutManager = GridLayoutManager(context, 2)
            binding.hologramRv.adapter = adapter
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}