const dotenv = require("dotenv");

dotenv.config();

const clientId = process.env.CLIENT_ID;
const oauthUrl = "https://github.com/login/oauth/authorize";

exports.home = ({ user, resources, csrf, topic, type } = {}) => {
  return layout({
    title: "All resources",
    user,
    content: html`
      <div class="layout">
        <section
          aria-label="Resources"
          class="vstack"
          style="--gap: var(--size-xl)"
        >
          ${Filters({ topic, type })} ${ResourceList({ resources })}
        </section>
        <section>${AddResource({ csrf })}</section>
      </div>
    `,
  });
};

const topics = [
  ["all", "All topics"],
  ["html", "HTML"],
  ["a11y", "Accessibility"],
  ["js", "JavaScript"],
  ["css", "CSS"],
  ["node", "Node"],
  ["auth", "Authentication"],
  ["react", "React"],
];

const types = [
  ["all", "All types"],
  ["article", "Article"],
  ["video", "Video"],
  ["game", "Game"],
  ["reference", "Reference"],
];

const Filters = ({ topic, type }) => {
  return html`
    <form class="hstack" style="--align: stretch">
      <div class="select">
        <select aria-label="Topic" name="topic" required>
          ${topics.map(FilterOption(topic))}
        </select>
      </div>
      <div class="select">
        <select aria-label="Type" name="type" required>
          ${types.map(FilterOption(type))}
        </select>
      </div>
      <button type="submit" data-primary>
        Filter
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
          />
        </svg>
      </button>
      <a href="/" class="button">
        Clear
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </form>
  `;
};

const FilterOption = (current) => ([value, label]) => {
  const selected = value === current ? "selected" : "";
  return html` <option value="${value}" ${selected}>${label}</option> `;
};

const ResourceList = ({ resources }) => {
  if (!resources?.length) {
    return html`<p>No matching links found</p>`;
  }
  return html`
    <ul class="vstack" style="--gap: var(--size-lg); max-width: max-content">
      ${resources.map((r) => {
        const url = new URL(r.url);
        const favicon = url.origin + "/favicon.ico";
        return html`
        <li class="hstack" style="--align: flex-start">
          <img src="${favicon}" width="36" height="36" alt="" />
          <div class="vstack" style="--gap: var(--size-sm)">
            <div class="vstack block-link"" style="--gap: var(--size-xs)">
              <h3>${r.title}</h3>
              <a href="${r.url}">${r.url}</a>
            </div>
            ${Actions(r)}
          </div>
        </li>
      `;
      })}
    </ul>
  `;
};

const Actions = ({ id, name, voted_for, total_votes }) => {
  const voteUrl = voted_for ? "/remove-vote/" : "/add-vote/";
  return html`
    <div class="hstack" style="--gap: var(--size-lg)">
      <div class="hstack" style="--gap: var(--size-xs)">
        <a
          href="${voteUrl + id}"
          class="button icon"
          aria-label="Vote for ${name}"
          style="--color: red"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            width="32"
            height="32"
            stroke="currentColor"
            data-voted="${voted_for}"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </a>
        <strong>${total_votes}</strong>
      </div>
      <div class="hstack" style="--gap: var(--size-xs)">
        <button class="icon" aria-label="Bookmark ${name}">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            width="32"
            height="32"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  `;
};

const AddResource = ({ csrf }) => html`
  <form
    action="/add-resource"
    method="POST"
    class="vstack"
    style="position: sticky; top: var(--size-xl); --gap: var(--size-lg)"
  >
    <div class="vstack">
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
          <div class="select">
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
        </div>
        <div class="vstack" style="--gap: var(--size-sm)">
          <label for="title">Type</label>
          <div class="select">
            <select name="type">
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="game">Game</option>
              <option value="reference">Reference</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <input type="hidden" name="_csrf" value="${csrf}" />
    <button type="submit" data-primary>
      Add resource
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </form>
`;

exports.facOnly = () => {
  return layout({
    title: "Not allowed",
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
    title: "Error",
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
        <link href="/styles.css" rel="stylesheet" />
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
          <main>${content}</main>
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
