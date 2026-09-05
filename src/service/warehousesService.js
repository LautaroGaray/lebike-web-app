import { apiService } from './apiService'

class WarehousesService {
  findAll() {
    return apiService.request('GET', '/warehouses')
  }
}

export const warehousesService = new WarehousesService()
export { WarehousesService }
