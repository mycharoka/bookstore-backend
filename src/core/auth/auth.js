const jwt = require("jsonwebtoken");
const config = require("../configs");
const { logger } = require('../logger')

module.exports = function(roleGranted = ['admin']) {
  return function (req, res, next) {
    const authorizationHeader = req.header("Authorization")
    // console.log('auth header > ', authorizationHeader);

    if (!authorizationHeader) {
      // return res.status(401).json({
      //   msg: "No token, authorization denied"
      // })
      return res.status(401).json({
          message: "Failed",
          error_key: "error_no_auth_token",
          error_message: "No token, authorization denied",
          error_data: {
            result: "No token, authorization denied"
          }
      })
    }

    const token = authorizationHeader.slice(14, authorizationHeader.length)
    // const token = authorizationHeader
    console.log('token >> ', token);

    try {
      const decoded = jwt.verify(token, config.jwt.access_secret)
      console.log('decoded >>', decoded);
      if (!roleGranted.includes(decoded.user.role)) {
        // return res.status(401).json({
        //   msg: "Your role can not access this endpoint, authorization denied"
        // })
        return res.status(401).json({
            message: "Failed",
            error_key: "error_invalid_token",
            error_message: "Your role can not access this endpoint, authorization denied",
            error_data: {
              result: "Your role can not access this endpoint, authorization denied"
            }
        })
      }

      req.user = decoded

      next();
    } catch (error) {
      console.log('token error > ', error);
      logger.error(`auth.middleware.authenticate: ${error.message}`)
      // res.status(401).json({
      //   msg: "Token is not valid"
      // })
      res.status(401).json({
          message: "Failed",
          error_key: "error_invalid_token",
          error_message: "Token is not valid",
          error_data: {
            result: "Token is not valid"
          }
      })
    }

  }
}
