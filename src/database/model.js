const db = require("./connect");

exports.getUser = (id) => {
  const SELECT_USER = `SELECT username, avatar_url FROM users WHERE id = $1`;
  return db
    .query(SELECT_USER, [id])
    .then((result) => (result ? result.rows[0] : undefined));
};

exports.getExistingUser = (githubUser) => {
  const SELECT_USER = `SELECT id FROM users WHERE username = $1`;
  return db
    .query(SELECT_USER, [githubUser.login])
    .then((result) => (result ? result.rows[0] : undefined));
};

exports.createUser = ({ login, email, avatar_url }) => {
  const values = [login, email, avatar_url];
  const INSERT_USER = `
    INSERT INTO users (username, email, avatar_url)
    VALUES ($1, $2, $3)
    RETURNING id
  `;
  return db.query(INSERT_USER, values).then((result) => result.rows[0]);
};
