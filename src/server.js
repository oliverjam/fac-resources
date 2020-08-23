const express = require("express");
const cookieParser = require("cookie-parser");
const handlers = require("./handlers");
const logger = require("./middleware/logger");
const handleErrors = require("./middleware/handleErrors");
const getAuthUser = require("./middleware/getAuthUser");
const csrf = require("./middleware/csrf");

const server = express();

server.use(logger);
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static("src/public"));
server.use(csrf);

server.use(getAuthUser);
server.get("/", handlers.home);
server.get("/authenticate", handlers.authenticate);
server.get("/logout", handlers.logout);
server.post("/add-resource", handlers.addResource);

server.use(handleErrors);
server.use("*", handlers.missing);

module.exports = server;
