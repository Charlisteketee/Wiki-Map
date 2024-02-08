/*
 * All routes for maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /api/maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const db = require('../db/queries/database');
const leaflet = require ('../helper-functions/leafletHelperFunctions')

// Routes append /api/maps

// get all maps
router.get('/', (req, res) => {
  db.getAllMaps()
    .then(maps => {
      res.json({ maps });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// filter maps by title
router.get('/search', (req, res) => {
  const { title } = req.query; // this assumes the title is passed as a query parameter

  db.filterMapsByTitle(title)
    .then(maps => {
      res.json({ maps });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});
// get specific map on favourites
router.get('/favourites/:mapId', async (req, res) => {
  try {
    const userId = 1; // For demonstration purposes; replace this with the actual user ID retrieval logic
    const mapId = req.params.mapId;

    // Fetch data for the specific favourite map
    const [mapsData, pointsData] = await Promise.all([
      db.getFavourite(userId, mapId),
      db.getPointsData()
    ]);

    // Associate marker data with the favourite map
    const mapsWithPoints = leaflet.associatePointsWithMaps(mapsData, pointsData);

    // Fetch navbar data
    const navBar = await db.getFavouritesNavbar(userId);

    // Render the 'index' view with the maps data and navbar data
    res.render('index', { mapsWithPoints, navBar });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});
// get specific map on contributed maps
router.get('/contributed/:mapId', async(req, res) => {
  try {
    const userId = 1; //For demonstration purposes. Replace with actual user
    const mapId = req.params.mapId;

    const [mapsData, pointsData] = await Promise.all([
      db.getContributed(userId, mapId),
      db.getPointsData()
    ]);
    // Associate marker data with each map
    const mapsWithPoints = leaflet.associatePointsWithMaps(mapsData, pointsData);
    const navBar = await db.getContributedNavbar(userId);

    // Render the 'index' view and pass the maps data with associated points to it
    res.render('index', {mapsWithPoints, navBar});
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});

// create a new map
router.get('/createMap', async (req, res) => {
  try {
    const navBar = await db.getFavouritesNavbar(1);
    res.render('createMap', { navBar });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});


// delete a map - must be submitting delete via AJAX (could be .del rather than .delete)
router.delete('/delete/:mapid', (req, res) => {
  const { mapId } = req.params;

  db.deleteMap(mapId)
    .then(deleted => {
      if (deleted) {
        res.json({ message: 'Map successfully deleted' });
      } else {
        res.status(404).json({ error: 'Map not deleted' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});




module.exports = router;
