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
// liking a map
router.post('/like/:mapId', async (req, res) => {
  const userId = req.cookies.user_id;
  const mapId = req.params.mapId;

  if (!userId) {
    return res.status(401).send('Not logged in');
  }

  try {
    // call the function to add the map to favorites
    await db.addToFavourites(userId, mapId);
    res.sendStatus(200); // success!
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});

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
  const { title } = req.query; // the title is passed as a query parameter

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
  const userId = req.cookies.user_id;
  const mapId = req.params.mapId;
  try {

    // Fetch data for the specific favourite map
    const [mapsData, pointsData] = await Promise.all([
      db.getMap(mapId),
      db.getPointsData()
    ]);

    // Associate marker data with the favourite map
    const mapsWithPoints = leaflet.associatePointsWithMaps(mapsData, pointsData);

    // Fetch navbar data
    const contributedNavBar = await db.getContributedNavbar(userId);
    const favouritesNavBar = await db.getFavouritesNavbar(userId);
    // Render the 'index' view with the maps data and navbar data
    res.render('singleMap', { mapsWithPoints, contributedNavBar, favouritesNavBar });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});
// get specific map on contributed maps
router.get('/contributed/:mapId', async(req, res) => {
  const userId = req.cookies.user_id;
  const mapId = req.params.mapId;
  try {

    const [mapsData, pointsData] = await Promise.all([
      db.getMap(mapId),
      db.getPointsData()
    ]);
    // Associate marker data with each map
    const mapsWithPoints = leaflet.associatePointsWithMaps(mapsData, pointsData);
    const contributedNavBar = await db.getContributedNavbar(userId);
    const favouritesNavBar = await db.getFavouritesNavbar(userId);

    // Render the 'index' view and pass the maps data with associated points to it
    res.render('singleMap', {mapsWithPoints, contributedNavBar, favouritesNavBar});
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});

// create a new map
router.get('/createMap', async (req, res) => {
const userId = req.cookies.user_id; //For demonstration purposes. Replace with actual user
  try {
    const contributedNavBar = await db.getContributedNavbar(userId);
    const favouritesNavBar = await db.getFavouritesNavbar(userId);
    res.render('createMap', { contributedNavBar, favouritesNavBar });
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

// display a single map
router.get('/:mapId', async (req, res) => {
  const mapId = req.params.mapId;
  try {
    // get data for the specific map
    const [mapData, pointsData] = await Promise.all([
      db.getMap(mapId),
      db.getPointsData()
    ]);

    // Associate marker data with the map
    const mapsWithPoints = leaflet.associatePointsWithMaps(mapData, pointsData);

    // Fetch navbar data
    const contributedNavBar = await db.getContributedNavbar(userId);
    const favouritesNavBar = await db.getFavouritesNavbar(userId);
    // Render the 'index' view with the maps data and navbar data
    res.render('singleMap', { mapsWithPoints, contributedNavBar, favouritesNavBar });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});




module.exports = router;
