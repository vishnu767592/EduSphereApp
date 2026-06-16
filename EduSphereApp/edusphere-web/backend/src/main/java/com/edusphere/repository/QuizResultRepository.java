package com.edusphere.repository;

import com.edusphere.model.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByUserId(Long userId);
    Optional<QuizResult> findByUserIdAndSubjectNameAndTopicName(Long userId, String subjectName, String topicName);
}
