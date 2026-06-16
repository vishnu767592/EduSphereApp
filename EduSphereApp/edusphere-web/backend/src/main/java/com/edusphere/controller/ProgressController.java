package com.edusphere.controller;

import com.edusphere.config.JwtAuthFilter.UserPrincipal;
import com.edusphere.dto.BookmarkRequest;
import com.edusphere.dto.ProgressSummaryResponse;
import com.edusphere.dto.TopicCompleteRequest;
import com.edusphere.model.*;
import com.edusphere.repository.*;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final TopicCompletionRepository topicCompletionRepository;
    private final UserProgressRepository userProgressRepository;
    private final DailyProgressRepository dailyProgressRepository;
    private final BookmarkRepository bookmarkRepository;
    private final CertificateRepository certificateRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public ProgressController(
            TopicCompletionRepository topicCompletionRepository,
            UserProgressRepository userProgressRepository,
            DailyProgressRepository dailyProgressRepository,
            BookmarkRepository bookmarkRepository,
            CertificateRepository certificateRepository,
            NoteRepository noteRepository,
            UserRepository userRepository
    ) {
        this.topicCompletionRepository = topicCompletionRepository;
        this.userProgressRepository = userProgressRepository;
        this.dailyProgressRepository = dailyProgressRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.certificateRepository = certificateRepository;
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    private Long getAuthenticatedUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal) {
            return ((UserPrincipal) principal).getId();
        }
        throw new IllegalStateException("User principal not found in context");
    }

    // ───────────────────── Topic Completion ─────────────────────

    @PostMapping("/complete")
    @Transactional
    public ResponseEntity<?> markTopicCompleted(@Valid @RequestBody TopicCompleteRequest request) {
        Long userId = getAuthenticatedUserId();
        String topic = request.getTopicName();
        String subject = request.getSubjectName();

        boolean alreadyCompleted = topicCompletionRepository.existsByUserIdAndTopicName(userId, topic);
        if (alreadyCompleted) {
            Map<String, Object> body = new HashMap<>();
            body.put("message", "Topic already completed");
            body.put("isNewCompletion", false);
            return ResponseEntity.ok(body);
        }

        topicCompletionRepository.save(new TopicCompletion(userId, subject, topic));

        UserProgress progress = userProgressRepository.findByUserId(userId)
                .orElseGet(() -> new UserProgress(userId));
        progress.setTotalCompleted((progress.getTotalCompleted() != null ? progress.getTotalCompleted() : 0) + 1);

        LocalDate today = LocalDate.now();
        DailyProgress daily = dailyProgressRepository.findByUserIdAndDate(userId, today)
                .orElseGet(() -> new DailyProgress(userId, today, 0));
        daily.setTopicsCompleted((daily.getTopicsCompleted() != null ? daily.getTopicsCompleted() : 0) + 1);
        dailyProgressRepository.save(daily);

        // Streak logic
        LocalDate lastDate = progress.getLastStreakDate();
        int currentStreak = progress.getStreak() != null ? progress.getStreak() : 0;
        if (lastDate == null || !lastDate.equals(today)) {
            if (lastDate != null && lastDate.equals(today.minusDays(1))) {
                progress.setStreak(currentStreak + 1);
            } else {
                progress.setStreak(1);
            }
            progress.setLastStreakDate(today);
        }
        progress.setLastActiveDate(today);
        userProgressRepository.save(progress);

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Completion tracked");
        body.put("isNewCompletion", true);
        body.put("newStreak", progress.getStreak());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/completions")
    public ResponseEntity<List<Map<String, String>>> getCompletedTopics() {
        Long userId = getAuthenticatedUserId();
        List<TopicCompletion> completions = topicCompletionRepository.findByUserId(userId);
        List<Map<String, String>> result = new ArrayList<>();
        for (TopicCompletion tc : completions) {
            Map<String, String> map = new HashMap<>();
            map.put("topicName", tc.getTopicName());
            map.put("subjectName", tc.getSubjectName());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    // ───────────────────── Summary ─────────────────────

    @GetMapping("/summary")
    public ResponseEntity<ProgressSummaryResponse> getProgressSummary() {
        Long userId = getAuthenticatedUserId();
        UserProgress progress = userProgressRepository.findByUserId(userId)
                .orElseGet(() -> new UserProgress(userId));

        int totalCompleted = progress.getTotalCompleted() != null ? progress.getTotalCompleted() : 0;
        int totalQuizzes = progress.getTotalQuizzes() != null ? progress.getTotalQuizzes() : 0;
        int totalQuizScore = progress.getTotalQuizScore() != null ? progress.getTotalQuizScore() : 0;
        int avgScore = totalQuizzes > 0 ? Math.round((float) totalQuizScore / totalQuizzes) : 0;

        String level = "Starter 👋";
        if (totalCompleted >= 50) level = "Expert 🏆";
        else if (totalCompleted >= 30) level = "Advanced ⭐";
        else if (totalCompleted >= 15) level = "Intermediate 📚";
        else if (totalCompleted >= 5) level = "Beginner 🌱";

        return ResponseEntity.ok(new ProgressSummaryResponse(
                progress.getStreak() != null ? progress.getStreak() : 0,
                totalCompleted, totalQuizzes, avgScore, level
        ));
    }

    // ───────────────────── Weekly Activity ─────────────────────

    @GetMapping("/weekly")
    public ResponseEntity<List<Map<String, Object>>> getWeeklyData() {
        Long userId = getAuthenticatedUserId();
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.minusDays(6);

        List<DailyProgress> logs = dailyProgressRepository.findByUserIdAndDateBetween(userId, startOfWeek, today);
        Map<LocalDate, Integer> counts = new HashMap<>();
        for (DailyProgress log : logs) {
            counts.put(log.getDate(), log.getTopicsCompleted() != null ? log.getTopicsCompleted() : 0);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dayName = date.getDayOfWeek().name();
            dayName = dayName.charAt(0) + dayName.substring(1, 3).toLowerCase();
            Map<String, Object> map = new HashMap<>();
            map.put("dayLabel", dayName);
            map.put("date", date.toString());
            map.put("topicsCompleted", counts.getOrDefault(date, 0));
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    // ───────────────────── Bookmarks ─────────────────────

    @PostMapping("/bookmark")
    @Transactional
    public ResponseEntity<?> toggleBookmark(@Valid @RequestBody BookmarkRequest request) {
        Long userId = getAuthenticatedUserId();
        String topic = request.getTopicName();
        String subject = request.getSubjectName();

        Optional<Bookmark> existing = bookmarkRepository.findByUserIdAndTopicName(userId, topic);
        Map<String, Object> body = new HashMap<>();
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            body.put("bookmarked", false);
        } else {
            bookmarkRepository.save(new Bookmark(userId, subject, topic));
            body.put("bookmarked", true);
        }
        return ResponseEntity.ok(body);
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<List<Map<String, Object>>> getBookmarks() {
        Long userId = getAuthenticatedUserId();
        List<Bookmark> list = bookmarkRepository.findByUserIdOrderByBookmarkedAtDesc(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Bookmark b : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", b.getId());
            map.put("topicName", b.getTopicName());
            map.put("subjectName", b.getSubjectName());
            map.put("bookmarkedAt", b.getBookmarkedAt());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/bookmark/{id}")
    @Transactional
    public ResponseEntity<?> deleteBookmark(@PathVariable Long id) {
        Long userId = getAuthenticatedUserId();
        Optional<Bookmark> bk = bookmarkRepository.findById(id);
        if (bk.isEmpty() || !bk.get().getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Bookmark not found"));
        }
        bookmarkRepository.delete(bk.get());
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    // ───────────────────── Certificates ─────────────────────

    @GetMapping("/certificates")
    public ResponseEntity<List<Map<String, Object>>> getCertificates() {
        Long userId = getAuthenticatedUserId();
        List<Certificate> certs = certificateRepository.findByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Certificate c : certs) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("subjectName", c.getSubjectName());
            map.put("issuedAt", c.getIssuedAt());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    // ───────────────────── Notes ─────────────────────

    @GetMapping("/notes")
    public ResponseEntity<List<Map<String, Object>>> getNotes() {
        Long userId = getAuthenticatedUserId();
        List<Note> notes = noteRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Note n : notes) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", n.getId());
            map.put("topic", n.getTopic());
            map.put("content", n.getContent());
            map.put("createdAt", n.getCreatedAt());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/notes")
    public ResponseEntity<?> saveNote(@RequestBody Map<String, String> body) {
        Long userId = getAuthenticatedUserId();
        String topic = body.get("topic");
        String content = body.get("content");
        if (topic == null || content == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "topic and content are required"));
        }
        Note note = noteRepository.save(new Note(userId, topic, content));
        Map<String, Object> res = new HashMap<>();
        res.put("id", note.getId());
        res.put("topic", note.getTopic());
        res.put("content", note.getContent());
        res.put("createdAt", note.getCreatedAt());
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/notes/{id}")
    @Transactional
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        Long userId = getAuthenticatedUserId();
        Optional<Note> note = noteRepository.findById(id);
        if (note.isEmpty() || !note.get().getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Note not found"));
        }
        noteRepository.delete(note.get());
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    // ───────────────────── Leaderboard ─────────────────────

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {
        List<User> allUsers = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : allUsers) {
            UserProgress up = userProgressRepository.findByUserId(u.getId()).orElse(null);
            int streak = (up != null && up.getStreak() != null) ? up.getStreak() : 0;
            int completed = (up != null && up.getTotalCompleted() != null) ? up.getTotalCompleted() : 0;
            int quizzes = (up != null && up.getTotalQuizzes() != null) ? up.getTotalQuizzes() : 0;
            int totalScore = (up != null && up.getTotalQuizScore() != null) ? up.getTotalQuizScore() : 0;
            int avgScore = quizzes > 0 ? Math.round((float) totalScore / quizzes) : 0;

            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("streak", streak);
            map.put("totalCompleted", completed);
            map.put("totalQuizzes", quizzes);
            map.put("avgScore", avgScore);
            result.add(map);
        }

        // Sort by streak DESC, then totalCompleted DESC
        result.sort((a, b) -> {
            int streakCmp = Integer.compare((Integer) b.get("streak"), (Integer) a.get("streak"));
            if (streakCmp != 0) return streakCmp;
            return Integer.compare((Integer) b.get("totalCompleted"), (Integer) a.get("totalCompleted"));
        });

        return ResponseEntity.ok(result);
    }
}
