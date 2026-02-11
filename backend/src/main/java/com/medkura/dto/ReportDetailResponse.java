package com.medkura.dto;

import java.time.Instant;
import java.time.LocalDate;
public class ReportDetailResponse {
  private final Long id;
  private final String name;
  private final String type;
  private final String status;
  private final String summary;
  private final String filePath;
  private final Instant createdAt;
  private final Instant updatedAt;
  private final LocalDate reportDate;

  public ReportDetailResponse(
      Long id,
      String name,
      String type,
      String status,
      String summary,
      String filePath,
      Instant createdAt,
      Instant updatedAt,
      LocalDate reportDate) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.status = status;
    this.summary = summary;
    this.filePath = filePath;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.reportDate = reportDate;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getType() {
    return type;
  }

  public String getStatus() {
    return status;
  }

  public String getSummary() {
    return summary;
  }

  public String getFilePath() {
    return filePath;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public LocalDate getReportDate() {
    return reportDate;
  }
}
