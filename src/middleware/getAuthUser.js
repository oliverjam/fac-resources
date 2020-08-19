const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

function getAuthUser(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return next();
  }
  try {
    const auth = jwt.verify(token, JWT_SECRET);
    res.locals.auth = auth;
    return next();
  } catch (_e) {
    return next();
  }
}

module.exports = getAuthUser;
