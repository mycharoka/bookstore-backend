require("dotenv").config();
const http = require("http");

const config = require("./core/configs");

const { logger } = require("./core/logger");
const { registerTerminus } = require("./core/terminus");
const { createApp } = require("./server");

// HTTP
const app = createApp();
const server = http.createServer(app);

// Gracefull shutdown
registerTerminus(server);

server.listen(config.app.port, () => {
    logger.info("Server up...");
    logger.info(`http://localhost:${config.app.port}/`);
});
