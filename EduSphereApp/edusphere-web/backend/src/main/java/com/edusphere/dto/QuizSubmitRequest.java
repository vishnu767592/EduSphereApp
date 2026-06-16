package com.edusphere.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

public class QuizSubmitRequest {
    @JsonProperty("subject_name")
    private String subjectName;

    @JsonProperty("topic_name")
    private String topicName;

    @NotNull
    private Integer score;

    @NotNull
    private Integer total;

    public QuizSubmitRequest() {}

    public QuizSubmitRequest(String subjectName, String topicName, Integer score, Integer total) {
        this.subjectName = subjectName;
        this.topicName = topicName;
        this.score = score;
        this.total = total;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getTopicName() {
        return topicName;
    }

    public void setTopicName(String topicName) {
        this.topicName = topicName;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }
}
