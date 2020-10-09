BEGIN;

DROP TABLE IF EXISTS users, resources, votes CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  avatar_url TEXT
);

CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  type TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  resource_id INTEGER REFERENCES resources(id) NOT NULL,
  UNIQUE (user_id, resource_id)
);

INSERT INTO users (username, email, avatar_url)
  VALUES
    (
      'oliverjam',
      'oliverjamesphillips@gmail.com',
      'https://avatars1.githubusercontent.com/u/9408641?v=4'
    ),
    (
      'starsuit',
      'sam@@near.st',
      'https://avatars1.githubusercontent.com/u/9408641?v=4'
    );

INSERT INTO resources (url, title, topic, type, user_id)
  VALUES (
    'https://oliverjam.es/blog/first-class-functions/',
    'First-class functions in JavaScript',
    'javascript',
    'article',
    1
  );

INSERT INTO votes (user_id, resource_id)
  VALUES
    (1, 1),
    (2, 1);

COMMIT;