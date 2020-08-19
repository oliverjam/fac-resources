BEGIN;

DROP TABLE IF EXISTS users, resources CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  avatar_url TEXT
);

CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL
);

-- INSERT INTO resources (content, user_id) VALUES
--   ('Announcing of invitation principles in.', 1),
-- ;

COMMIT;