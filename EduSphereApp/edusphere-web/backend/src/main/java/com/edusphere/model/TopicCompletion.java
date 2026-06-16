package com.edusphere.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "topic_completions", uniqueConstraints = {
    @UniqueConstraint(name = "unique_user_topic", columnNames = {"user_id", "subject_name", "topic_name"})
})
public class TopicCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @Column(name = "topic_name", nullable = false)
    private String topicName;

    @Column(name = "completed_at")
    private LocalDateTime completedAt = LocalDateTime.now();

    public TopicCompletion() {}

    public TopicCompletion(Long userId, String subjectName, String topicName) {
        this.userId = userId;
        this.subjectName = subjectName;
        this.topicName = topicName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
