// lets do all database queries here.
const db = require('../connection');
//get user id function LOW PRIORITY. CREATOR ID
// insert point function -Paul
// query filter by location for search bar. - Charli
// delete map function -Luiza
// delete point function - Luiza
// edit point UPDATE tablename SET column_name = new value WHERE some condition

//get html (ALL MAPS, DESCENDING ORDER BY FAVOURITES) - Charli
const getAllMaps = function () {
  return db.query(`
  SELECT maps.*, COUNT(favourites.map_id) AS favourites_count
  FROM maps
  LEFT JOIN favourites ON maps.id = favourites.map_id
  GROUP BY maps.id
  ORDER BY favourites_count DESC;
  `)
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.error(err.message);
    });
};


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
const createPoint = function (pointObject){
  const queryParams = [
    points.id,
    points.map_id
  ]
}
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
