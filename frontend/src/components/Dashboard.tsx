import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './Header'
import Button from './common/Button'
import useButton from '../hooks/useButton'
import './Dashboard.css'

interface ServerInfo {
  serverId: number
  serverName: string
  temperature: number
  cpuUsage: number
  status: string
}

const Dashboard = () => {
  const [servers, setServers] = useState<ServerInfo[]>([])
  const [selectedServer, setSelectedServer] = useState<ServerInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServers()
    // 5초마다 서버 정보 갱신
    const interval = setInterval(fetchServers, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchServers = async () => {
    try {
      const response = await axios.get('/api/servers', {
        withCredentials: true
      })
      setServers(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch servers:', error)
      setLoading(false)
    }
  }

  const handleServerClick = async (serverId: number) => {
    try {
      const response = await axios.get(`/api/servers/${serverId}`, {
        withCredentials: true
      })
      setSelectedServer(response.data)
    } catch (error) {
      console.error('Failed to fetch server info:', error)
    }
  }

  const closeModal = () => {
    setSelectedServer(null)
  }

  const closeButton = useButton(closeModal)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#4caf50'
      case 'caution':
        return '#ff9800'
      case 'warning':
        return '#f44336'
      default:
        return '#9e9e9e'
    }
  }

  const getTemperatureColor = (temp: number) => {
    if (temp > 65) return '#f44336'
    if (temp > 50) return '#ff9800'
    return '#4caf50'
  }

  const getCpuColor = (cpu: number) => {
    if (cpu > 90) return '#f44336'
    if (cpu > 70) return '#ff9800'
    return '#4caf50'
  }

  // 서버를 6개 렉으로 나누기 (각 렉에 12개씩)
  const racks = []
  for (let i = 0; i < 6; i++) {
    racks.push(servers.slice(i * 12, (i + 1) * 12))
  }

  return (
    <div className="dashboard-container">
      <Header />
      
      <div className="dashboard-content">
        {loading ? (
          <div className="loading">서버 정보를 불러오는 중...</div>
        ) : (
          <div className="racks-container">
            {racks.map((rackServers, rackIndex) => (
              <div key={rackIndex} className="server-rack">
                <div className="rack-header">
                  <h2>서버 렉 #{rackIndex + 1}</h2>
                  <div className="rack-info">총 {rackServers.length}대의 서버</div>
                </div>
                <div className="rack-body">
                  {rackServers.map((server) => (
                    <div
                      key={server.serverId}
                      className="server-unit"
                      onClick={() => handleServerClick(server.serverId)}
                      style={{
                        borderColor: getStatusColor(server.status),
                        backgroundColor: server.status === 'warning' 
                          ? 'rgba(244, 67, 54, 0.1)' 
                          : server.status === 'caution'
                          ? 'rgba(255, 152, 0, 0.1)'
                          : 'rgba(76, 175, 80, 0.1)'
                      }}
                    >
                      <div className="server-number">{server.serverId}</div>
                      <div className="server-name">{server.serverName}</div>
                      <div 
                        className="server-status-indicator"
                        style={{ backgroundColor: getStatusColor(server.status) }}
                      ></div>
                      <div className="server-quick-info">
                        <span className="temp-badge" style={{ color: getTemperatureColor(server.temperature) }}>
                          {server.temperature}°C
                        </span>
                        <span className="cpu-badge" style={{ color: getCpuColor(server.cpuUsage) }}>
                          CPU {server.cpuUsage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedServer && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedServer.serverName} 상세 정보</h2>
              <Button className="close-button" {...closeButton}>×</Button>
            </div>
            <div className="modal-body">
              <div className="info-section">
                <div className="info-item">
                  <label>서버 ID:</label>
                  <span>{selectedServer.serverId}</span>
                </div>
                <div className="info-item">
                  <label>서버 이름:</label>
                  <span>{selectedServer.serverName}</span>
                </div>
                <div className="info-item">
                  <label>상태:</label>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedServer.status) }}
                  >
                    {selectedServer.status === 'online' ? '정상' : 
                     selectedServer.status === 'caution' ? '주의' : '경고'}
                  </span>
                </div>
                <div className="info-item">
                  <label>온도:</label>
                  <span 
                    className="temperature-value"
                    style={{ color: getTemperatureColor(selectedServer.temperature) }}
                  >
                    {selectedServer.temperature}°C
                  </span>
                </div>
                <div className="info-item">
                  <label>CPU 사용률:</label>
                  <div className="cpu-container">
                    <div className="cpu-bar-container">
                      <div 
                        className="cpu-bar"
                        style={{ 
                          width: `${selectedServer.cpuUsage}%`,
                          backgroundColor: getCpuColor(selectedServer.cpuUsage)
                        }}
                      ></div>
                    </div>
                    <span 
                      className="cpu-value"
                      style={{ color: getCpuColor(selectedServer.cpuUsage) }}
                    >
                      {selectedServer.cpuUsage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
