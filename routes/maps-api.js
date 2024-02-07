/*
 * All routes for maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /api/maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const db = require('../db/queries/database');

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
