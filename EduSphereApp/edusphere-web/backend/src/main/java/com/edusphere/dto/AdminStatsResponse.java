package com.edusphere.dto;

public class AdminStatsResponse {
    private long totalUsers;
    private long totalCompletions;
    private long totalQuizzes;
    private int avgQuizScore;

    public AdminStatsResponse() {}

    public AdminStatsResponse(long totalUsers, long totalCompletions, long totalQuizzes, int avgQuizScore) {
        this.totalUsers = totalUsers;
        this.totalCompletions = totalCompletions;
        this.totalQuizzes = totalQuizzes;
        this.avgQuizScore = avgQuizScore;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCompletions() {
        return totalCompletions;
    }

    public void setTotalCompletions(long totalCompletions) {
        this.totalCompletions = totalCompletions;
    }

    public long getTotalQuizzes() {
        return totalQuizzes;
    }

    public void setTotalQuizzes(long totalQuizzes) {
        this.totalQuizzes = totalQuizzes;
    }

    public int getAvgQuizScore() {
        return avgQuizScore;
    }

    public void setAvgQuizScore(int avgQuizScore) {
        this.avgQuizScore = avgQuizScore;
    }
}
