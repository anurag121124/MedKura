package com.medkura.service;

import com.medkura.dto.ReportCreateResponse;
import com.medkura.dto.ReportDetailResponse;
import com.medkura.dto.ReportListItem;
import com.medkura.entity.Report;
import com.medkura.entity.ReportStatus;
import com.medkura.entity.User;
import com.medkura.exception.NotFoundException;
import com.medkura.exception.ValidationException;
import com.medkura.repository.ReportRepository;
import com.medkura.repository.UserRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ReportService {
  private final ReportRepository reportRepository;
  private final UserRepository userRepository;
  private final Path storagePath;

  public ReportService(
      ReportRepository reportRepository,
      UserRepository userRepository,
      @Value("${app.storage.path}") String storagePath) {
    this.reportRepository = reportRepository;
    this.userRepository = userRepository;
    this.storagePath = Paths.get(storagePath).toAbsolutePath().normalize();
  }

  public ReportCreateResponse createReport(
      String userEmail,
      String name,
      String type,
      LocalDate reportDate,
      MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new ValidationException("File is required");
    }
    String normalizedType = type == null ? "" : type.trim().toUpperCase();
    if (!("PDF".equals(normalizedType) || "IMAGE".equals(normalizedType))) {
      throw new ValidationException("Invalid report type");
    }
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new NotFoundException("User not found"));
    try {
      Files.createDirectories(storagePath);
    } catch (IOException ex) {
      throw new ValidationException("Unable to initialize storage");
    }

    String original = file.getOriginalFilename();
    String safeName = UUID.randomUUID() + "-" + (original == null ? "report" : original.replaceAll("[^a-zA-Z0-9._-]", "_"));
    Path target = storagePath.resolve(safeName);

    try {
      Files.copy(file.getInputStream(), target);
    } catch (IOException ex) {
      throw new ValidationException("Failed to store file");
    }

    Report report = new Report();
    report.setUser(user);
    report.setName(name);
    report.setType(normalizedType);
    report.setReportDate(reportDate);
    report.setFilePath(target.toString());
    report.setStatus(ReportStatus.UPLOADED);
    reportRepository.save(report);

    return new ReportCreateResponse(report.getId(), report.getStatus().name());
  }

  public List<ReportListItem> listReports(String userEmail) {
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new NotFoundException("User not found"));
    return reportRepository.findByUserOrderByCreatedAtDesc(user)
        .stream()
      .map(report -> new ReportListItem(
        report.getId(),
        report.getName(),
        report.getType(),
        report.getStatus().name(),
        report.getCreatedAt(),
        report.getUpdatedAt(),
        report.getReportDate()))
        .collect(Collectors.toList());
  }

  public ReportDetailResponse getReport(String userEmail, Long id) {
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new NotFoundException("User not found"));
    Report report = reportRepository.findByIdAndUser(id, user)
        .orElseThrow(() -> new NotFoundException("Report not found"));
    return new ReportDetailResponse(
      report.getId(),
      report.getName(),
      report.getType(),
      report.getStatus().name(),
      report.getSummary(),
      report.getFilePath(),
      report.getCreatedAt(),
      report.getUpdatedAt(),
      report.getReportDate());
  }

  public ReportDetailResponse updateStatus(String userEmail, Long id, String status, String summary) {
    User user = userRepository.findByEmail(userEmail)
        .orElseThrow(() -> new NotFoundException("User not found"));
    Report report = reportRepository.findByIdAndUser(id, user)
        .orElseThrow(() -> new NotFoundException("Report not found"));
    ReportStatus nextStatus;
    try {
      nextStatus = ReportStatus.valueOf(status.toUpperCase());
    } catch (IllegalArgumentException ex) {
      throw new ValidationException("Invalid status");
    }
    report.setStatus(nextStatus);
    if (summary != null && !summary.isBlank()) {
      report.setSummary(summary);
    } else if (nextStatus == ReportStatus.COMPLETED
        && (report.getSummary() == null || report.getSummary().isBlank())) {
      report.setSummary(generateSummary(report));
    }
    reportRepository.save(report);

    return getReport(userEmail, id);
  }

  private String generateSummary(Report report) {
    String date = report.getReportDate() == null ? "unspecified date" : report.getReportDate().toString();
    return "Report '" + report.getName() + "' (" + report.getType() + ") reviewed on " + date
        + ". Summary is auto-generated for demo purposes.";
  }
}
