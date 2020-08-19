const dotenv = require("dotenv");

dotenv.config();

const html = String.raw;

const clientId = process.env.CLIENT_ID;
const oauthUrl = "https://github.com/login/oauth/authorize";

exports.home = ({ username } = {}) => {
  const url =
    oauthUrl +
    "?allow_signup=false" +
    "&redirect_uri=http://localhost:3333/authenticate" +
    `&client_id=${clientId}`;
  return layout({
    content: html`
      ${username
        ? html`<h1>Welcome back ${username}</h1>`
        : html`<h1>Welcome</h1>`}
      <a href="${url}">Log in</a>
    `,
  });
};

exports.facOnly = () => {
  return layout({
    content: html`
      <h1>Not allowed</h1>
      <p>
        Sorry, you must be a member of the Founders & Coders GitHub organization
        to log in
      </p>
    `,
  });
};

exports.error = () => {
  return layout({
    content: html`<h1>Something went wrong</h1>`,
  });
};

function layout({ title, content }) {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${title} | FAC Resources</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
}
