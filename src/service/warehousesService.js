import { apiService } from './apiService'

class WarehousesService {
  findAll() {
    return apiService.request('GET', '/warehouses/findAll', undefined, { moduleMainId: 'MOD_WAREHOUSES' })
  }
}

export const warehousesService = new WarehousesService()
export { WarehousesService }
