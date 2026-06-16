package com.edusphere.dto;

public class ProgressSummaryResponse {
    private Integer streak;
    private Integer totalCompleted;
    private Integer totalQuizzes;
    private Integer avgScore;
    private String level;

    public ProgressSummaryResponse() {}

    public ProgressSummaryResponse(Integer streak, Integer totalCompleted, Integer totalQuizzes, Integer avgScore, String level) {
        this.streak = streak;
        this.totalCompleted = totalCompleted;
        this.totalQuizzes = totalQuizzes;
        this.avgScore = avgScore;
        this.level = level;
    }

    public Integer getStreak() {
        return streak;
    }

    public void setStreak(Integer streak) {
        this.streak = streak;
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

    public Integer getAvgScore() {
        return avgScore;
    }

    public void setAvgScore(Integer avgScore) {
        this.avgScore = avgScore;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
