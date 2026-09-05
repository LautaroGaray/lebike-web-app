import { apiService } from './apiService'

class AuthService {
  login(credentials) {
    return apiService.request('POST', '/auth/login', credentials)
  }

  logout() {
    return apiService.request('POST', '/auth/logout', undefined, { headers: { 'X-Action': 'NONE' } })
  }
}

export const authService = new AuthService()
export { AuthService }