const db = require("./connect");

exports.getUser = (id) => {
  const SELECT_USER = `SELECT id, username, email, avatar_url FROM users WHERE id = $1`;
  return db
    .query(SELECT_USER, [id])
    .then((result) => (result ? result.rows[0] : undefined));
};

exports.getExistingUser = (githubUser) => {
  const SELECT_USER = `SELECT id FROM users WHERE username = $1`;
  return db
    .query(SELECT_USER, [githubUser.login])
    .then((result) => (result ? result.rows[0] : undefined));
};

exports.createUser = ({ login, email, avatar_url }) => {
  const values = [login, email, avatar_url];
  const INSERT_USER = `
    INSERT INTO users (username, email, avatar_url)
    VALUES ($1, $2, $3)
    RETURNING id
  `;
  return db.query(INSERT_USER, values).then((result) => result.rows[0]);
};

exports.getResources = ({ userId, topic, type }) => {
  const SELECT_RESOURCES = `
    SELECT
      resources.*,
      CASE
        WHEN resources.id in (
          SELECT resources.id
          FROM resources LEFT JOIN votes ON resources.id = votes.resource_id
          WHERE votes.user_id = $1
        ) 
        THEN true ELSE false
        END
      AS voted_for,
      COUNT(votes.user_id) AS total_votes
    FROM resources LEFT JOIN votes ON resources.id = votes.resource_id
    WHERE (
      resources.topic = COALESCE($2, resources.topic)
      AND
      resources.type = COALESCE($3, resources.type)
    )
    GROUP BY resources.id
    ORDER BY total_votes DESC
  `;
  return db
    .query(SELECT_RESOURCES, [
      userId,
      topic === "all" ? null : topic,
      type === "all" ? null : type,
    ])
    .then((res) => res.rows);
};

exports.createResource = (resource, userId) => {
  const INSERT_RESOURCE = `
    INSERT INTO resources (url, title, topic, type, user_id)
      VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [
    resource.url,
    resource.title,
    resource.topic,
    resource.type,
    userId,
  ];
  return db.query(INSERT_RESOURCE, values).then((res) => res.rows);
};

exports.voteForResource = (resourceId, userId) => {
  const INSERT_VOTE = `
    INSERT INTO votes (resource_id, user_id)
      VALUES ($1, $2) 
  `;
  return db.query(INSERT_VOTE, [resourceId, userId]).then((res) => res.rows);
};
