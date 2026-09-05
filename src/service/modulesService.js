import { apiService } from './apiService'

class ModulesService {
  findByUser(email) {
    return apiService.request('POST', '/modules/loadByUser', { email })
  }
}

export const modulesService = new ModulesService()
export { ModulesService }