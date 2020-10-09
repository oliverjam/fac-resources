const jwt = require("jsonwebtoken");
const github = require("./api/github");
const model = require("./database/model");
const templates = require("./templates");

const HASH_SECRET = process.env.HASH_SECRET;

exports.home = async (req, res, next) => {
  try {
    const user = res.locals?.user;
    const { topic, type } = req.query;
    const resources = await model.getResources({ topic, type });
    const ctx = { user, resources, csrf: req.csrfToken, topic, type };
    res.send(templates.home(ctx));
  } catch (error) {
    next(error);
  }
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
  const userId = res.locals?.user?.id;
  model
    .createResource(resource, userId)
    .then(() => res.redirect("/"))
    .catch(next);
};

exports.vote = (req, res, next) => {
  const userId = res.locals?.user?.id;
  const resourceId = req.params.id;
  model
    .voteForResource(resourceId, userId)
    .then(() => res.redirect("/"))
    .catch((error) => {
      next(error);
    });
};
