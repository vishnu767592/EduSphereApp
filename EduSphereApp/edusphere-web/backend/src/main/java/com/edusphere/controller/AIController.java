package com.edusphere.controller;

import com.edusphere.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> request) {
        String message = (String) request.get("message");
        if (message == null) {
            message = (String) request.get("userMessage");
        }

        List<Map<String, String>> history = new ArrayList<>();
        List<Map<String, Object>> rawHistory = (List<Map<String, Object>>) request.get("history");
        if (rawHistory != null) {
            for (Map<String, Object> h : rawHistory) {
                Map<String, String> hm = new HashMap<>();
                hm.put("role", (String) h.get("role"));
                hm.put("content", (String) h.get("content"));
                history.add(hm);
            }
        }

        String reply = aiService.generateChatResponse(history, message);
        Map<String, String> body = new HashMap<>();
        body.put("answer", reply);
        body.put("content", reply);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/lesson")
    public ResponseEntity<Map<String, String>> getLessonContent(@RequestBody Map<String, String> request) {
        String topic = request.get("topic");
        String difficulty = request.getOrDefault("difficulty", "Beginner");

        String content = aiService.generateLessonContent(topic, difficulty);
        Map<String, String> body = new HashMap<>();
        body.put("content", content);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/notes")
    public ResponseEntity<Map<String, String>> getNotes(@RequestBody Map<String, String> request) {
        String topic = request.get("topic");

        String content = aiService.generateStudyNotes(topic);
        Map<String, String> body = new HashMap<>();
        body.put("content", content);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/planner")
    public ResponseEntity<Map<String, String>> getStudyPlan(@RequestBody Map<String, Object> request) {
        String subject = (String) request.get("subject");
        
        int durationWeeks = 4;
        Object durationObj = request.get("durationWeeks");
        if (durationObj instanceof Number) {
            durationWeeks = ((Number) durationObj).intValue();
        }

        int hoursPerDay = 2;
        Object hoursObj = request.get("hoursPerDay");
        if (hoursObj instanceof Number) {
            hoursPerDay = ((Number) hoursObj).intValue();
        }

        String plan = aiService.generateStudyPlan(subject, durationWeeks, hoursPerDay);
        Map<String, String> body = new HashMap<>();
        body.put("content", plan);
        return ResponseEntity.ok(body);
    }
}
