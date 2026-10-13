import axios from 'axios'
import { API_BASE_URL, BACKEND_URL } from '../config'

export { API_BASE_URL, BACKEND_URL }

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ticketflowToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        console.warn('Session expired. Redirecting to login.')
        localStorage.removeItem('ticketflowToken')
        localStorage.removeItem('ticketflowUser')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
