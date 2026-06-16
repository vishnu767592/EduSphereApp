package com.edusphere.controller;

import com.edusphere.config.JwtAuthFilter.UserPrincipal;
import com.edusphere.dto.AdminStatsResponse;
import com.edusphere.model.User;
import com.edusphere.model.UserProgress;
import com.edusphere.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final TopicCompletionRepository topicCompletionRepository;
    private final QuizResultRepository quizResultRepository;
    private final UserProgressRepository userProgressRepository;

    public AdminController(
            UserRepository userRepository,
            TopicCompletionRepository topicCompletionRepository,
            QuizResultRepository quizResultRepository,
            UserProgressRepository userProgressRepository
    ) {
        this.userRepository = userRepository;
        this.topicCompletionRepository = topicCompletionRepository;
        this.quizResultRepository = quizResultRepository;
        this.userProgressRepository = userProgressRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalCompletions = topicCompletionRepository.count();
        long totalQuizzes = quizResultRepository.count();

        List<UserProgress> allProgress = userProgressRepository.findAll();
        int totalScore = 0;
        int totalQuizCount = 0;
        for (UserProgress up : allProgress) {
            if (up.getTotalQuizzes() != null && up.getTotalQuizzes() > 0) {
                totalQuizCount += up.getTotalQuizzes();
                totalScore += up.getTotalQuizScore();
            }
        }
        int avgScore = totalQuizCount > 0 ? Math.round((float) totalScore / totalQuizCount) : 0;

        return ResponseEntity.ok(new AdminStatsResponse(totalUsers, totalCompletions, totalQuizzes, avgScore));
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("role", u.getRole());
            map.put("created_at", u.getCreatedAt());

            Optional<UserProgress> progressOpt = userProgressRepository.findByUserId(u.getId());
            if (progressOpt.isPresent()) {
                UserProgress up = progressOpt.get();
                map.put("streak", up.getStreak());
                map.put("total_completed", up.getTotalCompleted());
                map.put("total_quizzes", up.getTotalQuizzes());
            }
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // Prevent self-deletion
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal) {
            Long currentId = ((UserPrincipal) principal).getId();
            if (currentId.equals(userId)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Cannot delete your own account");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
        }

        userRepository.deleteById(userId);
        Map<String, String> body = new HashMap<>();
        body.put("message", "User deleted successfully");
        return ResponseEntity.ok(body);
    }
}
