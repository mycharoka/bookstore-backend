require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const { isDev } = require('./core/configs')
const { logTrafic } = require('./core/logger')
const { registerRoute } = require('./router')

// middleware
const errorHandler = (err, req, res, next) => {
  return res.status(500).json({ msg: 'Something happend, please check your request.' })
}

const createApp = () => {
  const app = express();
  app.disable('x-powered-by')

  app.use(bodyParser.json())
  app.use(cors())

  app.use('/img', express.static('images'))

  if (!isDev()) {
    app.use(errorHandler)
  }

  app.use(logTrafic)
  registerRoute(app)

  return app
}

module.exports = {
  createApp
}