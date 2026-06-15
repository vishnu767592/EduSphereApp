require('dotenv').config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'llama-3.3-70b-versatile';

// Helper to make API call to Groq
const callGroqAPI = async (messages, maxTokens = 1000, temperature = 0.7) => {
  const apiKey = process.env.GROQ_API_KEY || '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';

  if (!apiKey || apiKey.startsWith('your_')) {
    throw new Error('API_KEY_MISSING');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: messages,
      max_tokens: maxTokens,
      temperature: temperature
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Groq API Error response:', errText);
    throw new Error(`GROQ_API_FAILED: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  }
  throw new Error('GROQ_INVALID_RESPONSE');
};

// 1. AI Chat Tutor endpoint
exports.chat = async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'User message is required' });
  }

  const messages = [
    {
      role: 'system',
      content: 'You are EduSphere AI Tutor, a helpful and friendly educational assistant. Help students understand topics clearly, simply and in an engaging way. Keep answers concise and easy to understand.'
    }
  ];

  // Add conversation history
  if (history && Array.isArray(history)) {
    history.forEach(msg => {
      messages.push({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      });
    });
  }

  // Add current message
  messages.push({ role: 'user', content: message });

  try {
    const aiResponse = await callGroqAPI(messages, 800, 0.7);
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('AI Chat error:', error.message);
    // Fallback response for chat
    const fallbackAnswers = [
      "I'm here to help you learn! That's a great question. Let's research it together.",
      "Could you please elaborate on that topic? As your AI Tutor, I'd love to break it down for you.",
      "That is a fundamental concept in this subject. Let's study its core components and practices.",
      "As your virtual tutor, I encourage you to check out the 'Learning' module to explore structured lessons on this!"
    ];
    const randomFallback = fallbackAnswers[Math.floor(Math.random() * fallbackAnswers.length)];
    res.status(200).json({
      response: `${randomFallback} (Note: Running in offline/fallback mode. ${error.message === 'API_KEY_MISSING' ? 'Set GROQ_API_KEY in .env for live AI tutoring.' : 'Check API connection.'})`
    });
  }
};

// 2. Generate lesson content
exports.getLessonContent = async (req, res) => {
  const { topic, difficulty } = req.body;

  if (!topic) {
    return res.status(400).json({ message: 'Topic is required' });
  }

  const diffStr = difficulty || 'Beginner';

  const messages = [
    {
      role: 'system',
      content: 'You are EduSphere AI Tutor. Explain topics clearly for students.'
    },
    {
      role: 'user',
      content: `Explain '${topic}' at ${diffStr} level in a clear, engaging way. Structure your response with:
1. What is it? (2-3 sentences)
2. Key Concepts (3-4 bullet points)
3. Real World Example (1-2 sentences)
4. Fun Fact (1 sentence)
Keep it educational and easy to understand.`
    }
  ];

  try {
    const content = await callGroqAPI(messages, 800, 0.6);
    res.status(200).json({ content });
  } catch (error) {
    console.warn('AI Lesson explanation failed, using offline fallback:', error.message);
    const offlineContent = `
# ${topic}

📖 **What is it?**
${topic} is an important concept at ${diffStr} level. It forms a fundamental block of understanding within this subject and has wide applications in academic study and real-world technology.

🔑 **Key Concepts:**
- Core principles and definitions that outline ${topic}.
- How this topic connects to surrounding elements in this course.
- Critical variables or formulas used to calculate or describe ${topic} behavior.
- Real-world challenges solved by understanding ${topic}.

🌍 **Real World Example:**
You can observe ${topic} in daily life, such as in natural events, home appliances, or digital systems we interface with.

💡 **Fun Fact:**
Scientists continue to develop groundbreaking innovations utilizing the principles of ${topic} today!

*(Running in offline fallback mode)*
`;
    res.status(200).json({ content: offlineContent });
  }
};

// 3. Generate study notes
exports.getNotes = async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ message: 'Topic is required' });
  }

  const messages = [
    {
      role: 'system',
      content: 'You are EduSphere AI. Generate structured study notes.'
    },
    {
      role: 'user',
      content: `Generate complete study notes for '${topic}' with these exact sections:
DEFINITION:
(Write a clear 2-3 sentence definition)

KEY FORMULAS OR FACTS:
(List 3-4 important formulas or facts with bullet points)

KEY POINTS:
(List 5-6 important bullet points to remember)

SUMMARY:
(Write a 3-4 sentence summary)

EXAM TIPS:
(List 3 important exam tips)`
    }
  ];

  try {
    const notes = await callGroqAPI(messages, 1000, 0.5);
    res.status(200).json({ notes });
  } catch (error) {
    console.warn('AI Notes generation failed, using offline fallback:', error.message);
    const offlineNotes = `
DEFINITION:
${topic} is a key topic of interest that serves as a cornerstone of study in this course. It is critical for answering exam questions and building general subject proficiency.

KEY FORMULAS OR FACTS:
- Fact 1: ${topic} is extensively researched in modern science.
- Fact 2: It directly influences core subject theories.
- Fact 3: It has specialized properties that differentiate it from other concepts.

KEY POINTS:
- Always review the basic components before diving into advanced formulas.
- Understand the historical experiments that proved this concept.
- Note how it interacts with other subject matters in your syllabus.
- Remember its practical applications in modern industry.
- Key figures in research have spent decades perfecting this framework.

SUMMARY:
In summary, studying ${topic} is highly beneficial. By breaking down its core components, analyzing real-world applications, and reviewing key facts, you can easily grasp the concept and perform well on examinations.

EXAM TIPS:
- Tip 1: Be prepared to define ${topic} in your own words.
- Tip 2: Memorize at least two real-world examples.
- Tip 3: Draw a simple diagram or flow chart if applicable during the test.
`;
    res.status(200).json({ notes: offlineNotes });
  }
};

// 4. Generate custom study planner
exports.getStudyPlan = async (req, res) => {
  const { subject, weeklyHours, durationWeeks } = req.body;

  if (!subject || !weeklyHours) {
    return res.status(400).json({ message: 'Subject and weekly hours are required' });
  }

  const weeks = durationWeeks || 4;

  const messages = [
    {
      role: 'system',
      content: 'You are EduSphere AI Planner. You create optimized weekly study schedules.'
    },
    {
      role: 'user',
      content: `Create a custom ${weeks}-week study plan for studying '${subject}' committing ${weeklyHours} hours per week.
Provide a clear week-by-week breakdown.
Include:
- Specific topics to cover each week
- Practice goals
- Review tasks
Keep it highly organized and encouraging.`
    }
  ];

  try {
    const plan = await callGroqAPI(messages, 1200, 0.6);
    res.status(200).json({ plan });
  } catch (error) {
    console.warn('AI Planner failed, using offline fallback:', error.message);
    // Simple custom generated fallback based on week count
    let fallbackPlan = `### Custom Study Planner: ${subject}
**Schedule:** ${weeklyHours} Hours/Week | **Duration:** ${weeks} Weeks

`;
    for (let w = 1; w <= weeks; w++) {
      fallbackPlan += `#### Week ${w}: Foundations & Exploration
- **Focus:** Explore core concepts of ${subject} (Approx. ${Math.round(weeklyHours * 0.6)} hours).
- **Practice:** Try solving 5-10 beginner problems.
- **Review:** Summarize your learning in bullet points at the end of the week.

`;
    }
    fallbackPlan += `*Note: Running in offline fallback mode.*`;
    res.status(200).json({ plan: fallbackPlan });
  }
};
