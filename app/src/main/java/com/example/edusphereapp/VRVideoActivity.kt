package com.example.edusphereapp

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView

class VRVideoActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val themeMode = ThemeHelper.getTheme(this)
        ThemeHelper.applyTheme(this, themeMode)
        setContentView(R.layout.activity_vr_video)

        val topicName = intent.getStringExtra("TOPIC_NAME") ?: "Topic"
        findViewById<TextView>(R.id.vrTopicTitle).text = "🎬 $topicName — Watch Videos"
        findViewById<ImageButton>(R.id.vrBackBtn).setOnClickListener { finish() }

        val videos = getVideosForTopic(topicName)

        setupCard(R.id.videoCard1, R.id.videoTitle1, R.id.videoDesc1, videos[0])
        setupCard(R.id.videoCard2, R.id.videoTitle2, R.id.videoDesc2, videos[1])
        setupCard(R.id.videoCard3, R.id.videoTitle3, R.id.videoDesc3, videos[2])
        setupCard(R.id.videoCard4, R.id.videoTitle4, R.id.videoDesc4, videos[3])
    }

    private fun setupCard(cardId: Int, titleId: Int, descId: Int, video: VideoItem) {
        findViewById<TextView>(titleId).text = video.title
        findViewById<TextView>(descId).text = video.description
        findViewById<CardView>(cardId).setOnClickListener {
            openYouTube(video.url)
        }
    }

    private fun openYouTube(url: String) {
        try {
            // Try YouTube app first
            val appIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
            appIntent.setPackage("com.google.android.youtube")
            startActivity(appIntent)
        } catch (e: Exception) {
            try {
                // Fall back to browser
                val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                startActivity(webIntent)
            } catch (ex: Exception) {
                Toast.makeText(this, "Please install YouTube app", Toast.LENGTH_LONG).show()
            }
        }
    }

    data class VideoItem(val title: String, val description: String, val url: String)

    private fun getVideosForTopic(topic: String): List<VideoItem> {
        return when (topic) {
            "Wave-Particle Duality" -> listOf(
                VideoItem("⭐ Wave-Particle Duality Explained", "Best beginner explanation", "https://www.youtube.com/watch?v=Iuv6hY6zsd0"),
                VideoItem("Double Slit Experiment", "The most famous quantum experiment", "https://www.youtube.com/watch?v=Q1YqgPAtzho"),
                VideoItem("Quantum Physics for Beginners", "Simple visual explanation", "https://www.youtube.com/watch?v=p7bzE1E5PMY"),
                VideoItem("Wave Nature of Light", "Light behaves as a wave", "https://www.youtube.com/watch?v=H6QHkBblSuY")
            )
            "Schrödinger's Equation" -> listOf(
                VideoItem("⭐ Schrödinger Equation Explained", "Clear step by step", "https://www.youtube.com/watch?v=QeUMFo8sODk"),
                VideoItem("Schrödinger's Cat", "Famous thought experiment", "https://www.youtube.com/watch?v=IOYyCHGWJq4"),
                VideoItem("Quantum Wave Function", "What the wave function means", "https://www.youtube.com/watch?v=p7bzE1E5PMY"),
                VideoItem("Quantum Mechanics Full Course", "Complete beginner course", "https://www.youtube.com/watch?v=8mi0PoPvLvs")
            )
            "Quantum Entanglement" -> listOf(
                VideoItem("⭐ Quantum Entanglement Explained", "Clear and simple", "https://www.youtube.com/watch?v=JFozGfxmi8A"),
                VideoItem("Einstein's Spooky Action", "Entanglement and Einstein", "https://www.youtube.com/watch?v=ZuvK-od647c"),
                VideoItem("Entanglement in 5 Minutes", "Quick overview", "https://www.youtube.com/watch?v=5_0o2fJhtSc"),
                VideoItem("Quantum Teleportation", "How quantum teleportation works", "https://www.youtube.com/watch?v=DxQK1WDYI_k")
            )
            "Heisenberg Uncertainty Principle" -> listOf(
                VideoItem("⭐ Uncertainty Principle Explained", "Heisenberg made simple", "https://www.youtube.com/watch?v=TQKELOE9eY4"),
                VideoItem("Why Quantum Mechanics is Weird", "Uncertainty explained", "https://www.youtube.com/watch?v=Usu9xZfabPM"),
                VideoItem("Position vs Momentum", "The core trade-off", "https://www.youtube.com/watch?v=a8FTr2qMutA"),
                VideoItem("Quantum Mechanics Overview", "Full quantum intro", "https://www.youtube.com/watch?v=8mi0PoPvLvs")
            )
            "Quantum Tunneling" -> listOf(
                VideoItem("⭐ Quantum Tunneling Explained", "How particles pass through walls", "https://www.youtube.com/watch?v=WItItIB5CjA"),
                VideoItem("Tunneling in Electronics", "Real world applications", "https://www.youtube.com/watch?v=cTodS8hkSDg"),
                VideoItem("Nuclear Fusion and Tunneling", "Tunneling in stars", "https://www.youtube.com/watch?v=Usu9xZfabPM"),
                VideoItem("Quantum Physics Documentary", "Full documentary", "https://www.youtube.com/watch?v=CBrsWPCp_rs")
            )
            "Superposition" -> listOf(
                VideoItem("⭐ Quantum Superposition Explained", "Being in two states at once", "https://www.youtube.com/watch?v=RlXdsyctD50"),
                VideoItem("Superposition and Measurement", "What happens when we look", "https://www.youtube.com/watch?v=p7bzE1E5PMY"),
                VideoItem("Schrödinger's Cat", "Famous superposition example", "https://www.youtube.com/watch?v=IOYyCHGWJq4"),
                VideoItem("Quantum Computing Basics", "Superposition in computers", "https://www.youtube.com/watch?v=jHoEjvuPoB8")
            )
            "Black Holes" -> listOf(
                VideoItem("⭐ Black Holes Explained", "Best black hole video", "https://www.youtube.com/watch?v=e-P5IFTqB98"),
                VideoItem("Inside a Black Hole", "What really happens inside", "https://www.youtube.com/watch?v=yWO-cvGETRQ"),
                VideoItem("Black Hole Size Comparison", "Visual size comparison", "https://www.youtube.com/watch?v=Iy7NzjCmUf0"),
                VideoItem("Hawking Radiation Explained", "Stephen Hawking's theory", "https://www.youtube.com/watch?v=qPKj0YnKANw")
            )
            "The Big Bang" -> listOf(
                VideoItem("⭐ Big Bang Theory Explained", "Origin of the universe", "https://www.youtube.com/watch?v=wNDGgL73ihY"),
                VideoItem("Universe Timeline", "From Big Bang to now", "https://www.youtube.com/watch?v=HdPzOWlLrbE"),
                VideoItem("What Came Before Big Bang", "Mind-blowing concepts", "https://www.youtube.com/watch?v=YBfNBxPRZFc"),
                VideoItem("Cosmic Microwave Background", "Evidence for Big Bang", "https://www.youtube.com/watch?v=3tCMd1ytvWg")
            )
            "Galaxies", "Astrophysics", "Stellar Evolution", "Exoplanets" -> listOf(
                VideoItem("⭐ Galaxy Formation Explained", "How galaxies are born", "https://www.youtube.com/watch?v=96tNR8XNfBs"),
                VideoItem("Milky Way Galaxy Tour", "Our home galaxy explored", "https://www.youtube.com/watch?v=PDNdSaBe3dI"),
                VideoItem("Life Cycle of a Star", "From birth to death", "https://www.youtube.com/watch?v=PM9CQDlQI0A"),
                VideoItem("How Big is the Universe", "Universe scale explained", "https://www.youtube.com/watch?v=i93Z7zljQ7I")
            )
            "Skeletal System" -> listOf(
                VideoItem("⭐ Human Skeletal System", "Complete overview", "https://www.youtube.com/watch?v=s3uNDMFmkm0"),
                VideoItem("Bones of the Body", "All major bones explained", "https://www.youtube.com/watch?v=NbgkBP8Plso"),
                VideoItem("How Bones Grow", "Bone development process", "https://www.youtube.com/watch?v=dC80IXQZPGU"),
                VideoItem("Joints and Movement", "How joints work", "https://www.youtube.com/watch?v=2TKKbP_YXSQ")
            )
            "Muscular System" -> listOf(
                VideoItem("⭐ Muscular System Explained", "Complete muscle overview", "https://www.youtube.com/watch?v=VVL-8zr2hk4"),
                VideoItem("How Muscles Contract", "Muscle contraction mechanism", "https://www.youtube.com/watch?v=GrHsiHazpsw"),
                VideoItem("Types of Muscles", "Cardiac skeletal and smooth", "https://www.youtube.com/watch?v=B4gA9fABlHI"),
                VideoItem("Muscle Growth Science", "How muscles grow stronger", "https://www.youtube.com/watch?v=2tM1LFFxeKg")
            )
            "Nervous System" -> listOf(
                VideoItem("⭐ Nervous System Overview", "Complete guide", "https://www.youtube.com/watch?v=44B0ms3XPKU"),
                VideoItem("How Neurons Work", "Brain cell communication", "https://www.youtube.com/watch?v=WhowH0kb7n0"),
                VideoItem("Brain Structure Explained", "Parts of the brain", "https://www.youtube.com/watch?v=tLAEzGbLwmA"),
                VideoItem("Reflex Actions", "How reflexes work", "https://www.youtube.com/watch?v=rnhEoB8CqHw")
            )
            "Cardiovascular System" -> listOf(
                VideoItem("⭐ How the Heart Works", "Best heart explanation", "https://www.youtube.com/watch?v=CWFyxn0qDEU"),
                VideoItem("Blood Circulation", "Full circulation explained", "https://www.youtube.com/watch?v=P7pBMNRm6TU"),
                VideoItem("Heart Anatomy 3D", "Inside the human heart", "https://www.youtube.com/watch?v=4DPXH9BJ6bg"),
                VideoItem("Blood Vessels", "Arteries veins capillaries", "https://www.youtube.com/watch?v=yN_YMZhMBCg")
            )
            "Digestive System" -> listOf(
                VideoItem("⭐ Digestive System Explained", "How food is processed", "https://www.youtube.com/watch?v=Og5xAdC8EUI"),
                VideoItem("Journey of Food", "From mouth to intestine", "https://www.youtube.com/watch?v=1sISguPDlhY"),
                VideoItem("Stomach and Digestion", "How stomach works", "https://www.youtube.com/watch?v=3_BHPK4c3gU"),
                VideoItem("Gut Microbiome", "Bacteria in your gut", "https://www.youtube.com/watch?v=VzPD009qTN4")
            )
            "Brain Structure" -> listOf(
                VideoItem("⭐ Human Brain Explained", "Complete brain guide", "https://www.youtube.com/watch?v=tLAEzGbLwmA"),
                VideoItem("How Memory Works", "Memory formation in brain", "https://www.youtube.com/watch?v=bSaD-jQaXgs"),
                VideoItem("Left vs Right Brain", "Brain hemisphere explained", "https://www.youtube.com/watch?v=ZMSbDwpIyF4"),
                VideoItem("Neuroscience Basics", "Brain science for beginners", "https://www.youtube.com/watch?v=qPKj0YnKANw")
            )
            "Hydrocarbons", "Organic Chemistry", "Functional Groups" -> listOf(
                VideoItem("⭐ Organic Chemistry Basics", "Beginner introduction", "https://www.youtube.com/watch?v=bSMx0NS0XfY"),
                VideoItem("Hydrocarbons Explained", "Alkanes alkenes alkynes", "https://www.youtube.com/watch?v=8opBmEOlbfs"),
                VideoItem("Functional Groups", "Key functional groups", "https://www.youtube.com/watch?v=VFqPZcZNb5s"),
                VideoItem("Reaction Mechanisms", "How organic reactions work", "https://www.youtube.com/watch?v=3DIYjJFl4r0")
            )
            "Reaction Mechanisms", "Stereochemistry", "Isomerism" -> listOf(
                VideoItem("⭐ Organic Reaction Mechanisms", "Step by step guide", "https://www.youtube.com/watch?v=3DIYjJFl4r0"),
                VideoItem("SN1 vs SN2 Reactions", "Substitution reactions", "https://www.youtube.com/watch?v=JnAc9m4hA6E"),
                VideoItem("Stereochemistry Explained", "3D structure of molecules", "https://www.youtube.com/watch?v=VFqPZcZNb5s"),
                VideoItem("Isomerism Explained", "Structural and stereo isomers", "https://www.youtube.com/watch?v=8opBmEOlbfs")
            )
            "Mesopotamia", "Ancient History", "Ancient Greece", "Ancient China" -> listOf(
                VideoItem("⭐ Ancient Mesopotamia", "Cradle of civilization", "https://www.youtube.com/watch?v=sohXPx_XZ6Y"),
                VideoItem("Ancient Egypt Full History", "Pharaohs and pyramids", "https://www.youtube.com/watch?v=hO68A9fern4"),
                VideoItem("Ancient Greece Explained", "Democracy and philosophy", "https://www.youtube.com/watch?v=gFRxmi5NQa4"),
                VideoItem("Roman Empire History", "Rise and fall of Rome", "https://www.youtube.com/watch?v=PoKMMSO7BEQ")
            )
            "Roman Empire" -> listOf(
                VideoItem("⭐ Roman Empire Full History", "Rise and fall of Rome", "https://www.youtube.com/watch?v=PoKMMSO7BEQ"),
                VideoItem("Julius Caesar Story", "Greatest Roman leader", "https://www.youtube.com/watch?v=wVHNkBVFJvk"),
                VideoItem("Roman Engineering", "How Romans built everything", "https://www.youtube.com/watch?v=bG_7RiB1A2E"),
                VideoItem("Fall of Roman Empire", "Why Rome collapsed", "https://www.youtube.com/watch?v=VzPD009qTN4")
            )
            "Ancient Egypt" -> listOf(
                VideoItem("⭐ Ancient Egypt Explained", "Full history overview", "https://www.youtube.com/watch?v=hO68A9fern4"),
                VideoItem("How Pyramids Were Built", "The mystery solved", "https://www.youtube.com/watch?v=ORfvHtYEGfA"),
                VideoItem("Egyptian Gods Explained", "Major gods and myths", "https://www.youtube.com/watch?v=bMB6I8OkIlk"),
                VideoItem("Cleopatra Full Story", "Life of the last pharaoh", "https://www.youtube.com/watch?v=sAbSHXBRkUk")
            )
            "Vectors and 3D Space", "Calculus III", "Partial Derivatives",
            "Multiple Integrals", "Vector Fields" -> listOf(
                VideoItem("⭐ Calculus 3 Full Course", "Professor Leonard complete course", "https://www.youtube.com/watch?v=tGVnBAHLApA"),
                VideoItem("Vectors Explained Simply", "3D vectors made easy", "https://www.youtube.com/watch?v=ml4NSzCQobk"),
                VideoItem("Partial Derivatives", "Multi-variable calculus", "https://www.youtube.com/watch?v=AXqhWeUEtQU"),
                VideoItem("Multiple Integrals", "Double and triple integrals", "https://www.youtube.com/watch?v=85zGYB-34jQ")
            )
            "Green's Theorem", "Stokes' Theorem", "Divergence Theorem" -> listOf(
                VideoItem("⭐ Green's Theorem Explained", "Line integrals made easy", "https://www.youtube.com/watch?v=a_zdFvYXX_c"),
                VideoItem("Stokes' Theorem Explained", "Surface integrals", "https://www.youtube.com/watch?v=9iaYNaENVH4"),
                VideoItem("Divergence Theorem", "Gauss theorem explained", "https://www.youtube.com/watch?v=9iaYNaENVH4"),
                VideoItem("Calculus 3 Full Course", "Professor Leonard", "https://www.youtube.com/watch?v=tGVnBAHLApA")
            )
            "Ocean Ecosystems", "Marine Biology", "Coral Reefs",
            "Marine Mammals", "Deep Sea Life" -> listOf(
                VideoItem("⭐ Ocean Ecosystems Explained", "Marine life and food chains", "https://www.youtube.com/watch?v=MXaAR0fUkCY"),
                VideoItem("Deep Sea Creatures", "Life in the deep ocean", "https://www.youtube.com/watch?v=8Ib3QyfkDRg"),
                VideoItem("Coral Reef Documentary", "Beautiful reef ecosystem", "https://www.youtube.com/watch?v=oZRmEhHMPFc"),
                VideoItem("Ocean Food Chain", "Marine food web explained", "https://www.youtube.com/watch?v=XHyGhgbQ1LA")
            )
            "Introduction to AI", "Artificial Intelligence",
            "Machine Learning Basics", "AI Ethics" -> listOf(
                VideoItem("⭐ What is Artificial Intelligence", "Best AI introduction", "https://www.youtube.com/watch?v=mJeNghZXtMo"),
                VideoItem("Machine Learning in 5 Minutes", "ML explained simply", "https://www.youtube.com/watch?v=ukzFI9rgwfU"),
                VideoItem("Neural Networks Explained", "How AI thinks and learns", "https://www.youtube.com/watch?v=aircAruvnKk"),
                VideoItem("Future of AI", "Where AI is heading", "https://www.youtube.com/watch?v=5p248yoa3oE")
            )
            "Neural Networks", "Deep Learning", "Computer Vision",
            "Reinforcement Learning" -> listOf(
                VideoItem("⭐ Neural Networks by 3Blue1Brown", "Best neural network video", "https://www.youtube.com/watch?v=aircAruvnKk"),
                VideoItem("Deep Learning Explained", "How deep learning works", "https://www.youtube.com/watch?v=6M5VXKLf4D4"),
                VideoItem("Computer Vision Explained", "How machines see", "https://www.youtube.com/watch?v=YRhxdVk_sIs"),
                VideoItem("Reinforcement Learning", "How AI learns by doing", "https://www.youtube.com/watch?v=JgvyzIkgxF0")
            )
            "Data Structures", "Algorithms", "Computer Science",
            "Object Oriented Programming" -> listOf(
                VideoItem("⭐ Data Structures Full Course", "freeCodeCamp complete guide", "https://www.youtube.com/watch?v=RBSGKlAvoiM"),
                VideoItem("Algorithms Explained", "Sorting and searching", "https://www.youtube.com/watch?v=kPRA0W1kECg"),
                VideoItem("Big O Notation", "Algorithm complexity explained", "https://www.youtube.com/watch?v=v4cd1O4zkGw"),
                VideoItem("CS50 Full Course", "Harvard CS course free", "https://www.youtube.com/watch?v=8mAITcNt710")
            )
            "Introduction to Psychology", "Psychology 101",
            "Memory", "Motivation and Emotion" -> listOf(
                VideoItem("⭐ Psychology Introduction", "What is psychology", "https://www.youtube.com/watch?v=vo4pMVb0R6M"),
                VideoItem("How the Brain Works", "Neuroscience basics", "https://www.youtube.com/watch?v=tLAEzGbLwmA"),
                VideoItem("Memory and Learning", "How we remember things", "https://www.youtube.com/watch?v=bSaD-jQaXgs"),
                VideoItem("Psychology of Behavior", "Why we do what we do", "https://www.youtube.com/watch?v=NNnIGh9g6fA")
            )
            "Cell Biology", "Immune System", "Genetics" -> listOf(
                VideoItem("⭐ Cell Structure Explained", "Parts of a cell", "https://www.youtube.com/watch?v=URUJD5NEXC8"),
                VideoItem("How Immune System Works", "Body defense explained", "https://www.youtube.com/watch?v=PSZgapWMY7M"),
                VideoItem("DNA and Genetics", "How genes work", "https://www.youtube.com/watch?v=zwibgNGe4aY"),
                VideoItem("Mitosis vs Meiosis", "Cell division explained", "https://www.youtube.com/watch?v=L0k-enzoeOM")
            )
            else -> listOf(
                VideoItem("⭐ Search: $topic Explained", "Tap to search YouTube",
                    "https://www.youtube.com/results?search_query=${topic.replace(" ", "+")}+explained"),
                VideoItem("$topic Full Lecture", "University lecture",
                    "https://www.youtube.com/results?search_query=${topic.replace(" ", "+")}+lecture"),
                VideoItem("$topic Animation", "Visual animated explanation",
                    "https://www.youtube.com/results?search_query=${topic.replace(" ", "+")}+animation"),
                VideoItem("$topic Tutorial", "Step by step tutorial",
                    "https://www.youtube.com/results?search_query=${topic.replace(" ", "+")}+tutorial")
            )
        }
    }
}