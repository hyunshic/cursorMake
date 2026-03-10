import { useMemo, useState } from 'react'
import axios from 'axios'
import Header from './Header'
import Button from './common/Button'
import useButton from '../hooks/useButton'
import './TransmissionStats.css'

type StatsResult = {
  total: number
  success: number
  fail: number
}

const getStartOfToday = () => {
  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  return start
}

const toDateTimeLocal = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const EMPTY_STATS: StatsResult = {
  total: 0,
  success: 0,
  fail: 0,
}

const TransmissionStats = () => {
  const initialFrom = useMemo(() => getStartOfToday(), [])
  const initialTo = useMemo(() => new Date(), [])

  const [fromValue, setFromValue] = useState(toDateTimeLocal(initialFrom))
  const [toValue, setToValue] = useState(toDateTimeLocal(initialTo))
  const [mode, setMode] = useState<'1d' | '3d' | '1w' | 'custom'>('1d')
  const [stats, setStats] = useState<StatsResult>(EMPTY_STATS)

  const setRange = (hours: number) => {
    const to = new Date()
    const from = new Date(to)
    from.setHours(to.getHours() - hours)
    setFromValue(toDateTimeLocal(from))
    setToValue(toDateTimeLocal(to))
  }

  const handlePreset = (preset: '1d' | '3d' | '1w' | 'custom') => {
    setMode(preset)
    if (preset === '1d') {
      setRange(24)
    } else if (preset === '3d') {
      setRange(72)
    } else if (preset === '1w') {
      setRange(168)
    }
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get('/api/transmission-stats', {
        params: {
          from: fromValue,
          to: toValue,
        },
        withCredentials: true,
      })
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch transmission stats:', error)
      setStats(EMPTY_STATS)
    }
  }

  const preset1dButton = useButton(() => handlePreset('1d'))
  const preset3dButton = useButton(() => handlePreset('3d'))
  const preset1wButton = useButton(() => handlePreset('1w'))
  const presetCustomButton = useButton(() => handlePreset('custom'))
  const searchButton = useButton(handleSearch)

  const successRate = stats.total ? (stats.success / stats.total) * 100 : 0
  const failRate = stats.total ? (stats.fail / stats.total) * 100 : 0

  return (
    <div className="stats-container">
      <Header />

      <div className="stats-content">
        <div className="stats-card search-card">
          <div className="stats-card-header">
            <h2>검색조건</h2>
          </div>
          <div className="stats-card-body">
            <div className="filter-row">
              <div className="filter-label">승인시간</div>
              <div className="filter-controls">
                <input
                  type="datetime-local"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  className="date-input"
                />
                <span className="date-separator">~</span>
                <input
                  type="datetime-local"
                  value={toValue}
                  onChange={(e) => setToValue(e.target.value)}
                  className="date-input"
                />
                <Button
                  className={`preset-btn ${mode === '1d' ? 'active' : ''}`}
                  {...preset1dButton}
                >
                  최근1일
                </Button>
                <Button
                  className={`preset-btn ${mode === '3d' ? 'active' : ''}`}
                  {...preset3dButton}
                >
                  최근3일
                </Button>
                <Button
                  className={`preset-btn ${mode === '1w' ? 'active' : ''}`}
                  {...preset1wButton}
                >
                  최근1주일
                </Button>
                <Button
                  className={`preset-btn ${mode === 'custom' ? 'active' : ''}`}
                  {...presetCustomButton}
                >
                  직접입력
                </Button>
              </div>
            </div>
            <div className="filter-actions">
              <Button className="search-btn" {...searchButton}>
                조회
              </Button>
            </div>
          </div>
        </div>

        <div className="stats-card result-card">
          <div className="stats-card-header">
            <h2>검색결과</h2>
          </div>
          <div className="stats-card-body">
            <div className="result-grid">
              <div className="result-item success">
                <div className="result-label">성공</div>
                <div className="result-value">{stats.success.toLocaleString()}</div>
              </div>
              <div className="result-item total">
                <div className="result-label">합계</div>
                <div className="result-value">{stats.total.toLocaleString()}</div>
              </div>
              <div className="result-item fail">
                <div className="result-label">실패</div>
                <div className="result-value">{stats.fail.toLocaleString()}</div>
              </div>
            </div>

            <div className="rate-section">
              <div className="rate-row">
                <div className="rate-label">성공율</div>
                <div className="rate-bar">
                  <div
                    className="rate-bar-fill success"
                    style={{ width: `${successRate}%` }}
                  />
                </div>
                <div className="rate-value">{successRate.toFixed(2)}%</div>
              </div>
              <div className="rate-row">
                <div className="rate-label">실패율</div>
                <div className="rate-bar">
                  <div
                    className="rate-bar-fill fail"
                    style={{ width: `${failRate}%` }}
                  />
                </div>
                <div className="rate-value">{failRate.toFixed(2)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransmissionStats
