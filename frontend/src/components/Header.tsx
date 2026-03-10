import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './common/Button'
import useButton from '../hooks/useButton'
import './Header.css'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { username, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const dashboardButton = useButton(() => navigate('/'))
  const statsButton = useButton(() => navigate('/stats'))
  const workButton = useButton(() => navigate('/work'))
  const logoutButton = useButton(handleLogout)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="app-header">
      <div className="header-left">
        <h1 className="header-logo">서버 모니터링</h1>
        <nav className="header-nav">
          <Button
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
            {...dashboardButton}
          >
            대시보드
          </Button>
          <Button
            className={`nav-item ${isActive('/stats') ? 'active' : ''}`}
            {...statsButton}
          >
            전송통계
          </Button>
          <Button
            className={`nav-item ${isActive('/work') ? 'active' : ''}`}
            {...workButton}
          >
            작업관리
          </Button>
        </nav>
      </div>
      <div className="header-right">
        <span className="user-name">안녕하세요, <strong>{username}</strong>님!</span>
        <Button className="logout-button" {...logoutButton}>
          로그아웃
        </Button>
      </div>
    </div>
  )
}

export default Header
