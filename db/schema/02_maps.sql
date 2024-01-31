-- Drop and recreate maps table

DROP TABLE IF EXISTS maps CASCADE;
CREATE TABLE maps (
  id serial PRIMARY KEY,
  creator_id integer
  title varchar
  description text
  location varchar
  created_at timestamp
  updated_at timestamp
);
