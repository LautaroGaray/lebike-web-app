import { apiService } from './apiService'

class ReceiptsService {
  findAll() {
    return apiService.request('GET', '/receipts/findAll', undefined, { moduleMainId: 'MOD_RECEIPTS' })
  }

  findByUserAndWarehouse(payload) {
    return apiService.request('POST', '/receipts/findByUserAndWarehouse', payload, { moduleMainId: 'MOD_RECEIPTS' })
  }

  register(payload) {
    return apiService.request('POST', '/receipts/register', payload, { moduleMainId: 'MOD_RECEIPTS' })
  }

  edit(payload) {
    return apiService.request('POST', '/receipts/edit', payload, { moduleMainId: 'MOD_RECEIPTS' })
  }

  delete(payload) {
    return apiService.request('POST', '/receipts/delete', payload, { moduleMainId: 'MOD_RECEIPTS' })
  }

  history(payload) {
    return apiService.request('POST', '/receipts/history', payload, { moduleMainId: 'MOD_RECEIPTS' })
  }
}

export const receiptsService = new ReceiptsService()
export { ReceiptsService }
