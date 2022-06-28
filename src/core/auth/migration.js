const bcrypt = require("bcryptjs");
const { migrate } = require("../configs");

let migration = async (client) => {
    try {
        await client.query(
            "CREATE TABLE IF NOT EXISTS users( id serial PRIMARY KEY, username VARCHAR (50) UNIQUE NOT NULL, password VARCHAR (100) NOT NULL, name VARCHAR (50), role VARCHAR (10))"
        );

        const username = migrate.username;
        const password = migrate.password;
        const email = migrate.email

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        let queryFirstUser =
            "INSERT INTO users (username, password, name, role, email) VALUES($1, $2, $3, $4, $5) RETURNING *";
        let valueFirstUser = [username, hashPassword, "admin", "admin", email];

        let res = await client.query(queryFirstUser, valueFirstUser);
        if (res) {
            console.log("Username, Email and password have been created");
            console.log({
                username,
                password,
            });
        }
    } catch (err) {
        console.log(err.message);
        console.log({
            username,
            password,
        });
    }
};

module.exports = {
    migration,
};
