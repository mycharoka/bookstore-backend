const jwt = require("jsonwebtoken");
const configs = require("../../../core/configs");

function refreshAuth(token) {
  try {
    if (!token) {
      return {
        status_code: 401,
        data: {
          message: "Failed",
          error_key: "error_no_auth_token",
          error_message: "Refresh Token Not Exist",
          error_data: {
            result: "Refresh Token Not Exist",
          },
        },
      };
    }

    const decoded = jwt.verify(token, configs.jwt.refresh_secret);
    // console.log('decoded > ', decoded.user.role);

    if (decoded.user.role == "author" || decoded.user.role == "admin") {
      const payload = {
        user: {
          id: decoded.user.id,
          role: decoded.user.role,
        },
      };

      console.log("payload > ", payload);
      const newAccessToken = jwt.sign(payload, configs.jwt.access_secret, {
        expiresIn: "15" * 60000,
      });
      console.log("new access token > ", newAccessToken);
      return {
        status_code: 200,
        data: {
          message: "Success",
          data: {
            Refresh_Token: `Bearer ${token}`,
            Access_Token: `Bearer ${newAccessToken}`
          }
        }
      }
    }

    return {
      status_code: 401,
      data: {
        message: "Failed",
        error_key: "error_invalid_token",
        error_message:
          "Your role can not access this endpoint, authorization denied",
        error_data: {
          result:
            "Your role can not access this endpoint, authorization denied",
        },
      },
    };
  } catch (error) {
    return {
      status_code: 200,
      data: {
        message: "Failed",
        error_key: "error_internal_server",
        error_message: "Internal Server Error",
        error_data: {
          result: `Internal Server Error: ${error.message}`,
        },
      },
    };
  }
}

module.exports = { refreshAuth };
