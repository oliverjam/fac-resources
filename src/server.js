const express = require("express");
const cookieParser = require("cookie-parser");
const handlers = require("./handlers");
const logger = require("./middleware/logger");
const handleErrors = require("./middleware/handleErrors");
const getAuthUser = require("./middleware/getAuthUser");

const server = express();

server.use(cookieParser());
server.use(logger);

server.use(getAuthUser);
server.get("/", handlers.home);
server.get("/authenticate", handlers.authenticate);

server.use(handleErrors);
server.use("*", handlers.missing);

module.exports = server;
