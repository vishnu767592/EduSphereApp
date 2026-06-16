package com.edusphere.repository;

import com.edusphere.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByUserId(Long userId);
    boolean existsByUserIdAndSubjectName(Long userId, String subjectName);
}
