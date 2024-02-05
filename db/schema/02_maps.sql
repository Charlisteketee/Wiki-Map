-- maps --
DROP TABLE IF EXISTS maps CASCADE;
CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  title VARCHAR (255) NOT NULL,
  description TEXT,
  longtitude DECIMAL(3, 6) NOT NULL,
  latitude DECIMAL(3, 6) NOT NULL,
  created_at DATE NOT NULL,
  updated_at DATE NOT NULL
);
