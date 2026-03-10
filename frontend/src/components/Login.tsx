import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './common/Button'
import useButton from '../hooks/useButton'
import './Login.css'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const success = await login(username, password)
        if (success) {
          navigate('/')
        } else {
          setError('로그인에 실패했습니다. 사용자명과 비밀번호를 확인해주세요.')
        }
      } else {
        try {
          const success = await register(username, password)
          if (success) {
            setError('')
            alert('회원가입이 완료되었습니다. 로그인해주세요.')
            setIsLogin(true)
            setPassword('') // 회원가입 후 패스워드 초기화
            setUsername('') // 사용자명도 초기화
          }
        } catch (err: any) {
          const errorMessage = err.response?.data || err.message || '회원가입에 실패했습니다.'
          setError(typeof errorMessage === 'string' ? errorMessage : '회원가입에 실패했습니다. 이미 존재하는 사용자명일 수 있습니다.')
        }
      }
    } catch (err: any) {
      setError(err.response?.data || '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const toggleButton = useButton(() => {
    setIsLogin(!isLogin)
    setError('')
  })

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isLogin ? '로그인' : '회원가입'}</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">사용자명</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="사용자명을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <Button type="submit" disabled={loading} className="submit-button">
            {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
          </Button>
        </form>

        <div className="toggle-form">
          <span>
            {isLogin ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
          </span>
          <Button className="toggle-button" {...toggleButton}>
            {isLogin ? '회원가입' : '로그인'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login
