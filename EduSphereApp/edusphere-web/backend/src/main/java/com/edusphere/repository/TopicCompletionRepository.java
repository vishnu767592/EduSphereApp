package com.edusphere.repository;

import com.edusphere.model.TopicCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TopicCompletionRepository extends JpaRepository<TopicCompletion, Long> {
    List<TopicCompletion> findByUserId(Long userId);
    boolean existsByUserIdAndSubjectNameAndTopicName(Long userId, String subjectName, String topicName);
    boolean existsByUserIdAndTopicName(Long userId, String topicName);
    long countByUserIdAndSubjectName(Long userId, String subjectName);
}
