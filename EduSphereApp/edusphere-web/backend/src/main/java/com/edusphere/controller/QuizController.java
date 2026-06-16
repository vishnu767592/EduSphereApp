package com.edusphere.controller;

import com.edusphere.config.JwtAuthFilter.UserPrincipal;
import com.edusphere.dto.QuizSubmitRequest;
import com.edusphere.model.Certificate;
import com.edusphere.model.QuizResult;
import com.edusphere.model.User;
import com.edusphere.model.UserProgress;
import com.edusphere.repository.*;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizResultRepository quizResultRepository;
    private final UserProgressRepository userProgressRepository;
    private final TopicCompletionRepository topicCompletionRepository;
    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;

    public QuizController(
            QuizResultRepository quizResultRepository,
            UserProgressRepository userProgressRepository,
            TopicCompletionRepository topicCompletionRepository,
            CertificateRepository certificateRepository,
            UserRepository userRepository
    ) {
        this.quizResultRepository = quizResultRepository;
        this.userProgressRepository = userProgressRepository;
        this.topicCompletionRepository = topicCompletionRepository;
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
    }

    private Long getAuthenticatedUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal) {
            return ((UserPrincipal) principal).getId();
        }
        throw new IllegalStateException("User principal not found in security context");
    }

    private int getRequiredTopicsForSubject(String subject) {
        switch (subject) {
            case "Quantum Physics": return 12;
            case "Human Anatomy": return 15;
            case "Organic Chemistry": return 10;
            case "Ancient History": return 8;
            case "Calculus III": return 14;
            case "Astrophysics": return 11;
            case "Marine Biology": return 9;
            case "Computer Science": return 20;
            case "Artificial Intelligence": return 18;
            case "Psychology 101": return 10;
            default: return 10;
        }
    }

    @PostMapping("/submit")
    @Transactional
    public ResponseEntity<?> submitQuizResult(@Valid @RequestBody QuizSubmitRequest request) {
        Long userId = getAuthenticatedUserId();
        int percentage = Math.round(((float) request.getScore() / request.getTotal()) * 100);

        QuizResult result = new QuizResult(
                userId,
                request.getSubjectName(),
                request.getTopicName(),
                request.getScore(),
                request.getTotal(),
                percentage
        );
        quizResultRepository.save(result);

        // Update progress statistics
        UserProgress progress = userProgressRepository.findByUserId(userId)
                .orElseGet(() -> new UserProgress(userId));
        progress.setTotalQuizzes(progress.getTotalQuizzes() + 1);
        progress.setTotalQuizScore(progress.getTotalQuizScore() + percentage);
        userProgressRepository.save(progress);

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Quiz result saved successfully");
        body.put("score", request.getScore());
        body.put("percentage", percentage);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/performance")
    public ResponseEntity<List<Map<String, Object>>> getPerformance() {
        Long userId = getAuthenticatedUserId();
        List<QuizResult> results = quizResultRepository.findByUserId(userId);

        // Group by subject and find highest score
        Map<String, Integer> subjectScores = new HashMap<>();
        for (QuizResult qr : results) {
            int currentMax = subjectScores.getOrDefault(qr.getSubjectName(), -1);
            if (qr.getPercentage() > currentMax) {
                subjectScores.put(qr.getSubjectName(), qr.getPercentage());
            }
        }

        List<Map<String, Object>> list = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : subjectScores.entrySet()) {
            Map<String, Object> map = new HashMap<>();
            map.put("subject_name", entry.getKey());
            map.put("score", entry.getValue());
            list.add(map);
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {
        List<UserProgress> list = userProgressRepository.findAllByOrderByStreakDesc();
        List<Map<String, Object>> leaderboard = new ArrayList<>();

        for (int i = 0; i < Math.min(list.size(), 20); i++) {
            UserProgress up = list.get(i);
            Optional<User> userOpt = userRepository.findById(up.getUserId());
            if (userOpt.isPresent()) {
                User u = userOpt.get();
                Map<String, Object> entry = new HashMap<>();
                entry.put("rank", i + 1);
                entry.put("name", u.getName());
                entry.put("streak", up.getStreak());
                entry.put("total_completed", up.getTotalCompleted());
                leaderboard.add(entry);
            }
        }
        return ResponseEntity.ok(leaderboard);
    }

    @PostMapping("/certificate")
    @Transactional
    public ResponseEntity<?> generateCertificate(@RequestBody Map<String, String> bodyRequest) {
        Long userId = getAuthenticatedUserId();
        String subject = bodyRequest.get("subject_name");
        
        if (subject == null || subject.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Subject name is required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Check if certificate already exists
        boolean certExists = certificateRepository.existsByUserIdAndSubjectName(userId, subject);
        if (certExists) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Certificate already issued for this subject");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Verify completions matching target count
        long completedCount = topicCompletionRepository.countByUserIdAndSubjectName(userId, subject);
        int requiredCount = getRequiredTopicsForSubject(subject);

        if (completedCount < requiredCount) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Incomplete subject: Completed " + completedCount + "/" + requiredCount + " topics");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        // Generate unique code
        String uniqueCode = "CERT-" + subject.substring(0, 2).toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Certificate certificate = new Certificate(userId, subject, uniqueCode);
        certificateRepository.save(certificate);

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Certificate issued successfully");
        body.put("certificate_code", uniqueCode);
        body.put("subject_name", subject);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/certificates")
    public ResponseEntity<List<Map<String, Object>>> getCertificates() {
        Long userId = getAuthenticatedUserId();
        List<Certificate> certs = certificateRepository.findByUserId(userId);
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Certificate c : certs) {
            Map<String, Object> map = new HashMap<>();
            map.put("subject_name", c.getSubjectName());
            map.put("certificate_code", c.getCertificateCode());
            map.put("issued_at", c.getIssuedAt());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }
}
