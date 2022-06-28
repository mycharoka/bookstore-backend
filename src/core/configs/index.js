const { PROD_ENV, DEV_ENV, TEST_ENV } = require("./constants");
const env = process.env.ENV || DEV_ENV;

const helperFunc = {
    isProd: () => env === PROD_ENV,
    isDev: () => env === DEV_ENV,
    isTest: () => env === TEST_ENV,
};
const config = {
    app: {
        env,
        port: process.env.APP_PORT || 3000,
        url: process.env.BASE_URL
    },
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    },
    jwt: {
        access_secret: process.env.JWT_SECRET || "secret-key",
        refresh_secret: process.env.JWT_REFRESH
    },
    log: {
        dir: process.env.LOG_DIR || "./logs",
    },
    migrate: {
        username: process.env.USER_MIGRATION,
        password: process.env.PASS_MIGRATION,
        email: process.env.EMAIL_MIGRATION
    }
};

console.log(`config:`, config);

module.exports = {
    ...config,
    ...helperFunc,
};
