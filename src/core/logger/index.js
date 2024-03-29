const moment = require('moment')
const { createLogger, format, transports } = require('winston')
const { combine, printf } = format
const { log: logConfigs, isTest } = require('../configs')

const myFormat = printf(info => {
  return `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${info.level}: ${JSON.stringify(info.message)}`;
})

const logger = createLogger({
  format: combine(
    myFormat
  ),
  transports: [
    new transports.File({
      filename: `${logConfigs.dir}/error.log`,
      level: 'error'
    }),
    new transports.File({
      filename: `${logConfigs.dir}/access.log`
    }),
    new transports.Console(),
  ],
  silent: isTest()
})

const logTrafic = (req, res, next) => {
  logger.info({
    method: req.method,
    endpoint: req.originalUrl,
  });
  next();
}

module.exports = {
  logger,
  logTrafic,
}
