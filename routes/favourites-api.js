/*
 * All routes for favourites are defined here
 * Since this file is loaded in server.js into api/favourites,
 *   these routes are mounted onto /api/favourites
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
const express = require('express');
const router  = express.Router();
const {getFavouritesNavbar, getFavourites, getPointsData, getFavourite } = require('../db/queries/database'); //inside database.js
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
    const navBar = await getFavouritesNavbar(req.cookies.userId);
    // Render the 'index' view and pass the maps data with associated points to it
    res.render('index', { mapsWithPoints, navBar });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});

// MOVE TO MAPS-API.js
router.get('/favourites/:mapId', async (req, res) => {
  try {
    const userId = req.cookies.userId; // For demonstration purposes; replace this with the actual user ID retrieval logic
    const mapId = req.params.mapId;

    // Fetch data for the specific favourite map
    const [mapsData, pointsData] = await Promise.all([
      getFavourite(userId, mapId),
      getPointsData()
    ]);

    // Associate marker data with the favourite map
    const mapsWithPoints = associatePointsWithMaps(mapsData, pointsData);

    // Fetch navbar data
    const navBar = await getFavouritesNavbar(userId);

    // Render the 'index' view with the maps data and navbar data
    res.render('index', { mapsWithPoints, navBar });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
