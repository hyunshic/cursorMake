import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

interface AuthContextType {
  isAuthenticated: boolean
  username: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (username: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  // axios 기본 설정 (쿠키 포함)
  axios.defaults.withCredentials = true

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      setIsAuthenticated(true)
      setUsername(response.data)
    } catch (error) {
      setIsAuthenticated(false)
      setUsername(null)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      })
      
      if (response.data.success) {
        setIsAuthenticated(true)
        setUsername(response.data.username)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await axios.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsAuthenticated(false)
      setUsername(null)
    }
  }

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log('Register success:', response.data)
      return true
    } catch (error: any) {
      console.error('Register error:', error)
      console.error('Error response:', error.response)
      throw error // 에러를 다시 throw하여 상위에서 처리할 수 있도록
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
