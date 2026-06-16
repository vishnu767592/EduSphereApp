package com.edusphere.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_progress", uniqueConstraints = {
    @UniqueConstraint(name = "unique_user_date", columnNames = {"user_id", "date"})
})
public class DailyProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "topics_completed")
    private Integer topicsCompleted = 0;

    @Column(name = "quizzes_taken")
    private Integer quizzesTaken = 0;

    public DailyProgress() {}

    public DailyProgress(Long userId, LocalDate date, Integer topicsCompleted) {
        this.userId = userId;
        this.date = date;
        this.topicsCompleted = topicsCompleted;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Integer getTopicsCompleted() { return topicsCompleted; }
    public void setTopicsCompleted(Integer topicsCompleted) { this.topicsCompleted = topicsCompleted; }
    // Alias for legacy code
    public Integer getCount() { return topicsCompleted; }
    public void setCount(Integer count) { this.topicsCompleted = count; }
    public Integer getQuizzesTaken() { return quizzesTaken; }
    public void setQuizzesTaken(Integer quizzesTaken) { this.quizzesTaken = quizzesTaken; }
}
