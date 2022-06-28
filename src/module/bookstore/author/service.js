const bcrypt = require('bcryptjs')

const repoAuth = require('../../../core/auth/repository')
const repo = require('./repository')

const registerAuthor = async (name, penName, email, password) => {
  try {
    // console.log('name author > ', name);
    const emailExist = await repoAuth.getAuth(email)
    console.log('email exist > ', emailExist);
    if (emailExist) {
      return {
        status_code: 200,
        data: {
          message: "Failed",
          error_key: "error_email_duplicate",
          error_message: "Email Duplicate",
          error_data: {
            result: `${email} Duplicate`
          }
        }
      }
    }

    const insertAuthor = await repo.createAuthor(name, penName, email)
    console.log('inser author > ', insertAuthor);

    if (emailExist == undefined && insertAuthor == 'success') {
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password, salt)
      const createNewUser = await repo.createUser(name, email, hashPassword)
      console.log('create new user > ', createNewUser);
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
        error_data: {
          result: error.message
        }
      }
    }
  }
}

const updatePassword = async (idUser, oldPassword, newPassword) => {
  try {
    const userExist = await repoAuth.getUser(idUser)
    if (!userExist) {
      return {
        status_code: 200,
          data: {
            message: "Failed",
            error_key: "error_author_id_not_found",
            error_message: "Author ID Not Found",
            error_data: {
              result: `Author ID Number ${idUser} Not Found`
            }
        }
      }
    }
    const validatePassword = await bcrypt.compare(oldPassword, userExist.password)

    if (validatePassword) {
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(newPassword, salt)

      const updateAuthorPassword = await repo.updatePassword(idUser, hashPassword)
      return {
        status_code: 200,
        data: {
          message: "Success"
        }
      }
    }

  } catch (error) {
    console.log('error > ', error);
    return {
      status_code: 200,
      data: {
        message: "Failed",
        error_key: "error_internal_server",
        error_message: "Internal Server Error",
        error_data: {
          result: error.message
        }
      }
    }
  }
}

const forgotPassword = async (email) => {
  try {
    const emailExist = await repoAuth.getAuth(email)
    if (emailExist == undefined) {
      return {
        status_code: 200,
        data: {
          message: "Failed",
          error_key: "error_email_not_found",
          error_message: "Email Not Found",
          error_data: {
            result: `${email} Not Found`
          }
        }
      }
    }

    const generateRandom = Math.random().toString(36).slice(-8)
    console.log('generate random > ',generateRandom);
    const salt = await bcrypt.genSalt(10)
    const hashPasswordTemp = await bcrypt.hash(generateRandom, salt)
    const passswordTemp = await repo.updatePassWithEmail(email, hashPasswordTemp)

    if (passswordTemp === 'updated') {
      return {
        status_code: 200,
        data: {
          message: "Success",
          data: {
            New_Password: `${generateRandom}`
          }
        }
      }
    }

  } catch (error) {
    return {
      status_code : 200,
      data: {
        message: "Failed",
        error_key: "error_internal_server",
        error_message: "Internal Server Error",
        error_data: {
          result: error.message
        }
      }
    }
  }
}

const updateAuthorProfile = async (name, penName, userId) => {
  console.log('name update > ', name);
  console.log('pen name update > ', penName);
  try {
    const userExist = await repoAuth.getUser(userId)
    if (userExist == undefined) {
      return {
        status_code: 200,
        data: {
          message: "Failed",
          error_key: "error_author_id_not_found",
          error_message: "Author ID Not Found",
          error_data: {
            result: `Author ID Number : ${userId} Not Found`
          }
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
        error_data: {
          result: error.message
        }
      }
    }
  }

}

module.exports = {registerAuthor, updatePassword, forgotPassword, updateAuthorProfile}