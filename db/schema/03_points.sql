DROP TABLE IF EXISTS points CASCADE;
CREATE TABLE points (
  id SERIAL PRIMARY KEY NOT NULL,
  --contributor_id INTEGER REFERENCES users(id) NOT NULL,
  map_id INTEGER REFERENCES maps(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  image_url VARCHAR(255) NOT NULL,
  created_at DATE NOT NULL,
  updated_at DATE NOT NULL
);
