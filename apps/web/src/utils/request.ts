import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
})

service.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

service.interceptors.response.use(
  (config) => {
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

export { service as request }

export default service
