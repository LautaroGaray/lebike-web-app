import loginResponse from '../../examples-frontend/auth/login.json'
import modulesResponse from '../../examples-frontend/modules/loadByUser.json'
import usersResponse from '../../examples-frontend/users/find.json'
import roleResponse from '../../examples-frontend/users/role.json'
import warehousesResponse from '../../examples-frontend/warehouses/findAll.json'
import receiptsListResponse from '../../examples-frontend/receipts/findAll.json'
import receiptRegisterResponse from '../../examples-frontend/receipts/register.json'
import receiptEditResponse from '../../examples-frontend/receipts/edit.json'
import receiptDeleteResponse from '../../examples-frontend/receipts/delete.json'
import receiptHistoryResponse from '../../examples-frontend/receipts/history.json'
import statusesResponse from '../../examples-frontend/statuses/statuses.json'

export const mockResponses = {
  'POST /auth/login': loginResponse,
  'POST /modules/loadByUser': modulesResponse,
  'GET /users': usersResponse,
  'GET /users/me/role': roleResponse,
  'GET /warehouses/findAll': warehousesResponse,
  'GET /statuses': statusesResponse,
  'GET /receipts/findAll': receiptsListResponse,
  'POST /receipts/register': receiptRegisterResponse,
  'POST /receipts/edit': receiptEditResponse,
  'POST /receipts/delete': receiptDeleteResponse,
  'POST /receipts/history': receiptHistoryResponse,
}
