package com.example.edusphereapp

import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class TopicListActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val themeMode = ThemeHelper.getTheme(this)
        ThemeHelper.applyTheme(this, themeMode)
        setContentView(R.layout.activity_topic_list)

        val subjectName = intent.getStringExtra("SUBJECT_NAME") ?: "Subject"
        findViewById<TextView>(R.id.subjectTitleTv).text = subjectName
        findViewById<ImageButton>(R.id.backBtn).setOnClickListener { finish() }

        val topicRv = findViewById<RecyclerView>(R.id.topicRv)
        val topics = getTopicsForSubject(subjectName)
        topicRv.layoutManager = LinearLayoutManager(this)
        topicRv.adapter = TopicAdapter(topics) { topic ->
            val intent = android.content.Intent(this, TopicDetailActivity::class.java)
            intent.putExtra("TOPIC_NAME", topic.name)
            intent.putExtra("TOPIC_DIFFICULTY", topic.difficulty)
            startActivity(intent)
        }
    }

    private fun getTopicsForSubject(subject: String): List<Topic> {
        return when (subject) {
            "Quantum Physics" -> listOf(
                Topic("Wave-Particle Duality", "Beginner"),
                Topic("Schrödinger's Equation", "Intermediate"),
                Topic("Quantum Entanglement", "Advanced"),
                Topic("Heisenberg Uncertainty Principle", "Intermediate"),
                Topic("Quantum Tunneling", "Advanced"),
                Topic("Superposition", "Beginner"),
                Topic("Quantum Numbers", "Beginner"),
                Topic("Spin and Angular Momentum", "Intermediate"),
                Topic("Quantum Field Theory", "Advanced"),
                Topic("Photoelectric Effect", "Beginner"),
                Topic("Bohr Model", "Beginner"),
                Topic("Quantum Computing Basics", "Advanced"),
            )
            "Human Anatomy" -> listOf(
                Topic("Skeletal System", "Beginner"),
                Topic("Muscular System", "Beginner"),
                Topic("Nervous System", "Intermediate"),
                Topic("Cardiovascular System", "Intermediate"),
                Topic("Respiratory System", "Beginner"),
                Topic("Digestive System", "Beginner"),
                Topic("Endocrine System", "Intermediate"),
                Topic("Immune System", "Intermediate"),
                Topic("Reproductive System", "Intermediate"),
                Topic("Lymphatic System", "Advanced"),
                Topic("Integumentary System", "Beginner"),
                Topic("Urinary System", "Beginner"),
                Topic("Sensory Organs", "Intermediate"),
                Topic("Brain Structure", "Advanced"),
                Topic("Cell Biology", "Beginner")
            )
            "Organic Chemistry" -> listOf(
                Topic("Hydrocarbons", "Beginner"),
                Topic("Functional Groups", "Beginner"),
                Topic("Isomerism", "Intermediate"),
                Topic("Reaction Mechanisms", "Advanced"),
                Topic("Alcohols and Ethers", "Intermediate"),
                Topic("Aldehydes and Ketones", "Intermediate"),
                Topic("Carboxylic Acids", "Intermediate"),
                Topic("Amines", "Advanced"),
                Topic("Polymers", "Beginner"),
                Topic("Stereochemistry", "Advanced")
            )
            "Ancient History" -> listOf(
                Topic("Mesopotamia", "Beginner"),
                Topic("Ancient Egypt", "Beginner"),
                Topic("Ancient Greece", "Beginner"),
                Topic("Roman Empire", "Intermediate"),
                Topic("Ancient China", "Beginner"),
                Topic("Indus Valley Civilization", "Beginner"),
                Topic("Persian Empire", "Intermediate"),
                Topic("Ancient Americas", "Intermediate")
            )
            "Calculus III" -> listOf(
                Topic("Vectors and 3D Space", "Beginner"),
                Topic("Partial Derivatives", "Intermediate"),
                Topic("Multiple Integrals", "Intermediate"),
                Topic("Line Integrals", "Advanced"),
                Topic("Surface Integrals", "Advanced"),
                Topic("Green's Theorem", "Advanced"),
                Topic("Stokes' Theorem", "Advanced"),
                Topic("Divergence Theorem", "Advanced"),
                Topic("Taylor Series", "Advanced"),
                Topic("Gradient, Divergence, Curl", "Intermediate"),
                Topic("Lagrange Multipliers", "Advanced"),
                Topic("Parametric Surfaces", "Intermediate"),
                Topic("Coordinate Systems", "Beginner"),
                Topic("Vector Fields", "Intermediate")
            )
            "Astrophysics" -> listOf(
                Topic("The Big Bang", "Beginner"),
                Topic("Star Formation", "Beginner"),
                Topic("Black Holes", "Intermediate"),
                Topic("Dark Matter", "Advanced"),
                Topic("Dark Energy", "Advanced"),
                Topic("Galaxies", "Beginner"),
                Topic("Neutron Stars", "Intermediate"),
                Topic("Cosmic Microwave Background", "Advanced"),
                Topic("Gravitational Waves", "Advanced"),
                Topic("Stellar Evolution", "Intermediate"),
                Topic("Exoplanets", "Beginner")
            )
            "Marine Biology" -> listOf(
                Topic("Ocean Ecosystems", "Beginner"),
                Topic("Marine Mammals", "Beginner"),
                Topic("Coral Reefs", "Beginner"),
                Topic("Deep Sea Life", "Intermediate"),
                Topic("Marine Plants", "Beginner"),
                Topic("Ocean Chemistry", "Intermediate"),
                Topic("Fish Biology", "Beginner"),
                Topic("Marine Conservation", "Intermediate"),
                Topic("Oceanography", "Advanced")
            )
            "Psychology 101" -> listOf(
                Topic("Introduction to Psychology", "Beginner"),
                Topic("Biological Bases of Behavior", "Intermediate"),
                Topic("Sensation and Perception", "Beginner"),
                Topic("States of Consciousness", "Beginner"),
                Topic("Learning and Conditioning", "Intermediate"),
                Topic("Memory", "Intermediate"),
                Topic("Cognition and Language", "Intermediate"),
                Topic("Motivation and Emotion", "Beginner"),
                Topic("Developmental Psychology", "Intermediate"),
                Topic("Personality Theories", "Advanced")
            )
            "Computer Science" -> listOf(
                Topic("Data Structures", "Beginner"),
                Topic("Algorithms", "Intermediate"),
                Topic("Operating Systems", "Intermediate"),
                Topic("Computer Networks", "Intermediate"),
                Topic("Database Management", "Intermediate"),
                Topic("Software Engineering", "Beginner"),
                Topic("Object Oriented Programming", "Beginner"),
                Topic("Compiler Design", "Advanced"),
                Topic("Cybersecurity Basics", "Beginner"),
                Topic("Cloud Computing", "Intermediate"),
                Topic("Web Development", "Beginner"),
                Topic("Mobile Development", "Intermediate"),
                Topic("Version Control with Git", "Beginner"),
                Topic("Big Data", "Advanced"),
                Topic("Blockchain Basics", "Advanced"),
                Topic("API Development", "Intermediate"),
                Topic("Design Patterns", "Advanced"),
                Topic("Testing and QA", "Intermediate"),
                Topic("Agile Methodology", "Beginner"),
                Topic("DevOps Basics", "Intermediate")
            )
            "Artificial Intelligence" -> listOf(
                Topic("Introduction to AI", "Beginner"),
                Topic("Machine Learning Basics", "Beginner"),
                Topic("Neural Networks", "Intermediate"),
                Topic("Deep Learning", "Advanced"),
                Topic("Natural Language Processing", "Advanced"),
                Topic("Computer Vision", "Advanced"),
                Topic("Reinforcement Learning", "Advanced"),
                Topic("Decision Trees", "Intermediate"),
                Topic("Support Vector Machines", "Intermediate"),
                Topic("AI Ethics", "Beginner"),
                Topic("Generative AI", "Advanced"),
                Topic("AI in Healthcare", "Intermediate"),
                Topic("Robotics and AI", "Advanced"),
                Topic("Expert Systems", "Intermediate"),
                Topic("Future of AI", "Beginner"),
                Topic("AI Tools Overview", "Beginner"),
                Topic("Data Preprocessing", "Intermediate"),
                Topic("Model Evaluation", "Intermediate")
            )
            else -> listOf(
                Topic("Introduction", "Beginner"),
                Topic("Core Concepts", "Beginner"),
                Topic("Intermediate Topics", "Intermediate"),
                Topic("Advanced Topics", "Advanced"),
                Topic("Case Studies", "Intermediate"),
                Topic("Practice Problems", "Beginner"),
                Topic("Summary and Review", "Beginner")
            )
        }
    }
}