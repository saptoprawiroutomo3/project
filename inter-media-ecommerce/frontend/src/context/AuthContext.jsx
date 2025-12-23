import { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token,
          user: JSON.parse(user),
        },
      })
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Validasi input
      if (!credentials.email || !credentials.password) {
        throw new Error('Email dan password harus diisi')
      }

      console.log('Attempting login with:', { email: credentials.email })
      
      const response = await authAPI.login(credentials)
      console.log('Login response:', response.data)
      
      const { token, user } = response.data

      if (!token || !user) {
        throw new Error('Invalid response from server')
      }

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user },
      })

      toast.success('Login berhasil!')
      return { success: true }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      
      console.error('Login error:', error)
      
      let message = 'Login gagal'
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        message = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
      } else if (error.response?.status === 401) {
        message = 'Email atau password salah'
      } else if (error.response?.status === 403) {
        message = 'Akun Anda belum diverifikasi'
      } else if (error.response?.data?.message) {
        message = error.response.data.message
      } else if (error.message) {
        message = error.message
      }
      
      toast.error(message)
      return { success: false, error: error.response?.data }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authAPI.register(userData)
      dispatch({ type: 'SET_LOADING', payload: false })
      toast.success('Registration successful! Please verify your email.')
      return { success: true, data: response.data }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: error.response?.data }
    }
  }

  const verifyOTP = async (otpData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authAPI.verifyOTP(otpData)
      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user },
      })

      toast.success('Email verified successfully!')
      return { success: true }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      const message = error.response?.data?.message || 'OTP verification failed'
      toast.error(message)
      return { success: false, error: error.response?.data }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully!')
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData)
      const updatedUser = response.data.user
      
      localStorage.setItem('user', JSON.stringify(updatedUser))
      dispatch({ type: 'UPDATE_USER', payload: updatedUser })
      
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      throw new Error(message)
    }
  }

  const value = {
    ...state,
    login,
    register,
    verifyOTP,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
