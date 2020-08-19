const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing env variable 'DATABASE_URL'");
}

const db = new pg.Pool({ connectionString });

module.exports = db;
