const { client } = require("./db")
const auth = require("../auth/migration")
const author = require("../../module/bookstore/author/migration")
const book = require("../../module/bookstore/book/migration")

let migration = async () => {
  try {
    await client.connect();

    await auth.migration(client)

    await author.migration(client)

    await book.migration(client)

    await client.end();
  } catch (err) {
    console.log(err.message);
    await client.end();
  }
};

migration();