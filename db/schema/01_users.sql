-- Drop and recreate Users table

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id serial PRIMARY KEY,
  username varchar
  email varchar
  password varchar
  full_name varchar
  bio text
  avatar_url varchar
  location varchar
);

