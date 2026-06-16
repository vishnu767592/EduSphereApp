package com.edusphere.repository;

import com.edusphere.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserIdOrderByBookmarkedAtDesc(Long userId);
    Optional<Bookmark> findByUserIdAndSubjectNameAndTopicName(Long userId, String subjectName, String topicName);
    Optional<Bookmark> findByUserIdAndTopicName(Long userId, String topicName);
}
