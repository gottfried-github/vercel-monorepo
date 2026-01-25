import { Router } from 'express'
import createMiddleware from '../../middleware/boards/create'
import updateMiddleware from '../../middleware/boards/update'
import deleteByIdMiddleware from '../../middleware/boards/deleteById'
import getByIdMiddleware from '../../middleware/boards/getById'
import createController from '../../controllers/boards/create'
import updateController from '../../controllers/boards/update'
import deleteByIdController from '../../controllers/boards/deleteById'
import getByIdController from '../../controllers/boards/getById'
import getAllController from '../../controllers/boards/getAll'

const boardsRouter = Router()

boardsRouter.post('/', createMiddleware, createController)
boardsRouter.patch('/:id', updateMiddleware, updateController)
boardsRouter.delete('/:id', deleteByIdMiddleware, deleteByIdController)
boardsRouter.get('/', getAllController)
boardsRouter.get('/:id', getByIdMiddleware, getByIdController)

export default boardsRouter
