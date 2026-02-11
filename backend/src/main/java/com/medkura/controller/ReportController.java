package com.medkura.controller;

import com.medkura.dto.ReportCreateResponse;
import com.medkura.dto.ReportDetailResponse;
import com.medkura.dto.ReportListItem;
import com.medkura.dto.ReportStatusUpdateRequest;
import com.medkura.service.ReportService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/reports")
@Validated
public class ReportController {
  private final ReportService reportService;

  public ReportController(ReportService reportService) {
    this.reportService = reportService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ReportCreateResponse createReport(
      Authentication authentication,
      @RequestParam @NotBlank String name,
      @RequestParam @NotBlank String type,
      @RequestParam @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate reportDate,
      @RequestParam MultipartFile file) {
    return reportService.createReport(authentication.getName(), name, type, reportDate, file);
  }

  @GetMapping
  public List<ReportListItem> listReports(Authentication authentication) {
    return reportService.listReports(authentication.getName());
  }

  @GetMapping("/{id}")
  public ReportDetailResponse getReport(Authentication authentication, @PathVariable Long id) {
    return reportService.getReport(authentication.getName(), id);
  }

  @PatchMapping("/{id}/status")
  public ReportDetailResponse updateStatus(
      Authentication authentication,
      @PathVariable Long id,
      @Valid @RequestBody ReportStatusUpdateRequest request) {
    return reportService.updateStatus(authentication.getName(), id, request.getStatus(), request.getSummary());
  }
}
