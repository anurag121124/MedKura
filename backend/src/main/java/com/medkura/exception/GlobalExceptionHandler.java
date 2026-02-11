package com.medkura.exception;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
  private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<Map<String, Object>> handleApiException(ApiException ex) {
    return buildError(ex.getStatus(), ex.getMessage());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
    Map<String, Object> details = new HashMap<>();
    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
      details.put(error.getField(), error.getDefaultMessage());
    }
    Map<String, Object> body = new HashMap<>();
    body.put("timestamp", Instant.now());
    body.put("status", HttpStatus.BAD_REQUEST.value());
    body.put("error", "Validation failed");
    body.put("details", details);
    return ResponseEntity.badRequest().body(body);
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
    return buildError(HttpStatus.UNAUTHORIZED.value(), "Invalid credentials");
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
    return buildError(HttpStatus.FORBIDDEN.value(), "Access denied");
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleUnexpected(Exception ex) {
    logger.error("Unexpected error", ex);
    Map<String, Object> body = buildErrorBody(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Unexpected error");
    body.put("details", ex.getMessage());
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }

  private ResponseEntity<Map<String, Object>> buildError(int status, String message) {
    return ResponseEntity.status(status).body(buildErrorBody(status, message));
  }

  private Map<String, Object> buildErrorBody(int status, String message) {
    Map<String, Object> body = new HashMap<>();
    body.put("timestamp", Instant.now());
    body.put("status", status);
    body.put("error", message);
    return body;
  }
}
