const fs = require('fs')
// const imagePath = require('./images')
const repo = require('./repository')
const authorRepo = require('../author/repository');
const authRepo = require('../../../core/auth/repository')
const { app } = require('../../../core/configs');

const addBook = async (title, summary, price, stock, cover, extension, user) => {

  let buffer = Buffer.from(cover, "base64")

  let filename = `${title.toLowerCase().split(' ').join('_')}.${extension}`
  // console.log('filename > ', filename);

  let saveFile = fs.writeFileSync('images/'+ filename, buffer, (error) => {
    if (error) {
      throw error
      console.log('DONE!');
    }
  })

  // let readFile = fs.readFile(filename, (error, data) => {
  //   console.log('readfile data> ',data)
  // })

  let saveCoverFormat = `${app.url}${app.port}/img/${filename}`
  console.log('format cover > ', saveCoverFormat);
  try {
    const validateUser = await authRepo.getUser(user)
    console.log('validate user > ', validateUser);
    const validateAuthorID = await authRepo.getPenName(validateUser.name)
    console.log('author ID > ', validateAuthorID);

    let insertBookData = await repo.insertBook(title, validateAuthorID.author_id, summary, stock, price, saveCoverFormat)

    if (insertBookData == "success") {
      return {
        status_code: 200,
        data: {
          message: "Success"
        }
      }
    }
  } catch (error) {
    return {
      status_code: 200,
      data: {
        message: "Failed",
        error_key: "error_internal_server",
        error_message: "Internal Server Error",
        erro_data: {
          result: "Internal Server Error"
        }
      }
    }
  }
}

const getBook = async (id) => {
  try {
    const selectBookByID = await repo.getBookByID(id)
    
    if (selectBookByID == undefined) {
      return {
        status_code: 200,
        data: {
          message: "Failed",
          error_key: "error_id_not_found",
          error_message: "Book ID Not Found",
          error_data: {
            result: `Book ID Number: ${id} Not Found`
          }
        }
      }
    }

    const getAuthorData = await authorRepo.getAuthor(selectBookByID.author_id)

    return {
      status_code: 200,
      data: {
        message: "Success",
        data: {
          Book_ID: id,
          Author_ID: selectBookByID.author_id,
          Title: selectBookByID.title,
          Summary: selectBookByID.summary,
          Price: selectBookByID.price,
          Stock: selectBookByID.stock,
          Cover_URL: selectBookByID.cover_url,
          Author_Pen_Name: getAuthorData.pen_name
        }
      }
    }
  } catch (error) {
    return {
      status_code: 200,
      data: {
        message: "Failed",
        error_key: "error_internal_server",
        error_message: "Internal Server Error",
        erro_data: {
          result: "Internal Server Error"
        }
      }
    }
  }
}

const updateBookByID = async (id, title, summary, price, stock) => {
  try {
    const selectBookByID = await repo.getBookByID(id)
    
    if (selectBookByID == undefined) {
      return {
        status_code: 200,
        data: {
          message: "Failed",
          error_key: "error_id_not_found",
          error_message: "Book ID Not Found",
          error_data: {
            result: `Book ID Number: ${id} Not Found`
          }
        }
      }
    }

    const updateBookData = await repo.updateBook(title, summary, price, stock, id)
    return {
      status_code: 200,
      data: {
        message: "Success"
      }
    }
  } catch (error) {
    return {
      status_code: 200,
      data: {
        message: "Failed",
        error_key: "error_internal_server",
        error_message: "Internal Server Error",
        erro_data: {
          result: "Internal Server Error"
        }
      }
    }
  }
}

module.exports = {addBook, getBook, updateBookByID}