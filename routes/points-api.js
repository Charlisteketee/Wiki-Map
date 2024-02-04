/*
 * All routes for points are defined here
 * Since this file is loaded in server.js into api/points,
 *   these routes are mounted onto /api/points
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const pointQueries = require('../db/queries/database');


// this route is intended to handle requests to create a new point within a map
router.post('/api/maps/:id/points/:pointid', (req, res) => {
  const { id } = req.params;
  const { title, body, image_url } = req.body;
  // calls the createPoint() function, passing the extracted parameters
  pointQueries.createPoint(id, title, body, image_url)
    // if successful, it sends a JSON response with the created point data.
    .then(points => {
      res.json({ points });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/api/maps/:id/points/:pointid/edit', (req, res) => {
  const { id, pointid } = req.params;
  const { body, image_url } = req.body;
  // call the updatePoint() function, passing the extracted parameters.
  pointQueries.updatePoint(body, image_url, id, pointid)
  // if successful: it sends a JSON response with the updated point data.
    .then(points => {
      res.json({ points });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});



module.exports = router;