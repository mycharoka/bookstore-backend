require('dotenv').config()
const { Client } = require('pg')

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
})

module.exports = {
  client
}