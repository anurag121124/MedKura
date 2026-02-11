package com.medkura.dto;

import jakarta.validation.constraints.Size;

public class GenerateSummaryRequest {
  @Size(max = 1000)
  private String notes;

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }
}
