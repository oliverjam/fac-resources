const dotenv = require("dotenv");

dotenv.config();

const clientId = process.env.CLIENT_ID;
const oauthUrl = "https://github.com/login/oauth/authorize";

exports.home = ({ user, resources, csrf } = {}) => {
  return layout({
    user,
    content: html`
      <div>
        ${AddResource({ csrf })} ${ResourceList({ resources })}
      </div>
    `,
  });
};

const ResourceList = ({ resources }) => html`
  <section class="stack-lg">
    <h2>Resources</h2>
    <ul class="stack">
      ${resources.map((r) => {
        const url = new URL(r.url);
        const favicon = url.origin + "/favicon.ico";
        return html`
          <li class="stack-sm resource">
            <img src="${favicon}" width="32" height="32" alt="" />
            <div>
              <h3>${r.title}</h3>
              <div><a href="${r.url}">${r.url}</a></div>
            </div>
          </li>
        `;
      })}
    </ul>
  </section>
`;

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

const AddResource = ({ csrf }) => html`
  <form action="/add-resource" method="POST">
    <input type="url" placeholder="URL" aria-label="URL" name="url" required />
    <input
      type="text"
      placeholder="Title"
      aria-label="URL"
      name="title"
      required
    />
    <select aria-label="topic" name="topic">
      <option value="html">HTML</option>
      <option value="a11y">Accessibility</option>
      <option value="js">JavaScript</option>
      <option value="css">CSS</option>
      <option value="node">Node</option>
      <option value="auth">Authentication</option>
      <option value="react">React</option>
    </select>
    <select aria-label="type" name="type">
      <option value="article">Article</option>
      <option value="video">Video</option>
      <option value="game">Game</option>
      <option value="reference">Reference</option>
    </select>
    <input type="hidden" name="_csrf" value="${csrf}" />
    <button type="submit">Upload</button>
  </form>
`;

function layout({ title, content, user }) {
  const loginUrl =
    oauthUrl +
    "?allow_signup=false" +
    "&redirect_uri=http://localhost:3333/authenticate" +
    `&client_id=${clientId}`;
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${title} | FAC Resources</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="styles.css" rel="stylesheet" />
      </head>
      <body>
        <div class="page">
          <header class="page-header">
            <div>
              <svg
                viewBox="0 0 20 20"
                width="48"
                height="48"
                fill="currentColor"
              >
                <path
                  d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"
                ></path>
              </svg>
            </div>
            ${user
              ? html`
                  <div class="row">
                    <img
                      src="${user.avatar_url}"
                      class="avatar"
                      width="48"
                      height="48"
                      alt=""
                    />
                  </div>
                `
              : html`<a href="${loginUrl}">Log in</a>`}
          </header>
          <main>
            ${content}
          </main>
        </div>
      </body>
    </html>
  `;
}
