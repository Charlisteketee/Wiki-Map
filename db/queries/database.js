// lets do all database queries here.
const db = require('../connection');
//get user id function LOW PRIORITY. CREATOR ID
// insert point function -Paul
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
const getMapsData = function () {
  return db.query('SELECT id, title, description, longitude, latitude FROM maps;')
    .then(data => {
      return (data.rows);
    })
    .catch((err) => {
      console.error(err.message);
    });
};
const getPointsData = function () {
  return db.query('SELECT map_id, latitude, longitude FROM points;')
    .then(data => {
      return (data.rows);
    })
    .catch((err) => {
      console.error(err.message);
    });
};
const getAllMapLocations = function () {
  return db.query(`
  SELECT id, longitude, latitude
  FROM maps
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
const getAllUsers = function (userId) {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
const getUserId = function (userId) {
  return db.query('SELECT * FROM users WHERE user_id = $1;', [userId,])
    .then(data => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getUsername = async (userId) => {
  try {
    const query = 'SELECT username FROM users WHERE id = $1';
    const result = await db.query(query, [userId]);
    if (result.rows.length > 0) {
      return result.rows[0].username;
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw new Error('Error fetching username: ' + error.message);
  }
};

const getMapId = function (userId, mapId) {
  return db.query('SELECT * FROM maps WHERE user_id = $1 AND id = $2;', [userId, mapId])
    .then(data => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getFavourites = function () {
  return db.query(`
  SELECT maps.id, maps.title, maps.description, maps.longitude, maps.latitude, (favourites.*)
  FROM favourites JOIN maps on map_id = maps.id
  WHERE favourites.user_id = 1`)
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// get just one favourite from list of favourites
const getFavourite = function (userId, mapId) {
  return db.query(`
  SELECT maps.id, maps.title, maps.description, maps.longitude, maps.latitude
  FROM maps
  JOIN favourites ON favourites.map_id = maps.id
  WHERE favourites.user_id = $1
  AND maps.id = $2;
  `, [userId, mapId])
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
const getFavouritesNavbar = function (userId) {
  return db.query(`
    SELECT favourites.map_id, maps.title
    FROM favourites
    JOIN maps ON favourites.map_id = maps.id
    WHERE favourites.user_id = $1`, [userId])
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
const updatePoint = function (pointObject) {
  const queryParams = [
    points.body,
    points.image_url,
    points.updated_at,
  ];
  const queryString = `INSERT INTO maps (
    body,
    image_url,
    updated_at,
  )`
  return db.query(queryString, queryParams)
  .then((result) => result.rows[0])
  .catch((err) => {
    console.error(err.message)
  })
}

const createPoint = function (pointObject) {
  const queryParams = [
    points.id,// need generate id function
    points.map_id, // need generate id function
    points.title,
    points.body,
    points.longtitude,
    points.latitude,
    points.image_url,
    points.created_at,
    points.updated_at,
  ];
  const queryString = `INSERT INTO maps (
    id,
    user_id,
    title,
    body,
    longtitude,
    latitude,
    image_url,
    created_at,
    updated_at,
  )`

  return db.query(queryString, queryParams)
  .then((result) => result.rows[0])
  .catch((err) => {
    console.error(err.message)
  })
}

const createMap = function (mapObject) {
  const queryParams = [
    maps.id, // need generate id function
    maps.user_id,// need generate id function
    maps.title,
    maps.description,
    maps.longtitude,
    maps.latitude,
    maps.created_at,
    maps.updated_at
  ];
  const queryString = `INSERT INTO maps (
    id,
    user_id,
    title,
    description,
    longtitude,
    latitude,
    created_at,
    updated_at
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
`;

  return db.query(queryString, queryParams)
    .then((result) => result.rows[0])
    .catch((err) => {
      console.error(err.message)
    })
};

// query filter by title for search bar. - Charli
const filterMapsByTitle = function (title) {
  const queryParams = [`%${title}%`]; // use % wildcard for partial matches

  // ILIKE for case-insensitive search
  const queryString = `
  SELECT * FROM maps
  WHERE title ILIKE $1;
  `;

  return db.query(queryString, queryParams)
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

//Contributed maps helper functions
const getContributedMaps = function(userId) {
  return db.query(`
  SELECT maps.*
  FROM maps
  WHERE user_id = $1`, [userId])
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getContributedNavbar = function(userId) {
  return db.query(`
    SELECT id, title
    FROM maps
    WHERE user_id = $1`, [userId])
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const deleteMap = function (mapId) {
  return db.query('DELETE FROM maps WHERE id = $1', [mapId])
  .then(result => {
    if (result.rowCount > 0) {
      console.log('Map deleted successfully.');
      return true;
    } else {
      console.log('Map not found.');
      return false;
    }
  })
  .catch(error => {
    console.error('Error deleting map:', error);
    throw error;
  });
};

const deletePoint = function (pointId) {
  return db.query('DELETE FROM points WHERE id = $1', [pointId])
  .then(result => {
    if (result.rowCount > 0) {
      console.log('Point deleted successfully.');
      return true;
    } else {
      console.log('Point not found.');
      return false;
    }
  })
  .catch(error => {
    console.error('Error deleting point:', error);
    throw error;
  });
};

module.exports = {getFavouritesNavbar, getFavourite, getMapsData, getPointsData, getAllMaps, getMapId, getAllMapLocations, updatePoint, createPoint, deletePoint, getFavourites, filterMapsByTitle, deleteMap, getContributedMaps, getContributedNavbar };
