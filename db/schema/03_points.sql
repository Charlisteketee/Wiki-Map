-- Drop and recreate points table

DROP TABLE IF EXISTS points CASCADE;
CREATE TABLE points (
  id serial PRIMARY KEY,
  map_id integer
  --contributor_id
  title varchar
  description text
  imageUrl varchar
  created_at timestamp
  updated_at timestamp
);