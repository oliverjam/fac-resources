const crypto = require("crypto");

const SECRET = process.env.JWT_SECRET;

const DISALLOWED_METHODS = ["GET", "HEAD", "OPTIONS"];

function csrf(req, res, next) {
  const cookieToken = req.cookies._csrf;
  if (req.method === "GET") {
    if (cookieToken) {
      // already a cookie so sign that for forms to use
      req.csrfToken = sign(cookieToken, SECRET);
    } else {
      // no cookie so generate random string
      const random = uid();
      // then use that as new cookie
      res.cookie("_csrf", random, { httpOnly: true });
      // and sign it for forms to use
      req.csrfToken = sign(random, SECRET);
    }
    return next();
  }
  // only run on e.g. POSTs
  if (DISALLOWED_METHODS.includes(req.method) || !req.body) {
    return next();
  }
  const failure = () => {
    const err = new Error("CSRF mismatch");
    err.status = 403;
    return next(err);
  };
  // could be HTTP body or search params in URL
  const submittedHmac = req.body._csrf || req.query._csrf;
  if (!submittedHmac) {
    return failure();
  }
  // sign cookie and compare to form-submitted token
  const match = verify(cookieToken, submittedHmac, SECRET);
  if (!match) {
    return failure();
  }
  return next();
}

function uid(length = 24) {
  return crypto.randomBytes(length).toString("hex");
}

function sign(str, secret) {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(str);
  return hmac.digest("hex");
}

function verify(str, hmac, secret) {
  return hmac === sign(str, secret);
}

module.exports = csrf;
