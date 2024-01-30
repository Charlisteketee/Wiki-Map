-- Drop and recreate Users table

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id serial PRIMARY KEY,
  username varchar,
  email varchar,
  password varchar,
  favourites_id integer,
  full_name varchar,
  bio text,
  avatar_url varchar,
  location varchar
);

