package com.edusphere.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_progress")
public class UserProgress {

    @Id
    @Column(name = "user_id")
    private Long userId;

    private Integer streak = 0;

    @Column(name = "last_active_date")
    private LocalDate lastActiveDate;

    @Column(name = "last_streak_date")
    private LocalDate lastStreakDate;

    @Column(name = "total_completed")
    private Integer totalCompleted = 0;

    @Column(name = "total_quizzes")
    private Integer totalQuizzes = 0;

    @Column(name = "total_quiz_score")
    private Integer totalQuizScore = 0;

    public UserProgress() {}

    public UserProgress(Long userId) {
        this.userId = userId;
        this.streak = 0;
        this.totalCompleted = 0;
        this.totalQuizzes = 0;
        this.totalQuizScore = 0;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getStreak() {
        return streak;
    }

    public void setStreak(Integer streak) {
        this.streak = streak;
    }

    public LocalDate getLastActiveDate() {
        return lastActiveDate;
    }

    public void setLastActiveDate(LocalDate lastActiveDate) {
        this.lastActiveDate = lastActiveDate;
    }

    public LocalDate getLastStreakDate() {
        return lastStreakDate;
    }

    public void setLastStreakDate(LocalDate lastStreakDate) {
        this.lastStreakDate = lastStreakDate;
    }

    public Integer getTotalCompleted() {
        return totalCompleted;
    }

    public void setTotalCompleted(Integer totalCompleted) {
        this.totalCompleted = totalCompleted;
    }

    public Integer getTotalQuizzes() {
        return totalQuizzes;
    }

    public void setTotalQuizzes(Integer totalQuizzes) {
        this.totalQuizzes = totalQuizzes;
    }

    public Integer getTotalQuizScore() {
        return totalQuizScore;
    }

    public void setTotalQuizScore(Integer totalQuizScore) {
        this.totalQuizScore = totalQuizScore;
    }
}
