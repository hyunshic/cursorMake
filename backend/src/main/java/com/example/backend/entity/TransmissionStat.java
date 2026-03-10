package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "transmission_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransmissionStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate statDate;

    @Column(nullable = false)
    private int successCount;

    @Column(nullable = false)
    private int failCount;

    @Column(nullable = false)
    private int totalCount;
}
