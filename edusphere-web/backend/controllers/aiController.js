require('dotenv').config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'llama-3.3-70b-versatile';

// Input sanitization helper — strips common prompt injection patterns
const sanitizePromptInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    // Remove attempts to override system prompt
    .replace(/\b(ignore|disregard|forget)\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/gi, '[filtered]')
    // Remove role injection attempts
    .replace(/\b(you are now|act as|pretend to be|new instructions?:)/gi, '[filtered]')
    // Trim to reasonable length
    .substring(0, 2000)
    .trim();
};

// Helper to make API call to Groq
const callGroqAPI = async (messages, maxTokens = 1000, temperature = 0.7) => {
  const apiKey = process.env.GROQ_API_KEY;

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

  const sanitizedMessage = sanitizePromptInput(message);

  const messages = [
    {
      role: 'system',
      content: 'You are EduSphere AI Tutor, a helpful and friendly educational assistant. Help students understand topics clearly, simply and in an engaging way. Keep answers concise and easy to understand.'
    }
  ];

  // Add conversation history (cap at last 20 messages to prevent abuse)
  if (history && Array.isArray(history)) {
    const recentHistory = history.slice(-20);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.isUser ? 'user' : 'assistant',
        content: sanitizePromptInput(msg.text)
      });
    });
  }

  // Add current message
  messages.push({ role: 'user', content: sanitizedMessage });

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

  const sanitizedTopic = sanitizePromptInput(topic);
  const diffStr = sanitizePromptInput(difficulty || 'Beginner');

  const messages = [
    {
      role: 'system',
      content: 'You are EduSphere AI Tutor. Explain topics clearly for students.'
    },
    {
      role: 'user',
      content: `Explain '${sanitizedTopic}' at ${diffStr} level in a clear, engaging way. Structure your response with:
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
# ${sanitizedTopic}

📖 **What is it?**
${sanitizedTopic} is an important concept at ${diffStr} level. It forms a fundamental block of understanding within this subject and has wide applications in academic study and real-world technology.

🔑 **Key Concepts:**
- Core principles and definitions that outline ${sanitizedTopic}.
- How this topic connects to surrounding elements in this course.
- Critical variables or formulas used to calculate or describe ${sanitizedTopic} behavior.
- Real-world challenges solved by understanding ${sanitizedTopic}.

🌍 **Real World Example:**
You can observe ${sanitizedTopic} in daily life, such as in natural events, home appliances, or digital systems we interface with.

💡 **Fun Fact:**
Scientists continue to develop groundbreaking innovations utilizing the principles of ${sanitizedTopic} today!

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

  const sanitizedTopic = sanitizePromptInput(topic);

  const messages = [
    {
      role: 'system',
      content: 'You are EduSphere AI. Generate structured study notes.'
    },
    {
      role: 'user',
      content: `Generate complete study notes for '${sanitizedTopic}' with these exact sections:
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
${sanitizedTopic} is a key topic of interest that serves as a cornerstone of study in this course. It is critical for answering exam questions and building general subject proficiency.

KEY FORMULAS OR FACTS:
- Fact 1: ${sanitizedTopic} is extensively researched in modern science.
- Fact 2: It directly influences core subject theories.
- Fact 3: It has specialized properties that differentiate it from other concepts.

KEY POINTS:
- Always review the basic components before diving into advanced formulas.
- Understand the historical experiments that proved this concept.
- Note how it interacts with other subject matters in your syllabus.
- Remember its practical applications in modern industry.
- Key figures in research have spent decades perfecting this framework.

SUMMARY:
In summary, studying ${sanitizedTopic} is highly beneficial. By breaking down its core components, analyzing real-world applications, and reviewing key facts, you can easily grasp the concept and perform well on examinations.

EXAM TIPS:
- Tip 1: Be prepared to define ${sanitizedTopic} in your own words.
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

  const sanitizedSubject = sanitizePromptInput(subject);
  const weeks = Math.min(Math.max(parseInt(durationWeeks) || 4, 1), 52); // clamp 1–52
  const hours = Math.min(Math.max(parseInt(weeklyHours) || 1, 1), 168);  // clamp 1–168

  const messages = [
    {
      role: 'system',
      content: 'You are EduSphere AI Planner. You create optimized weekly study schedules.'
    },
    {
      role: 'user',
      content: `Create a custom ${weeks}-week study plan for studying '${sanitizedSubject}' committing ${hours} hours per week.
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
    let fallbackPlan = `### Custom Study Planner: ${sanitizedSubject}
**Schedule:** ${hours} Hours/Week | **Duration:** ${weeks} Weeks

`;
    for (let w = 1; w <= weeks; w++) {
      fallbackPlan += `#### Week ${w}: Foundations & Exploration
- **Focus:** Explore core concepts of ${sanitizedSubject} (Approx. ${Math.round(hours * 0.6)} hours).
- **Practice:** Try solving 5-10 beginner problems.
- **Review:** Summarize your learning in bullet points at the end of the week.

`;
    }
    fallbackPlan += `*Note: Running in offline fallback mode.*`;
    res.status(200).json({ plan: fallbackPlan });
  }
};
