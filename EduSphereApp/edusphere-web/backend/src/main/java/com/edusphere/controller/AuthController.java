package com.edusphere.controller;

import com.edusphere.config.JwtAuthFilter.UserPrincipal;
import com.edusphere.config.JwtUtils;
import com.edusphere.dto.AuthResponse;
import com.edusphere.dto.LoginRequest;
import com.edusphere.dto.RegisterRequest;
import com.edusphere.dto.UserDto;
import com.edusphere.model.User;
import com.edusphere.model.UserProgress;
import com.edusphere.repository.UserProgressRepository;
import com.edusphere.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(
            UserRepository userRepository,
            UserProgressRepository userProgressRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils
    ) {
        this.userRepository = userRepository;
        this.userProgressRepository = userProgressRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        Optional<User> existing = userRepository.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email already registered");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        String role = request.getEmail().equals("admin") ? "admin" : "student";
        
        User user = new User(request.getName(), request.getEmail(), hashedPassword, role);
        userRepository.save(user);

        // Initialize progress
        UserProgress progress = new UserProgress(user.getId());
        userProgressRepository.save(progress);

        String token = jwtUtils.generateToken(user.getId(), user.getName(), user.getEmail(), user.getRole());
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());

        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, userDto));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        // 1. Admin local check backup matching Android
        if (email.equals("admin") && password.equals("1234")) {
            Optional<User> adminOpt = userRepository.findByEmail("admin");
            User admin;
            if (adminOpt.isEmpty()) {
                String hashedPassword = passwordEncoder.encode("1234");
                admin = new User("Administrator", "admin", hashedPassword, "admin");
                userRepository.save(admin);
                
                UserProgress progress = new UserProgress(admin.getId());
                userProgressRepository.save(progress);
            } else {
                admin = adminOpt.get();
            }

            String token = jwtUtils.generateToken(admin.getId(), admin.getName(), admin.getEmail(), admin.getRole());
            UserDto userDto = new UserDto(admin.getId(), admin.getName(), admin.getEmail(), admin.getRole());
            return ResponseEntity.ok(new AuthResponse(token, userDto));
        }

        // 2. Standard login
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid credentials. User does not exist.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid password");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        String token = jwtUtils.generateToken(user.getId(), user.getName(), user.getEmail(), user.getRole());
        UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(token, userDto));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        Object principalObj = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principalObj instanceof UserPrincipal) {
            UserPrincipal principal = (UserPrincipal) principalObj;
            Optional<User> userOpt = userRepository.findById(principal.getId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, Object> body = new HashMap<>();
                body.put("id", user.getId());
                body.put("name", user.getName());
                body.put("email", user.getEmail());
                body.put("role", user.getRole());
                body.put("created_at", user.getCreatedAt());
                return ResponseEntity.ok(body);
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
