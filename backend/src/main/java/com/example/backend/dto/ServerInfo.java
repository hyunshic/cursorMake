package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServerInfo {
    private int serverId;
    private String serverName;
    private double temperature; // 온도 (섭씨)
    private double cpuUsage; // CPU 사용률 (%)
    private String status; // 상태 (online, offline, warning)
}
