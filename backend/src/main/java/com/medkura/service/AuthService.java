package com.medkura.service;

import com.medkura.config.JwtUtils;
import com.medkura.dto.AuthRequest;
import com.medkura.dto.AuthResponse;
import com.medkura.dto.RegisterRequest;
import com.medkura.entity.User;
import com.medkura.exception.ValidationException;
import com.medkura.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtUtils jwtUtils;

  public AuthService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JwtUtils jwtUtils) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtUtils = jwtUtils;
  }

  public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new ValidationException("Email is already registered");
    }
    User user = new User();
    user.setEmail(request.getEmail().toLowerCase());
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    userRepository.save(user);
    String token = jwtUtils.generateToken(user.getEmail());
    return new AuthResponse(token, user.getEmail());
  }

  public AuthResponse login(AuthRequest request) {
    String normalizedEmail = request.getEmail().toLowerCase();
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword()));
    String token = jwtUtils.generateToken(normalizedEmail);
    return new AuthResponse(token, normalizedEmail);
  }
}
