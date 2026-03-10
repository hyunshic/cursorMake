package com.example.backend.controller;

import com.example.backend.dto.TransmissionStatsResponse;
import com.example.backend.service.TransmissionStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@RestController
@RequestMapping("/api/transmission-stats")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class TransmissionStatsController {

    private final TransmissionStatsService transmissionStatsService;

    @GetMapping
    public TransmissionStatsResponse getStats(
            @RequestParam("from") String from,
            @RequestParam("to") String to
    ) {
        return transmissionStatsService.getStats(parseDate(from), parseDate(to));
    }

    private LocalDate parseDate(String value) {
        try {
            LocalDateTime dateTime = LocalDateTime.parse(value, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            return dateTime.toLocalDate();
        } catch (DateTimeParseException ex) {
            return null;
        }
    }
}
