import express from 'express'

const main = () => {
  const app = express()

  app.get('/hello', (req, res) => {
    return res.json({ message: 'Hello World' })
  })

  app.listen(3000, () => {
    console.log('listening on port 3000')
  })
}

main()
