const auth = require("./core/auth/auth");

const registerRoute = (app) => {
    app.get("/api/safe", async (req, res) => {
        return res.json({ msg: "safe" });
    });

    app.use("/api/bookstore/auth", require("./core/auth/controller"));
    // app.use('/api/bookstore', require('./module/bookstore'))
    app.use('/author', require('./module/bookstore/author'))
    app.use('/book', require('./module/bookstore/book'))
};

module.exports = {
    registerRoute,
};
