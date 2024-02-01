// lets do all database queries here.
const db = require('../connection');

const getMapid = function (userId, mapId) {
  return db.query('SELECT * FROM maps WHERE user_id = $1 AND id = $2;', [userId, mapId])
    .then(data => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getFavourites = function (userId) {
  return db.query('SELECT * FROM favourites WHERE user_id = $1;', [userId])
    .then(data => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const createMap = function (mapObject) {
  const queryParams = [
    maps.id,
    maps.user_id,
    maps.title,
    maps.description,
    maps.location,
    maps.created_at,
    maps.updated_at
  ];
  const queryString = `INSERT INTO maps (
    id,
    user_id,
    title,
    description,
    location,
    created_at,
    updated_at
  ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
`;

  return db.query(queryString, queryParams)
    .then((result) => result.rows[0])
    .catch((err) => {
      console.error(err.message)
    })
}

module.exports = {-----};
