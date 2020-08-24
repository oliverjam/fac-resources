const dotenv = require("dotenv");

dotenv.config();

const clientId = process.env.CLIENT_ID;
const oauthUrl = "https://github.com/login/oauth/authorize";

exports.home = ({ user, resources, csrf } = {}) => {
  return layout({
    user,
    content: html`
      <div class="vstack" style="--gap: var(--size-lg)">
        <section aria-label="Add new resource">
          ${AddResource({ csrf })}
        </section>
        <section aria-label="Resources">
          ${ResourceList({ resources })}
        </section>
      </div>
    `,
  });
};

const ResourceList = ({ resources }) => html`
  <ul class="vstack" style="max-width: max-content">
    ${resources.map((r) => {
      const url = new URL(r.url);
      const favicon = url.origin + "/favicon.ico";
      const votes = r.total_votes;
      return html`
        <li class="hstack" style="--pad: 1vw; --radius: var(--size-sm)">
          <img src="${favicon}" width="32" height="32" alt="" />
          <div class="vstack" style="--gap: var(--size-sm)">
            <div class="vstack block-link"" style="--gap: 0">
              <h3>${r.title}</h3>
              <a href="${r.url}">${r.url}</a>
            </div>
            ${Votes({ votes })}
          </div>
        </li>
      `;
    })}
  </ul>
`;

const Votes = ({ votes }) => {
  return html`
    <div class="hstack" style="--gap: var(--size-xs)">
      <svg viewBox="0 0 20 20" width="32" height="32" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <strong>${votes} ${votes === 1 ? "vote" : "votes"}</strong>
    </div>
  `;
};

const AddResource = ({ csrf }) => html`
  <details>
    <summary class="button">New link</summary>
    <form
      action="/add-resource"
      method="POST"
      class="vstack add-resource"
      style="--pad: var(--size-lg); --radius: var(--size-md)"
    >
      <h2>Add new resource</h2>
      <div class="vstack" style="--gap: var(--size-sm)">
        <label for="url">URL</label>
        <input
          id="url"
          type="url"
          placeholder="e.g. https://code.com/good-stuff"
          name="url"
          required
        />
      </div>
      <div class="vstack" style="--gap: var(--size-sm)">
        <label for="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="e.g. How to write good code"
          name="title"
          required
        />
      </div>
      <div class="hstack">
        <div class="vstack" style="--gap: var(--size-sm)">
          <label for="topic">Topic</label>
          <select name="topic">
            <option value="html">HTML</option>
            <option value="a11y">Accessibility</option>
            <option value="js">JavaScript</option>
            <option value="css">CSS</option>
            <option value="node">Node</option>
            <option value="auth">Authentication</option>
            <option value="react">React</option>
          </select>
        </div>
        <div class="vstack" style="--gap: var(--size-sm)">
          <label for="title">Type</label>
          <select name="type">
            <option value="article">Article</option>
            <option value="video">Video</option>
            <option value="game">Game</option>
            <option value="reference">Reference</option>
          </select>
        </div>
      </div>
      <input type="hidden" name="_csrf" value="${csrf}" />
      <button type="submit">Save resource</button>
    </form>
  </details>
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
                  <img
                    src="${user.avatar_url}"
                    class="avatar"
                    width="48"
                    height="48"
                    alt=""
                  />
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

function html(strings, ...values) {
  return strings
    .filter(Boolean)
    .map((s, i) => {
      let v = values[i];
      return s + (Array.isArray(v) ? v.join("\n") : v ?? "");
    })
    .join("");
}
