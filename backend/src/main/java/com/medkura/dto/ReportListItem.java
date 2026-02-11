package com.medkura.dto;

import java.time.Instant;
import java.time.LocalDate;
public class ReportListItem {
  private final Long id;
  private final String name;
  private final String type;
  private final String status;
  private final Instant createdAt;
  private final Instant updatedAt;
  private final LocalDate reportDate;

  public ReportListItem(
      Long id,
      String name,
      String type,
      String status,
      Instant createdAt,
      Instant updatedAt,
      LocalDate reportDate) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.status = status;
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
