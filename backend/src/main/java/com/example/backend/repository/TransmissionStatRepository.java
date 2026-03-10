package com.example.backend.repository;

import com.example.backend.entity.TransmissionStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransmissionStatRepository extends JpaRepository<TransmissionStat, Long> {
    Optional<TransmissionStat> findByStatDate(LocalDate statDate);
    List<TransmissionStat> findByStatDateBetween(LocalDate from, LocalDate to);
}
