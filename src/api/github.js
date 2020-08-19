const got = require("got");
const dotenv = require("dotenv");

dotenv.config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const tokenUrl = "https://github.com/login/oauth/access_token";

const client = got.extend({
  headers: { accept: "application/json" },
  responseType: "json",
});

exports.getToken = (code) => {
  return client(tokenUrl, {
    method: "POST",
    json: {
      client_id,
      client_secret,
      code,
    },
  }).then((response) => response.body.access_token);
};

const userUrl = "https://api.github.com/user";

exports.getUser = (token) => {
  return client(userUrl, {
    headers: {
      authorization: `token ${token}`,
    },
  }).then((response) => response.body);
};

exports.getOrgs = (user) => {
  return client(user.organizations_url).then((response) => {
    return {
      ...user,
      organizations: response.body,
    };
  });
};
