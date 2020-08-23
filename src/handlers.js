const jwt = require("jsonwebtoken");
const github = require("./api/github");
const model = require("./database/model");
const templates = require("./templates");

const HASH_SECRET = process.env.HASH_SECRET;

exports.home = (req, res, next) => {
  const id = res.locals?.auth?.id;
  if (id) {
    const userPromise = model.getUser(id);
    const resourcesPromise = model.getResources();
    return Promise.all([userPromise, resourcesPromise])
      .then(([user, resources]) => {
        const ctx = { user, resources, csrf: req.csrfToken };
        res.send(templates.home(ctx));
      })
      .catch(next);
  }
  return res.send(templates.home());
};

exports.authenticate = (req, res, next) => {
  const { code } = req.query;
  const success = (id) => {
    const token = jwt.sign({ id }, HASH_SECRET);
    res.cookie("token", token);
    res.redirect("/");
  };
  github
    .getToken(code)
    .then(github.getUser)
    .then((githubUser) => {
      model.getExistingUser(githubUser).then((existingUser) => {
        if (existingUser) {
          return success(existingUser.id);
        }
        // new user
        github.getOrgs(githubUser).then((user) => {
          const facMember = user.organizations.some(
            (org) => org.login === "foundersandcoders"
          );
          if (facMember) {
            return model.createUser(user).then(success);
          }
          return res.send(templates.facOnly());
        });
      });
    })
    .catch(next);
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

exports.missing = (req, res) => {
  res.status(404);
  res.send("<h1>Not found</h1>");
};

exports.addResource = (req, res, next) => {
  const resource = req.body;
  const userId = res.locals?.auth?.id;
  model
    .createResource(resource, userId)
    .then(() => res.redirect("/"))
    .catch(next);
};
