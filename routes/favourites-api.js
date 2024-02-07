/*
 * All routes for favourites are defined here
 * Since this file is loaded in server.js into api/favourites,
 *   these routes are mounted onto /api/favourites
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
const express = require('express');
const router  = express.Router();
const {getFavourites, getPointsData} = require('../db/queries/database'); //inside database.js
const{associatePointsWithMaps} = require ('../helper-functions/leafletHelperFunctions')
// router.get('/api/users/:userId/favorites', (req, res) => {
//   const { userId } = req.params;
//   favouriteQueries.getFavourites(userId)
//     .then(favourites => {
//       res.json({ favourites });
//     })
//     .catch(err => {
//       res.status(500).json({ error: err.message });
//     });
// });
router.get('/favourites', async (req, res) => {

  try {
    // Use Promise.all to fetch both mapsData and pointsData concurrently
    const [mapsData, pointsData] = await Promise.all([getFavourites(), getPointsData()]);
    // Associate marker data with each map based on map_id or any other relevant key
    const mapsWithPoints = associatePointsWithMaps(mapsData, pointsData);

    // Render the 'index' view and pass the maps data with associated points to it
    res.render('index', { mapsWithPoints });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
