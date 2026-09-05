import loginResponse from '../../examples-frontend/auth/login.json'
import modulesResponse from '../../examples-frontend/modules/loadByUser.json'
import usersResponse from '../../examples-frontend/users/find.json'
import roleResponse from '../../examples-frontend/users/role.json'

export const mockResponses = {
  'POST /auth/login': loginResponse,
  'GET /modules/user': modulesResponse,
  'GET /users': usersResponse,
  'GET /users/me/role': roleResponse,
}
