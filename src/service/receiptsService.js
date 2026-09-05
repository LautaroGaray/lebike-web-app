import { apiService } from './apiService'

class ReceiptsService {
  findAll(payload) {
    return apiService.request('POST', '/receipts/findAll', payload)
  }

  findByUserAndWarehouse(payload) {
    return apiService.request('POST', '/receipts/findByUserAndWarehouse', payload)
  }

  register(payload) {
    return apiService.request('POST', '/receipts/register', payload)
  }

  edit(payload) {
    return apiService.request('POST', '/receipts/edit', payload)
  }

  delete(payload) {
    return apiService.request('POST', '/receipts/delete', payload)
  }

  history(payload) {
    return apiService.request('POST', '/receipts/history', payload)
  }
}

export const receiptsService = new ReceiptsService()
export { ReceiptsService }
