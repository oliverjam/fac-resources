const express = require("express");
const handlers = require("./handlers");
const logger = require("./middleware/logger");
const handleErrors = require("./middleware/handleErrors");

const server = express();

server.use(logger);

server.get("/", handlers.home);
server.get("/authenticate", handlers.authenticate);

server.use(handleErrors);
server.use("*", handlers.missing);

module.exports = server;
