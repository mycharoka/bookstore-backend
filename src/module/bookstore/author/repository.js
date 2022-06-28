const { pool } = require("../../../core/database")

const createAuthor = async (name, penName, email) => {
  const query = `
    INSERT INTO author (name, pen_name, email, is_disabled, created_time, created_at)
    VALUES ($1, $2, $3, 'false', current_date, current_timestamp::timestamp(0))
  `
  const values = [name, penName, email]
  try {
    let result = await pool.query(query, values)
    return 'success'
  } catch (error) {
    throw error
  }
}

const createUser = async (name, email, password) => {
  console.log(name);
  const query = `
    INSERT INTO users (username, name, email, password, role)
    VALUES ($1, $2, $3, $4,'author')
    RETURNING *
  `
  const values = [name.replace(/\s/g, '').toLowerCase(), name, email, password]
  try {
    let result = await pool.query(query, values)
    return result.rows[0]
  } catch (error) {
    console.log('error create user > ', error);
    throw error
  }
}

const updatePassword = async (userId, newPassword) => {
  const query = `
    UPDATE users
    SET password = $1
    WHERE id = $2
    RETURNING *
  `
  const values = [newPassword, userId]
  try {
    let result = await pool.query(query, values)
    return 'updated'
  } catch (error) {
    throw error
  }
}

const updatePassWithEmail = async (email, password) => {
  const query = `
    UPDATE users
    SET password = $1
    WHERE email = $2
    RETURNING *
  `
  const values = [password, email]
  console.log(values);
  try {
    let result = await pool.query(query, values)
    return 'updated'
  } catch (error) {
    throw error
  }
}

const updateAuthor = async (name, penName) => {
  
}

const getAuthor = async id => {
  const query = `
    SELECT * FROM author where author_id = $1
  `
  const values = [id]
  try {
    let result = await pool.query(query, values)
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

module.exports = {createAuthor, createUser, updatePassword, updatePassWithEmail, getAuthor}