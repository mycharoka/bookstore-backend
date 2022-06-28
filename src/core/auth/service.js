const bcrypt = require("bcryptjs");
const User = require("./repository");
const jwt = require("jsonwebtoken");
const config = require("../configs");
const { logger } = require("../logger");

const passwordIsMatch = async (email, password) => {
  console.log('email > ', email);
  try {
    // let user = await User.getAuth(username);
    let user = await User.getAuth(email)
    console.log('user >',user);
    if (!user) {
      // return {
      //   status: "error",
      //   message: "Incorrect email or password"
      // };
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
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // return {
      //   status: "error",
      //   message: "Incorrect username or password"
      // };
      return {
        status_code: 200,
        data: {
          message: "Failed",
          error_key: "error_invalid_password",
          error_message: "Invalid Password",
          error_data: {
            result: "Invalid Password"
          }
        }
      }
    }
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      }
    };
    const refreshToken = jwt.sign(payload, config.jwt.refresh_secret, {
      expiresIn: "24h" // Expires in 24 hours
    });
    console.log('refresh token > ', refreshToken);
    const accessToken = jwt.sign(payload, config.jwt.access_secret, {expiresIn: "15m"})
    console.log('access token > ', accessToken);
    // return {
    //   status: "success",
    //   data: {
    //     token: "Bearer " + token
    //   },
    //   message: "Token Created"
    // };
    return {
      status_code: 200,
      data: {
        message: "Success",
        data: {
          Refresh_Token: `Bearer ${refreshToken}`,
          Access_Token: `Bearer ${accessToken}`,
        }
      }
    }

  } catch (err) {
    console.log('err auth > ', err.response);
    logger.error(err.message);
    // return {
    //   status: "error",
    //   message: err.message
    // };
    return {
      status_code: 200,
      data: {
        message: "Failed",
        error_key: "error_internal_server",
        error_message: "Internal Server Error",
        error_data: {
          result: err.message
        }
      }
    }
  }
};

const getLoggedIn = async id => {
  try {
    let user = await User.getUser(id);
    console.log('user > ', user);
    // return {
    //   status: "success",
    //   data: { user }
    // };
    if (user == undefined) {
      return {
        status_code: 200,
        data: {
          message: "Failed",
          error_key: "error_author_id_not_found",
          error_message: "Author ID Not Found",
          error_data: {
            result: `Author ID Number: ${id} Not Found`
          }
        }
      }
    }
    const fetchPenName = await User.getPenName(user.name)
    // console.log('pen name > ', fetchPenName);
    return {
      status_code: 200,
      data: {
        message: "Success",
        data:{
          Author_ID: user.id,
          Name: user.name,
          Pen_Name: fetchPenName.pen_name,
          Email: user.email
        }
        

      }
    }
  } catch (err) {
    logger.error(err.message);
    return {
      status: "error",
      message: err.message
    };
  }
};

const createNewUser = async (createdId, username, password, name, role) => {
  try {
    let user = await User.getUser(createdId);

    let userExist = await User.checkUsername(username);
    if (userExist) {
      return {
        status: "error",
        message: "Username already exists"
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const result = await User.createUser(username, hashPassword, name, role);
    return {
      status: "success",
      data: { user: result },
      message: "User Created"
    };
  } catch (err) {
    console.log(err)
    console.log(err.message);
    return {
      status: "error",
      message: err.message
    };
  }
};

module.exports = {
  passwordIsMatch,
  getLoggedIn,
  createNewUser
}
