package com.example.edusphereapp

import android.os.Bundle
import android.os.CountDownTimer
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat

class QuizQuestionsActivity : AppCompatActivity() {

    private var currentIndex = 0
    private var score = 0
    private var selectedAnswer = -1
    private lateinit var questions: List<QuizQuestion>
    private var timer: CountDownTimer? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val themeMode = ThemeHelper.getTheme(this)
        ThemeHelper.applyTheme(this, themeMode)
        setContentView(R.layout.activity_quiz_questions)

        val topicName = intent.getStringExtra("TOPIC_NAME") ?: "Topic"
        questions = getQuestionsForTopic(topicName)

        findViewById<TextView>(R.id.quizTopicTitle).text = "📝 $topicName Quiz"
        findViewById<ImageButton>(R.id.quizBackBtn).setOnClickListener { finish() }

        showQuestion()
    }

    private fun showQuestion() {
        if (currentIndex >= questions.size) {
            showResult()
            return
        }

        timer?.cancel()

        val q = questions[currentIndex]
        val progressBar = findViewById<ProgressBar>(R.id.quizProgress)
        val questionNumTv = findViewById<TextView>(R.id.questionNumTv)
        val questionTv = findViewById<TextView>(R.id.questionTv)
        val optionA = findViewById<Button>(R.id.optionA)
        val optionB = findViewById<Button>(R.id.optionB)
        val optionC = findViewById<Button>(R.id.optionC)
        val optionD = findViewById<Button>(R.id.optionD)
        val nextBtn = findViewById<Button>(R.id.nextBtn)
        val timerTv = findViewById<TextView>(R.id.timerTv)
        val scoreTv = findViewById<TextView>(R.id.scoreTv)

        progressBar.max = questions.size
        progressBar.progress = currentIndex + 1
        questionNumTv.text = "Question ${currentIndex + 1} of ${questions.size}"
        questionTv.text = q.question
        scoreTv.text = "Score: $score"

        val options = listOf(optionA, optionB, optionC, optionD)
        options.forEachIndexed { i, btn ->
            btn.text = q.options[i]
            btn.backgroundTintList = ContextCompat.getColorStateList(this, R.color.md_theme_dark_surfaceVariant)
            btn.isEnabled = true
            btn.setOnClickListener {
                selectedAnswer = i
                options.forEachIndexed { j, b ->
                    b.backgroundTintList = if (j == i)
                        ContextCompat.getColorStateList(this, R.color.primary_purple)
                    else
                        ContextCompat.getColorStateList(this, R.color.md_theme_dark_surfaceVariant)
                }
            }
        }

        nextBtn.text = if (currentIndex == questions.size - 1) "Finish" else "Next →"
        nextBtn.setOnClickListener {
            if (selectedAnswer == -1) {
                Toast.makeText(this, "Please select an answer!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            timer?.cancel()
            checkAnswer(selectedAnswer, q.correctIndex)
        }

        selectedAnswer = -1

        // 30 second countdown timer
        timer = object : CountDownTimer(30000, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val secs = millisUntilFinished / 1000
                timerTv.text = "⏱ ${secs}s"
                timerTv.setTextColor(
                    if (secs <= 10)
                        android.graphics.Color.parseColor("#F44336")
                    else
                        android.graphics.Color.parseColor("#7C6AF7")
                )
            }
            override fun onFinish() {
                timerTv.text = "⏱ 0s"
                checkAnswer(selectedAnswer, q.correctIndex)
            }
        }.start()
    }

    private fun checkAnswer(selected: Int, correct: Int) {
        val optionA = findViewById<Button>(R.id.optionA)
        val optionB = findViewById<Button>(R.id.optionB)
        val optionC = findViewById<Button>(R.id.optionC)
        val optionD = findViewById<Button>(R.id.optionD)
        val options = listOf(optionA, optionB, optionC, optionD)

        options.forEach { it.isEnabled = false }

        // Show correct in green
        options[correct].backgroundTintList =
            ContextCompat.getColorStateList(this, android.R.color.holo_green_dark)

        // Show wrong in red
        if (selected != -1 && selected != correct) {
            options[selected].backgroundTintList =
                ContextCompat.getColorStateList(this, android.R.color.holo_red_dark)
        }

        if (selected == correct) score++

        currentIndex++

        // Move to next after 1.2 second delay
        findViewById<Button>(R.id.nextBtn).postDelayed({
            showQuestion()
        }, 1200)
    }

    private fun showResult() {
        setContentView(R.layout.activity_quiz_result)

        val percentage = (score * 100) / questions.size
        val emoji = when {
            percentage >= 90 -> "🏆"
            percentage >= 70 -> "⭐"
            percentage >= 50 -> "👍"
            else -> "📚"
        }
        val message = when {
            percentage >= 90 -> "Excellent! You mastered this topic!"
            percentage >= 70 -> "Great job! Keep it up!"
            percentage >= 50 -> "Good effort! Review and try again!"
            else -> "Keep studying! You'll get better!"
        }

        findViewById<TextView>(R.id.resultEmoji).text = emoji
        findViewById<TextView>(R.id.resultScore).text = "$score / ${questions.size}"
        findViewById<TextView>(R.id.resultPercent).text = "$percentage%"
        findViewById<TextView>(R.id.resultMessage).text = message
        findViewById<ProgressBar>(R.id.resultProgress).apply {
            max = 100
            progress = percentage
        }
        
        findViewById<Button>(R.id.homeBtn).setOnClickListener {
            finish()
        }
        
        findViewById<Button>(R.id.reviewBtn).setOnClickListener {
            // review logic
            finish()
        }
    }

    override fun onDestroy() {
        timer?.cancel()
        super.onDestroy()
    }

    private fun getQuestionsForTopic(topic: String): List<QuizQuestion> {
        val t = topic.trim()
        return when {
            t == "Wave-Particle Duality" -> listOf(
                QuizQuestion("What does wave-particle duality state?", listOf("Light is only a wave", "Matter has both wave and particle properties", "Matter is only a wave", "Particles can only be waves"), 1),
                QuizQuestion("Who proposed the matter wave theory?", listOf("Einstein", "Newton", "Louis de Broglie", "Niels Bohr"), 2),
                QuizQuestion("Which experiment demonstrated light's wave nature?", listOf("Photoelectric effect", "Double-slit experiment", "Rutherford scattering", "Oil drop experiment"), 1),
                QuizQuestion("A photon is a discrete packet of?", listOf("Electricity", "Magnetic field", "Electromagnetic energy", "Atomic mass"), 2),
                QuizQuestion("The de Broglie wavelength is inversely proportional to?", listOf("Heat", "Color", "Momentum", "Atomic number"), 2)
            )
            t == "Schrödinger's Equation" -> listOf(
                QuizQuestion("What does Schrödinger's Equation describe?", listOf("Planetary motion", "The evolution of a wave function", "Thermodynamics", "Chemical equilibrium"), 1),
                QuizQuestion("The Greek letter ψ (psi) in the equation represents?", listOf("Energy level", "The wave function", "Probability density", "Particle position"), 1),
                QuizQuestion("Which concept is illustrated by Schrödinger's cat?", listOf("Genetic mutation", "Quantum superposition", "Natural selection", "Classical physics"), 1),
                QuizQuestion("The equation is a fundamental result in?", listOf("General Relativity", "Quantum Mechanics", "Electromagnetism", "Optics"), 1),
                QuizQuestion("In the equation, H represents the?", listOf("Heisenberg constant", "Hamiltonian operator", "Heat capacity", "Hubble constant"), 1)
            )
            t == "Quantum Entanglement" -> listOf(
                QuizQuestion("What characterizes Quantum Entanglement?", listOf("High speed particles", "Linked states regardless of distance", "Atomic fusion", "Strong nuclear force"), 1),
                QuizQuestion("Einstein famously referred to entanglement as?", listOf("Spooky action at a distance", "God playing dice", "Unified field theory", "Relative connection"), 0),
                QuizQuestion("Can entangled states be used for instantaneous communication?", listOf("Yes, always", "No, it violates relativity", "Only for short distances", "Only in space"), 1),
                QuizQuestion("Which theorem provides a way to test entanglement?", listOf("Pythagorean theorem", "Bell's Theorem", "Incompleteness theorem", "Central Limit theorem"), 1),
                QuizQuestion("Entanglement is a key resource for?", listOf("Steam engines", "Quantum computing", "Radio broadcasting", "Internal combustion"), 1)
            )
            t == "Black Holes" -> listOf(
                QuizQuestion("A black hole is formed when?", listOf("A planet explodes", "A massive star collapses", "Two galaxies collide", "Light is trapped in a mirror"), 1),
                QuizQuestion("What is the 'point of no return' called?", listOf("Singularity", "The Core", "Event Horizon", "Outer Rim"), 2),
                QuizQuestion("What is hypothesized to be at the center of a black hole?", listOf("A new sun", "A singularity", "Empty space", "A neutron star"), 1),
                QuizQuestion("Who theorized that black holes emit radiation?", listOf("Albert Einstein", "Stephen Hawking", "Isaac Newton", "Edwin Hubble"), 1),
                QuizQuestion("Supermassive black holes are typically found?", listOf("In asteroid belts", "Near the sun", "At the centers of galaxies", "In dark nebulae"), 2)
            )
            t == "Skeletal System" -> listOf(
                QuizQuestion("How many bones does an average adult human have?", listOf("186", "206", "226", "256"), 1),
                QuizQuestion("What is the hardest substance in the human body?", listOf("Bone", "Tooth enamel", "Cartilage", "Muscle tissue"), 1),
                QuizQuestion("Which bone is the longest in the human body?", listOf("Tibia", "Humerus", "Femur", "Fibula"), 2),
                QuizQuestion("Where is the smallest bone in the human body located?", listOf("Hand", "Foot", "Middle ear", "Nose"), 2),
                QuizQuestion("What is the primary mineral stored in bones?", listOf("Iron", "Calcium", "Potassium", "Zinc"), 1)
            )
            t == "Artificial Intelligence" -> listOf(
                QuizQuestion("What does the 'A' in AI stand for?", listOf("Automated", "Artificial", "Advanced", "Applied"), 1),
                QuizQuestion("Which test is used to determine a machine's ability to exhibit intelligent behavior?", listOf("Voight-Kampff test", "Turing Test", "IQ Test", "Rorschach test"), 1),
                QuizQuestion("Machine Learning is a subset of?", listOf("Data entry", "Web development", "Artificial Intelligence", "Graphic design"), 2),
                QuizQuestion("A 'Neural Network' is inspired by?", listOf("The human brain", "Computer hardware", "Social networks", "Electric grids"), 0),
                QuizQuestion("Which programming language is most commonly used for AI?", listOf("C++", "Java", "Python", "JavaScript"), 2)
            )
            t == "Computer Science" -> listOf(
                QuizQuestion("What is considered the 'brain' of a computer?", listOf("RAM", "Hard Drive", "CPU", "Motherboard"), 2),
                QuizQuestion("Which of these is a non-volatile storage device?", listOf("RAM", "Cache", "SSD", "Registers"), 2),
                QuizQuestion("What does HTTP stand for?", listOf("High Text Transfer Protocol", "HyperText Transfer Protocol", "Hyper Transfer Text Process", "Home Tool Text Protocol"), 1),
                QuizQuestion("In programming, a 'loop' is used to?", listOf("Save data", "Repeat instructions", "Connect to the internet", "Delete files"), 1),
                QuizQuestion("1 Gigabyte (GB) is approximately equal to?", listOf("1000 Megabytes", "1024 Megabytes", "100 Megabytes", "1024 Kilobytes"), 1)
            )
            t == "Ancient Egypt" -> listOf(
                QuizQuestion("Who was the last active ruler of the Ptolemaic Kingdom of Egypt?", listOf("Nefertiti", "Hatshepsut", "Cleopatra VII", "Arsinoe IV"), 2),
                QuizQuestion("The Great Pyramid of Giza was built for which Pharaoh?", listOf("Khufu", "Khafre", "Menkaure", "Djoser"), 0),
                QuizQuestion("Ancient Egyptians used which plant to make paper?", listOf("Lotus", "Papyrus", "Flax", "Palm"), 1),
                QuizQuestion("What was the system of writing in Ancient Egypt called?", listOf("Cuneiform", "Alphabet", "Hieroglyphics", "Sanskrit"), 2),
                QuizQuestion("Which river was the lifeblood of Ancient Egypt?", listOf("Tigris", "Euphrates", "Nile", "Indus"), 2)
            )
            t.contains("Calculus", ignoreCase = true) -> listOf(
                QuizQuestion("Who is credited with the independent invention of calculus?", listOf("Newton and Leibniz", "Einstein and Bohr", "Gauss and Euler", "Pascal and Fermat"), 0),
                QuizQuestion("The 'Derivative' of a function measures its?", listOf("Area under curve", "Instantaneous rate of change", "Total volume", "Maximum value"), 1),
                QuizQuestion("Integration is primarily used to find?", listOf("Slope", "Intercept", "Area", "Roots"), 2),
                QuizQuestion("The Fundamental Theorem of Calculus links?", listOf("Algebra and Geometry", "Differentiation and Integration", "Sine and Cosine", "Mass and Energy"), 1),
                QuizQuestion("A limit that evaluates to 0/0 is called?", listOf("Undefined", "Indeterminate form", "Infinite", "Complex"), 1)
            )
            else -> listOf(
                QuizQuestion("What is the primary focus of studying '$topic'?", listOf("Learning the history", "Understanding core concepts and theories", "Mastering the art style", "Memorizing dates"), 1),
                QuizQuestion("In the context of '$topic', what are the most important principles?", listOf("The ones that are easiest to remember", "The fundamental laws and rules", "The most modern ones only", "The ones from the textbook only"), 1),
                QuizQuestion("Mastering '$topic' usually involves?", listOf("Just watching videos", "Consistent study and practical application", "A bit of luck", "Only reading the summary"), 1),
                QuizQuestion("Why is '$topic' considered a valuable subject?", listOf("It is very simple", "It provides critical insights into the field", "It is only a hobby", "It has no real-world use"), 1),
                QuizQuestion("How does '$topic' relate to our daily lives?", listOf("It has no relation", "It influences technology, society, or nature", "It is only for scientists", "It is a fictional concept"), 1)
            )
        }
    }
}
