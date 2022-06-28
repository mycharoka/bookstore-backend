const { logger } = require("../../../core/logger")

let migration = async client => {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS book(
        book_id serial PRIMARY KEY, 
        title VARCHAR, 
        author_id INTEGER, 
        summary VARCHAR,
        stock INTEGER,
        price INTEGER,
        cover_url VARCHAR,
        created_time DATE,
        created_at TIMESTAMP WITHOUT TIME ZONE
        )
      `
    )
    logger.info(`book.migration: book database migration success!`)
  } catch (error) {
    logger.error(`book.migration : ${error.message}`)
    console.error(error.message)
  }
}

module.exports = {migration}