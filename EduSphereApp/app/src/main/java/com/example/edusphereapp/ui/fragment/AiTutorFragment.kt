package com.example.edusphereapp.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.edusphereapp.ChatAdapter
import com.example.edusphereapp.databinding.ActivityChatBinding
import com.example.edusphereapp.ui.viewmodel.ChatViewModel

class AiTutorFragment : Fragment() {

    private var _binding: ActivityChatBinding? = null
    private val binding get() = _binding!!
    private val viewModel: ChatViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = ActivityChatBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Adjust for Fragment usage (hide header if needed, or update title)
        binding.chatTitle.text = "EduSphere AI Tutor"

        val adapter = ChatAdapter()
        binding.chatRv.layoutManager = LinearLayoutManager(context).apply {
            stackFromEnd = true
        }
        binding.chatRv.adapter = adapter

        viewModel.messages.observe(viewLifecycleOwner) { messages ->
            adapter.submitList(messages.toList())
            if (messages.isNotEmpty()) {
                binding.chatRv.scrollToPosition(messages.size - 1)
            }
        }

        viewModel.isTyping.observe(viewLifecycleOwner) { isTyping ->
            binding.typingIndicator.visibility = if (isTyping) View.VISIBLE else View.GONE
        }

        binding.sendBtn.setOnClickListener {
            val text = binding.messageEt.text.toString().trim()
            if (text.isNotEmpty()) {
                viewModel.sendMessage(text)
                binding.messageEt.setText("")
            }
        }

        binding.voiceBtn.setOnClickListener {
            // Speech recognition logic
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}