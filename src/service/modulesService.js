import { apiService } from './apiService'

class ModulesService {
  findByUser() {
    return apiService.request('GET', '/modules/user')
  }
}

export const modulesService = new ModulesService()
export { ModulesService }