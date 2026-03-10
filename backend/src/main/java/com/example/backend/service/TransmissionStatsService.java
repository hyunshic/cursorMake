package com.example.backend.service;

import com.example.backend.dto.TransmissionStatsResponse;
import com.example.backend.entity.TransmissionStat;
import com.example.backend.repository.TransmissionStatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransmissionStatsService {

    private final TransmissionStatRepository transmissionStatRepository;

    public TransmissionStatsResponse getStats(LocalDate from, LocalDate to) {
        if (from == null || to == null) {
            return TransmissionStatsResponse.builder()
                    .total(0)
                    .success(0)
                    .fail(0)
                    .build();
        }

        LocalDate start = from.isAfter(to) ? to : from;
        LocalDate end = from.isAfter(to) ? from : to;

        List<TransmissionStat> stats = transmissionStatRepository.findByStatDateBetween(start, end);

        int total = stats.stream().mapToInt(TransmissionStat::getTotalCount).sum();
        int success = stats.stream().mapToInt(TransmissionStat::getSuccessCount).sum();
        int fail = stats.stream().mapToInt(TransmissionStat::getFailCount).sum();

        return TransmissionStatsResponse.builder()
                .total(total)
                .success(success)
                .fail(fail)
                .build();
    }
}
