import express from 'express'
import cors from 'cors'
import { setGlobalOptions } from 'express-zod-safe'
import { globalErrorHandler, zodDefaultErrorHandler } from './src/middleware/common/errors'
import boardsRouter from './src/routers/boards'
import tasksRouter from './src/routers/tasks'

const main = async () => {
  const app = express()

  setGlobalOptions({ handler: zodDefaultErrorHandler })

  app.use(express.json())
  app.use(
    cors({
      origin: true,
    })
  )
  app.use('/boards', boardsRouter)
  app.use('/tasks', tasksRouter)
  app.use(globalErrorHandler)

  app.listen(3000, () => {
    console.log('listening on port 3000')
  })
}

main()
