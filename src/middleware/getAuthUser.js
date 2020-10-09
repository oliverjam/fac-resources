const jwt = require("jsonwebtoken");
const model = require("../database/model");

const HASH_SECRET = process.env.HASH_SECRET;

async function getAuthUser(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return next();
  }
  try {
    const auth = jwt.verify(token, HASH_SECRET);
    const user = await model.getUser(auth.id);
    res.locals.user = user;
    return next();
  } catch (_e) {
    return next();
  }
}

module.exports = getAuthUser;
