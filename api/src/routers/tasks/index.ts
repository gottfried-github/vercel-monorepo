import { Router, type RequestHandler } from 'express'
import { type CreateTaskRequest } from '../../middleware/tasks/create'
import createMiddleware from '../../middleware/tasks/create'
import updateMiddleware from '../../middleware/tasks/update'
import deleteByIdMiddleware from '../../middleware/tasks/deleteById'
import getManyMiddleware from '../../middleware/tasks/getMany'
import orderMiddleware from '../../middleware/tasks/order'
import createController from '../../controllers/tasks/create'
import updateController from '../../controllers/tasks/update'
import deleteByIdController from '../../controllers/tasks/deleteById'
import getManyController from '../../controllers/tasks/getMany'
import orderController from '../../controllers/tasks/order'

const tasksRouter = Router()

tasksRouter.patch('/order', orderMiddleware, orderController)
tasksRouter.post(
  '/',
  // have to cast this as it complaints about req.query type
  createMiddleware as unknown as RequestHandler,
  createController as RequestHandler<unknown, unknown, CreateTaskRequest['body'], unknown>
)
tasksRouter.patch('/:id', updateMiddleware, updateController)
tasksRouter.delete('/:id', deleteByIdMiddleware, deleteByIdController)
tasksRouter.get(
  '/',
  (req, res, next) => {
    console.log('GET /tasks - req.query:', req.query)
    next()
  },
  getManyMiddleware as unknown as RequestHandler,
  getManyController as unknown as RequestHandler
)

export default tasksRouter
