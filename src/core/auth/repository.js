const { pool } = require("../database");

// const getAuth = async username => {
//   const text = "SELECT * FROM users WHERE username = $1";
//   const value = [username];

//   try {
//     const data = await pool.query(text, value);
//     return data.rows[0];
//   } catch (err) {
//     throw err;
//   }
// };

const getAuth = async email => {
  const text = "SELECT * FROM users WHERE email = $1";
  const value = [email];

  try {
    const data = await pool.query(text, value);
    return data.rows[0];
  } catch (err) {
    throw err;
  }
};

const getUser = async id => {
  console.log('user id > ', id);
  const text = "SELECT * FROM users WHERE id=$1";
  const value = [id];

  try {
    const data = await pool.query(text, value);
    return data.rows[0];
  } catch (err) {
    throw err;
  }
};

const checkUsername = async username => {
  const text = "SELECT * FROM users WHERE username=$1";
  const value = [username];

  try {
    const data = await pool.query(text, value);
    return data.rows[0];
  } catch (err) {
    throw err;
  }
};

const createUser = async (username, hashPassword, name, role, email) => {
  const text =
    "INSERT INTO users (username, password, name, role, email) VALUES($1, $2, $3, $4, $5) RETURNING *";
  const value = [username, hashPassword, name, role, email];

  try {
    const data = await pool.query(text, value);
    return data.rows[0];
  } catch (err) {
    throw err;
  }
};

const getPenName = async name => {
  const query = `
  select * from author as aut where lower(aut.name) = (select u.name from users as u where lower(u.name) = $1)
  `
  const values = [name]
  try {
    let result = await pool.query(query, values)
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAuth,
  getUser,
  checkUsername,
  createUser,
  getPenName
};
