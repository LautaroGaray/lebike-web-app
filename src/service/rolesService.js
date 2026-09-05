import { apiService } from './apiService'

class RolesService {
  findCurrentUserRole() {
    return apiService.request('GET', '/users/me/role')
  }
}

export const rolesService = new RolesService()
export { RolesService }
