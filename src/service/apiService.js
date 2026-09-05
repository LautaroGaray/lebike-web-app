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

    const module = options.moduleMainId
      ? authSession.modules.find((item) => item.mainId === options.moduleMainId)
      : options.bootstrapModuleMainId
    const moduleMainId = typeof module === 'string' ? module : module?.mainId
    const action = module?.permissions?.WRITE === true
      ? 'WRITE'
      : module?.permissions?.READ === true
        ? 'READ'
        : undefined
    if (options.moduleMainId && (!moduleMainId || !action)) {
      throw new Error('No se pudo resolver el módulo autorizado')
    }
    if (options.bootstrapModuleMainId && !moduleMainId) {
      throw new Error('No se pudo resolver el módulo autorizado')
    }

    if (method.toUpperCase() === 'POST' && path === '/auth/login' && body?.email === 'admin@local' && body?.password === 'admin1234') {
      console.log('POST /auth/login payload:', body)
    }

    const response = await fetch(`${this.config.apiBaseUrl}${path}`, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(authSession.token ? { Authorization: `Bearer ${authSession.token}` } : {}),
        ...(action ? { 'X-Action': action } : {}),
        ...(moduleMainId ? { 'X-Module-Main-Id': moduleMainId } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok || payload.isSuccess === false || payload.success === false) {
      const errorMessage = payload.message || `Request failed with status ${response.status}`
      if (errorMessage.includes('Missing required module id')) {
        console.error('Backend rejected the module context:', { method, path, status: response.status })
        throw new Error('No se pudo completar la operación. Intentá nuevamente.')
      }
      if (method.toUpperCase() === 'POST' && path === '/auth/login' && body?.email === 'admin@local' && body?.password === 'admin1234') {
        console.error('POST /auth/login failed:', { status: response.status, payload })
      }
      throw new Error(errorMessage)
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
