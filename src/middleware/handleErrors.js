const { STATUS_CODES } = require("http");
const templates = require("../templates.js");

function handleErrors(error, req, res, next) {
  console.error(error);
  const status = error.status || 500;
  const message = STATUS_CODES[status];
  res.send(templates.error({ message }));
}

module.exports = handleErrors;
