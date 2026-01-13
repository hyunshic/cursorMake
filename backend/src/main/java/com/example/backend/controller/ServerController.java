package com.example.backend.controller;

import com.example.backend.dto.ServerInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/servers")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@PreAuthorize("isAuthenticated()")
public class ServerController {
    
    private final Random random = new Random();
    
    @GetMapping
    public ResponseEntity<List<ServerInfo>> getAllServers() {
        List<ServerInfo> servers = new ArrayList<>();
        
        for (int i = 1; i <= 72; i++) {
            double temperature = 30 + random.nextDouble() * 40; // 30-70도
            double cpuUsage = random.nextDouble() * 100; // 0-100%
            String status = determineStatus(temperature, cpuUsage);
            
            servers.add(ServerInfo.builder()
                    .serverId(i)
                    .serverName("Server-" + String.format("%02d", i))
                    .temperature(Math.round(temperature * 10.0) / 10.0)
                    .cpuUsage(Math.round(cpuUsage * 10.0) / 10.0)
                    .status(status)
                    .build());
        }
        
        return ResponseEntity.ok(servers);
    }
    
    @GetMapping("/{serverId}")
    public ResponseEntity<ServerInfo> getServerInfo(@PathVariable int serverId) {
        if (serverId < 1 || serverId > 72) {
            return ResponseEntity.notFound().build();
        }
        
        double temperature = 30 + random.nextDouble() * 40;
        double cpuUsage = random.nextDouble() * 100;
        String status = determineStatus(temperature, cpuUsage);
        
        ServerInfo server = ServerInfo.builder()
                .serverId(serverId)
                .serverName("Server-" + String.format("%02d", serverId))
                .temperature(Math.round(temperature * 10.0) / 10.0)
                .cpuUsage(Math.round(cpuUsage * 10.0) / 10.0)
                .status(status)
                .build();
        
        return ResponseEntity.ok(server);
    }
    
    private String determineStatus(double temperature, double cpuUsage) {
        if (temperature > 65 || cpuUsage > 90) {
            return "warning";
        } else if (temperature > 50 || cpuUsage > 70) {
            return "caution";
        } else {
            return "online";
        }
    }
}
