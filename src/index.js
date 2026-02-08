const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const dotenv = require('dotenv')

const { loadConfig } = require('./config/config')
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware')
const apiRouter = require('./routes')

dotenv.config()

const app = express()
const config = loadConfig()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: config.env })
})

app.use('/api', apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${config.port} in ${config.env} mode`)
})


