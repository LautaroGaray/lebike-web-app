import { apiService } from './apiService'

class UsersService {
  findAll() {
    return apiService.request('GET', '/users')
  }
}

export const usersService = new UsersService()
export { UsersService }