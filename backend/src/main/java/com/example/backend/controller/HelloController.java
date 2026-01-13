package com.example.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/hello")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@PreAuthorize("isAuthenticated()")
public class HelloController {

    @GetMapping
    public Map<String, String> hello() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "안녕하세요! Spring Boot 백엔드에서 온 메시지입니다.");
        return response;
    }
}
