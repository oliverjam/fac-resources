const jwt = require("jsonwebtoken");
const github = require("./api/github");
const model = require("./database/model");
const templates = require("./templates");

const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticate = (req, res, next) => {
  const { code } = req.query;
  const success = (id) => {
    const token = jwt.sign({ id }, JWT_SECRET);
    res.cookie("token", token);
    res.redirect("/");
  };
  github
    .getToken(code)
    .then(github.getUser)
    .then(model.getExistingUser)
    .then((existingUser) => {
      if (existingUser) {
        return success(existingUser.id);
      }
      // new user
      github.getOrgs.then((user) => {
        const facMember = user.organizations.some(
          (org) => org.login === "foundersandcoders"
        );
        if (facMember) {
          return model.createUser(user).then(success);
        }
        return res.send(templates.facOnly());
      });
    })
    .catch(next);
};

exports.missing = (req, res) => {
  res.status(404).send("<h1>Not found</h1>");
};
