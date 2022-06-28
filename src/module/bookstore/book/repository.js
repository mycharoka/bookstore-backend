const { pool } = require("../../../core/database")

const getBookByID = async id => {
  const query = `
    SELECT * FROM author WHERE book_id = $1
  `
  const values = [id]
  try {
    let result = await pool.query(query, values)
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

const insertBook = async (title, authorID, summary, stock, price, cover) => {
  const query = `
    INSERT INTO book(
      title,
      author_id,
      summary,
      stock,
      price,
      cover_url,
      created_time,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, current_date, current_timestamp::timestamp(0))
    RETURNING *
  `
  const values = [title, authorID, summary, stock, price, cover]
  return "success"
  try {
    let result = await pool.query(query, values)
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

const paginationBook = async (page, limit, title, authorID) => {
  let result = []
  let offset = 0

  if (limit && page) {
    offset = (page - 1) * limit
  }

  let data
  let values = [limit, offset]

  let sql = `SELECT book_id, author_id, title, summary, price, stock, cover_url FROM book `

  let count = sql
  let query = sql

  let sqlTitleSearch = `LIKE LOWER ('%${title}%')`

  let sqlAuthorIDSearch = `WHERE author_id = ${authorID}`

  let optSqlTitle = `WHERE LOWER (title) ${sqlTitleSearch} `

  let optionalAuthorID = sqlAuthorIDSearch
  let optionalTitle = optSqlTitle

  if (title || authorID) {
    count += optionalAuthorID
    query += optionalTitle 
    console.log('count > ', count);
    console.log('query > ', query);
  }
}

const updateBook = async (title, summary, price, stock, bookID) => {
  let result
  const query = `UPDATE book `
  const allHasValues = title.length > 0 && summary.length > 0
  const onlyTitleChange = title.length > 0
  const onlySummaryChange = summary.length > 0

  const allUpdate = [title, summary, price, stock, bookID]
  const titleUpdate = [title, price, stock, bookID]
  const summaryUpdate = [summary, price, stock, bookID]
  const priceORStockUpdate = [price, stock, bookID]

  try {
    if (allHasValues) {
      result += query + `SET title = $1, summary = $2, price = $3, stock = $4 WHERE book_id = $5`
      await pool.query(result, allUpdate)

    } else if (onlyTitleChange) {
      result += query + `SET title = $1, price = $2, stock = $3 WHERE book_id = $4`
      await pool.query(result, titleUpdate)

    } else if (onlySummaryChange) {
      result += query + `SET summary = $1, price = $2, stock = $3 WHERE book_id = $4`
      await pool.query(result, summaryUpdate)

    } else {
      result += query + `SET price = $1, stock = $1 WHERE book_id = $3`
      await pool.query(result, priceORStockUpdate)
    }
    
  } catch (error) {
    throw error
  }
}

module.exports = {getBookByID, insertBook, paginationBook, updateBook}