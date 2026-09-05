import { mockResponses } from './mockResponses'

const defaultConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
}

class ApiService {
  constructor(config = defaultConfig) {
    this.config = config
  }

  async request(method, path, body, options = {}) {
    const mockKey = `${method.toUpperCase()} ${path}`
    if (this.config.useMockApi && mockResponses[mockKey]) {
      return structuredClone(mockResponses[mockKey])
    }

    const response = await fetch(`${this.config.apiBaseUrl}${path}`, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(authSession.token ? { Authorization: `Bearer ${authSession.token}` } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok || payload.isSuccess === false) {
      throw new Error(payload.message || `Request failed with status ${response.status}`)
    }
    return payload
  }
}

const authSession = {
  token: null,
  user: null,
  roleName: null,
  modules: [],
}

export const session = {
  setAuthentication(token, user) {
    authSession.token = token
    authSession.user = user
    authSession.roleName = user?.roleName ?? null
  },
  getUser() {
    return authSession.user
  },
  isAuthenticated() {
    return Boolean(authSession.token)
  },
  getRole() {
    return authSession.roleName
  },
  // Permissions come only from the backend `/modules/loadByUser` response; kept out of React state so they cannot be tampered with via devtools component inspection.
  setModules(modules) {
    authSession.modules = Array.isArray(modules) ? modules : []
  },
  getModules() {
    return authSession.modules
  },
  getModulePermissions(mainId) {
    const module = authSession.modules.find((item) => item.mainId === mainId)
    return module?.permissions ?? { READ: false, WRITE: false }
  },
  clear() {
    authSession.token = null
    authSession.user = null
    authSession.roleName = null
    authSession.modules = []
  },
}

export const apiService = new ApiService()
export { ApiService }
