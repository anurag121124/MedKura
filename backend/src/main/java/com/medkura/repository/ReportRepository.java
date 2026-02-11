package com.medkura.repository;

import com.medkura.entity.Report;
import com.medkura.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
  List<Report> findByUserOrderByCreatedAtDesc(User user);
  Optional<Report> findByIdAndUser(Long id, User user);
}
