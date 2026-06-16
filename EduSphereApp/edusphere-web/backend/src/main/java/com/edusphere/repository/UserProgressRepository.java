package com.edusphere.repository;

import com.edusphere.model.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    Optional<UserProgress> findByUserId(Long userId);
    List<UserProgress> findAllByOrderByStreakDesc();
}
