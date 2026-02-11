package com.medkura.dto;

public class ReportCreateResponse {
  private final Long id;
  private final String status;

  public ReportCreateResponse(Long id, String status) {
    this.id = id;
    this.status = status;
  }

  public Long getId() {
    return id;
  }

  public String getStatus() {
    return status;
  }
}
