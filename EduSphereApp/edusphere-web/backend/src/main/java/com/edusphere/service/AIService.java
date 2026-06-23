package com.edusphere.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Value("${edusphere.groq.apikey}")
    private String apiKey;

    private final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();

    private Map<String, Object> createGroqRequest(List<Map<String, String>> messages, double temp, int maxTokens) {
        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama-3.3-70b-versatile");
        body.put("messages", messages);
        body.put("temperature", temp);
        body.put("max_tokens", maxTokens);
        return body;
    }

    private String executeGroqRequest(Map<String, Object> requestBody) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(GROQ_URL, HttpMethod.POST, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List choices = (List) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map choice = (Map) choices.get(0);
                    Map message = (Map) choice.get("message");
                    if (message != null) {
                        return (String) message.get("content");
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error calling Groq API: " + e.getMessage());
        }
        return null;
    }

    public String generateChatResponse(List<Map<String, String>> chatHistory, String userMessage) {
        List<Map<String, String>> messages = new ArrayList<>();
        
        // System prompt
        Map<String, String> systemPrompt = new HashMap<>();
        systemPrompt.put("role", "system");
        systemPrompt.put("content", "You are EduSphere AI Tutor, a helpful and friendly educational assistant. Help students understand topics clearly, simply and in an engaging way. Keep answers concise and easy to understand.");
        messages.add(systemPrompt);

        // Add history and user message
        messages.addAll(chatHistory);
        Map<String, String> userPrompt = new HashMap<>();
        userPrompt.put("role", "user");
        userPrompt.put("content", userMessage);
        messages.add(userPrompt);

        Map<String, Object> request = createGroqRequest(messages, 0.7, 1024);
        String response = executeGroqRequest(request);
        return response != null ? response : getOfflineChatFallback(userMessage);
    }

    public String generateLessonContent(String topic, String difficulty) {
        List<Map<String, String>> messages = new ArrayList<>();
        
        Map<String, String> systemPrompt = new HashMap<>();
        systemPrompt.put("role", "system");
        systemPrompt.put("content", "You are EduSphere AI Tutor. Explain topics clearly for students.");
        messages.add(systemPrompt);

        Map<String, String> userPrompt = new HashMap<>();
        userPrompt.put("role", "user");
        userPrompt.put("content", "Explain '" + topic + "' at " + difficulty + " level in a clear, engaging way. " +
                "Structure your response with:\n" +
                "1. What is it? (2-3 sentences)\n" +
                "2. Key Concepts (3-4 bullet points)\n" +
                "3. Real World Example (1-2 sentences)\n" +
                "4. Fun Fact (1 sentence)\n" +
                "Keep it educational and easy to understand.");
        messages.add(userPrompt);

        Map<String, Object> request = createGroqRequest(messages, 0.7, 800);
        String response = executeGroqRequest(request);
        
        return response != null ? response : getOfflineContentFallback(topic);
    }

    public String generateStudyNotes(String topic) {
        List<Map<String, String>> messages = new ArrayList<>();
        
        Map<String, String> systemPrompt = new HashMap<>();
        systemPrompt.put("role", "system");
        systemPrompt.put("content", "You are EduSphere AI. Generate structured study notes.");
        messages.add(systemPrompt);

        Map<String, String> userPrompt = new HashMap<>();
        userPrompt.put("role", "user");
        userPrompt.put("content", "Generate complete study notes for '" + topic + "' with these exact sections:\n\n" +
                "DEFINITION:\n" +
                "(Write a clear 2-3 sentence definition)\n\n" +
                "KEY FORMULAS OR FACTS:\n" +
                "(List 3-4 important formulas or facts with bullet points)\n\n" +
                "KEY POINTS:\n" +
                "(List 5-6 important bullet points to remember)\n\n" +
                "SUMMARY:\n" +
                "(Write a 3-4 sentence summary)\n\n" +
                "EXAM TIPS:\n" +
                "(List 3 important exam tips)");
        messages.add(userPrompt);

        Map<String, Object> request = createGroqRequest(messages, 0.5, 1000);
        String response = executeGroqRequest(request);
        
        return response != null ? response : getOfflineNotesFallback(topic);
    }

    public String generateStudyPlan(String subject, int durationWeeks, int hoursPerDay) {
        List<Map<String, String>> messages = new ArrayList<>();
        
        Map<String, String> systemPrompt = new HashMap<>();
        systemPrompt.put("role", "system");
        systemPrompt.put("content", "You are EduSphere AI Study Planner. Create study schedules.");
        messages.add(systemPrompt);

        Map<String, String> userPrompt = new HashMap<>();
        userPrompt.put("role", "user");
        userPrompt.put("content", "Create a structured week-by-week study plan for '" + subject + "' over " + durationWeeks + " weeks, dedicating " + hoursPerDay + " hours per day. " +
                "Organize by weeks. For each week, provide a focus area, 3 subtopics to study, and a quick practical task. Keep it realistic, direct, and encouraging.");
        messages.add(userPrompt);

        Map<String, Object> request = createGroqRequest(messages, 0.6, 1024);
        String response = executeGroqRequest(request);
        
        return response != null ? response : getOfflinePlannerFallback(subject, durationWeeks);
    }

    private String getOfflineContentFallback(String topic) {
        return "### " + topic + "\n\n" +
                "📖 **What is it?**\n" +
                topic + " is an important concept in this subject area. It forms a fundamental part of understanding the broader topic and has wide applications in science and everyday life.\n\n" +
                "🔑 **Key Concepts:**\n" +
                "- Core principles that define " + topic + "\n" +
                "- How it relates to other concepts in this field\n" +
                "- Practical applications and use cases\n\n" +
                "🌍 **Real World Example:**\n" +
                topic + " can be observed in everyday situations around us, from natural phenomena to modern technology.\n\n" +
                "💡 **Fun Fact:**\n" +
                "Scientists continue to discover new applications of " + topic + " in cutting-edge fields like AI and space exploration!";
    }

    private String getOfflineNotesFallback(String topic) {
        return "DEFINITION:\n" +
                topic + " is a fundamental concept that plays a key role in its field of study. Understanding it provides a foundation for more advanced topics.\n\n" +
                "KEY FORMULAS OR FACTS:\n" +
                "- Core principle 1 of " + topic + "\n" +
                "- Mathematical relationship involved\n" +
                "- Key measurements and values\n\n" +
                "KEY POINTS:\n" +
                "- " + topic + " was discovered through scientific research.\n" +
                "- It applies directly to real-world situations.\n" +
                "- It connects to several other important concepts in the subject.\n\n" +
                "SUMMARY:\n" +
                topic + " is an essential subject that students must understand deeply. It forms the backbone of many advanced concepts. Regular practice and revision will help master this topic.\n\n" +
                "EXAM TIPS:\n" +
                "- Always understand the concept before memorizing details.\n" +
                "- Practice solving related problems.\n" +
                "- Connect this topic to practical real-world examples.";
    }

    private String getOfflinePlannerFallback(String subject, int weeks) {
        StringBuilder plan = new StringBuilder();
        plan.append("### study Plan: ").append(subject).append(" (").append(weeks).append(" Weeks)\n\n");
        for (int i = 1; i <= weeks; i++) {
            plan.append("**Week ").append(i).append(": Core Concepts of ").append(subject).append("**\n");
            plan.append("- Focus: Fundamental principles and vocabulary\n");
            plan.append("- Topics to cover: Introductory concepts, historical background, core mathematical/theoretical framework\n");
            plan.append("- Practical Task: Write a 1-page summary of this week's topics in your own words.\n\n");
        }
        return plan.toString();
    }

    private String getOfflineChatFallback(String userMessage) {
        String msg = userMessage.toLowerCase().trim();
        
        if (msg.contains("quantum entanglement")) {
            return "### 🌌 Quantum Entanglement Explained Simply\n\n" +
                    "Imagine you have a pair of magical shoes. If you put the left shoe in a box in New York and the right shoe in a box in Tokyo, opening one box instantly tells you which shoe is in the other, even though they are thousands of miles apart!\n\n" +
                    "In physics, **quantum entanglement** occurs when two particles become deeply connected. When this happens: \n" +
                    "- Measuring the state of one particle (like its spin) instantly determines the state of the other particle, no matter how far apart they are.\n" +
                    "- Einstein famously called this **\"spooky action at a distance\"** because it seemed to break the cosmic speed limit (the speed of light).\n\n" +
                    "Do you want to know how this is used in quantum computing?";
        }
        
        if (msg.contains("machine learning")) {
            return "### 🤖 What is Machine Learning?\n\n" +
                    "Think of how you learned to recognize a dog. No one gave you a list of rules like 'four legs + fur + bark'. Instead, you saw many dogs, and your brain naturally figured out the pattern. **Machine Learning (ML)** works the same way for computers!\n\n" +
                    "Instead of writing explicit instructions, we feed computers huge amounts of data (e.g., thousands of dog photos), and algorithms learn to identify patterns automatically.\n\n" +
                    "Key subfields include:\n" +
                    "- **Supervised Learning:** Training with labeled data (e.g., 'dog' vs 'cat').\n" +
                    "- **Unsupervised Learning:** Finding hidden patterns in unlabeled data.\n" +
                    "- **Reinforcement Learning:** Learning by trial and error (like a dog getting treats for tricks).\n\n" +
                    "Is there a specific ML algorithm you'd like to explore?";
        }
        
        if (msg.contains("immune system")) {
            return "### 🛡️ How the Immune System Works\n\n" +
                    "Your body's immune system is like a highly trained defense force protecting a castle (your body) from invaders (bacteria, viruses, and toxins).\n\n" +
                    "Here's the breakdown of the defense team:\n" +
                    "1. **The Moat & Walls (Physical Barriers):** Your skin and mucous membranes keep invaders out.\n" +
                    "2. **The Patrol Guards (Innate Immunity):** White blood cells (like macrophages) swallow up anything foreign they encounter.\n" +
                    "3. **The Special Forces (Adaptive Immunity):** B-cells and T-cells. B-cells create **antibodies** (custom weapons) to lock onto specific invaders, while T-cells destroy infected cells and coordinate the attack.\n\n" +
                    "Would you like to learn how vaccines train this system to protect you?";
        }
        
        if (msg.contains("recursion")) {
            return "### 🔄 Recursion Explained with Examples\n\n" +
                    "**Recursion** is a coding technique where a function calls itself to solve a smaller version of the same problem. Think of it like a **Russian nesting doll**: to reach the tiny doll in the center, you have to keep opening larger dolls.\n\n" +
                    "Every recursive function must have two main parts:\n" +
                    "1. **Base Case:** The stopping condition (e.g., reaching the smallest nesting doll). Without this, the code runs forever and crashes (stack overflow!).\n" +
                    "2. **Recursive Case:** The part where the function calls itself with a smaller input.\n\n" +
                    "**Example in Java (Factorial computation):**\n" +
                    "```java\n" +
                    "int factorial(int n) {\n" +
                    "    if (n <= 1) return 1; // Base case\n" +
                    "    return n * factorial(n - 1); // Recursive call\n" +
                    "}\n" +
                    "```\n" +
                    "Would you like to trace how `factorial(3)` executes step-by-step?";
        }
        
        if (msg.contains("hello") || msg.contains("hi ") || msg.equals("hi") || msg.contains("hey")) {
            return "Hello! I am your EduSphere AI Tutor. Ask me any science, math, or coding question, or click one of the quick prompts above to get started!";
        }

        return "I am the EduSphere offline AI tutor! Although the Groq API key is currently unreachable or invalid, I can still help you study. \n\n" +
                "Try asking me one of the following topics for detailed explanations:\n" +
                "- **Quantum Entanglement**\n" +
                "- **Machine Learning**\n" +
                "- **Immune System**\n" +
                "- **Recursion**\n\n" +
                "What subject are you currently working on?";
    }
}
