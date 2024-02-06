/*
 * All routes for maps are defined here
 * Since this file is loaded in server.js into api/maps,
 *   these routes are mounted onto /api/maps
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const mapQueries = require('../db/queries/database');


// get all maps
router.get('/', (req, res) => {
  mapQueries.getAllMaps()
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
router.get('/api/maps/search', (req, res) => {
  const { title } = req.query; // this assumes the title is passed as a query parameter

  mapQueries.filterMapsByTitle(title)
    .then(maps => {
      res.json({ maps });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// create a new map
router.post('/api/maps', (req, res) => {
  const { title, description, location } = req.body;
  mapQueries.createMap(title, description, location)
    .then(map => {
      res.json({ map });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// delete a map
router.delete('/api/maps/:mapid', (req, res) => {
  const { mapId } = req.params;

  mapQueries.deleteMap(mapId)
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