import { apiService } from './apiService'

const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

class StatusesService {
  constructor(cacheTtlMs = DEFAULT_CACHE_TTL_MS) {
    this.cacheTtlMs = cacheTtlMs
    this.cachedData = null
    this.lastFetched = 0
    this.inFlightPromise = null
  }

  async getAll(forceRefresh = false) {
    const now = Date.now()
    if (!forceRefresh && this.cachedData && now - this.lastFetched < this.cacheTtlMs) {
      return this.cachedData
    }

    if (this.inFlightPromise) {
      return this.inFlightPromise
    }

    this.inFlightPromise = (async () => {
      try {
        const response = await apiService.request('GET', '/statuses')
        this.cachedData = response
        this.lastFetched = Date.now()
        return response
      } finally {
        this.inFlightPromise = null
      }
    })()

    return this.inFlightPromise
  }

  clearCache() {
    this.cachedData = null
    this.lastFetched = 0
  }
}

export const statusesService = new StatusesService()
export { StatusesService }
