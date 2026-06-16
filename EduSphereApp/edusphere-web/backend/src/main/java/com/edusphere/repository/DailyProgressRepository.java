package com.edusphere.repository;

import com.edusphere.model.DailyProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyProgressRepository extends JpaRepository<DailyProgress, Long> {
    Optional<DailyProgress> findByUserIdAndDate(Long userId, LocalDate date);
    List<DailyProgress> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
}
