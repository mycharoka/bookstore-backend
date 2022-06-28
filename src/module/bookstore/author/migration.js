const { logger } = require("../../../core/logger")

let migration = async client => {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS author(
        author_id serial PRIMARY KEY,
        name VARCHAR,
        pen_name VARCHAR,
        email VARCHAR,
        is_disabled BOOLEAN,
        created_time DATE,
        created_at TIMESTAMP WITHOUT TIME ZONE
      )`
    )
    logger.info(`author.migration: author database migration success`)
  } catch (error) {
    logger.error(`author.migration : ${error.message}`)
    console.error(error.message)
  }
}

module.exports = {migration}