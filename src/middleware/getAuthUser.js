const jwt = require("jsonwebtoken");

const HASH_SECRET = process.env.HASH_SECRET;

function getAuthUser(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return next();
  }
  try {
    const auth = jwt.verify(token, HASH_SECRET);
    res.locals.auth = auth;
    return next();
  } catch (_e) {
    return next();
  }
}

module.exports = getAuthUser;
