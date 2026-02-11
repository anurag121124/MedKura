package com.medkura.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {
  private final SecretKey signingKey;
  private final long expirationMinutes;

  public JwtUtils(
      @Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.expirationMinutes}") long expirationMinutes) {
    this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(toBase64(secret)));
    this.expirationMinutes = expirationMinutes;
  }

  public String generateToken(String subject) {
    Instant now = Instant.now();
    Instant exp = now.plusSeconds(expirationMinutes * 60);
    return Jwts.builder()
      .subject(subject)
      .issuedAt(Date.from(now))
      .expiration(Date.from(exp))
      .signWith(signingKey)
        .compact();
  }

  public String getSubject(String token) {
    return parseClaims(token).getSubject();
  }

  public boolean isTokenValid(String token) {
    try {
      parseClaims(token);
      return true;
    } catch (Exception ex) {
      return false;
    }
  }

  private Claims parseClaims(String token) {
    return Jwts.parser()
        .verifyWith(signingKey)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  private String toBase64(String secret) {
    return java.util.Base64.getEncoder().encodeToString(secret.getBytes());
  }
}
