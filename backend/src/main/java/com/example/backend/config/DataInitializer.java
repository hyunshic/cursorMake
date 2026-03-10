package com.example.backend.config;

import com.example.backend.entity.TransmissionStat;
import com.example.backend.entity.User;
import com.example.backend.repository.TransmissionStatRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Random;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final TransmissionStatRepository transmissionStatRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @SuppressWarnings("null")
    public CommandLineRunner initDefaultUser() {
        return args -> {
            if (!userRepository.existsByUsername("test")) {
                User user = User.builder()
                        .username("test")
                        .password(passwordEncoder.encode("1234"))
                        .email("")
                        .role(User.Role.USER)
                        .build();
                userRepository.save(user);
            }

            if (transmissionStatRepository.count() == 0) {
                Random random = new Random(42);
                LocalDate today = LocalDate.now();
                for (int i = 0; i < 14; i++) {
                    LocalDate date = today.minusDays(i);
                    int total = 1000 + random.nextInt(800);
                    int fail = 50 + random.nextInt(150);
                    int success = Math.max(0, total - fail);

                    TransmissionStat stat = TransmissionStat.builder()
                            .statDate(date)
                            .totalCount(total)
                            .successCount(success)
                            .failCount(fail)
                            .build();
                    transmissionStatRepository.save(stat);
                }
            }
        };
    }
}
