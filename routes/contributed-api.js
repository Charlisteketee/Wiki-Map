/*
 * All routes for contributed maps are defined here
 * Since this file is loaded in server.js into api/contributed,
 *   these routes are mounted onto /api/contributed
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
const express = require('express');
const router  = express.Router();
const { getPointsData, getContributedMaps, getContributedNavbar, getContributed } = require('../db/queries/database'); //inside database.js
const { associatePointsWithMaps } = require('../helper-functions/leafletHelperFunctions');

router.get('/contributed', async(req, res) => {

  try {
    const userId = 1; //For demonstration purposes. Replace with actual user
    // Use Promise.all to fetch both mapsData and pointsData concurrently
    const [mapsData, pointsData] = await Promise.all([getContributedMaps(), getPointsData()]);
    // Associate marker data with each map based on map_id or any other relevant key
    const mapsWithPoints = associatePointsWithMaps(mapsData, pointsData);
    const navBar = await getContributedNavbar(userId);
    // Render the 'index' view and pass the maps data with associated points to it
    res.render('index', { mapsWithPoints, navBar });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/contributed/:mapId', async(req, res) => {
  try {
    const userId = 1; //For demonstration purposes. Replace with actual user
    const mapId = req.params.mapId;

    const [mapsData, pointsData] = await Promise.all([getContributed(userId, mapId), getPointsData()]);

    // Associate marker data with each map
    const mapsWithPoints = associatePointsWithMaps(mapsData, pointsData);

    const navBar = await getContributedNavbar(userId);

    // Render the 'index' view and pass the maps data with associated points to it
    res.render('index', {mapsWithPoints, navBar});
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
