-- Drop and recreate favourites table

DROP TABLE IF EXISTS favourites CASCADE;
CREATE TABLE favourites (
  id serial PRIMARY KEY,
  user_id integer,
  map_id integer
);