/*
 * All routes for favourites are defined here
 * Since this file is loaded in server.js into api/favourites,
 *   these routes are mounted onto /api/favourites
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const favouriteQueries = require('../db/queries/database');

router.get('/api/users/:userId/favorites', (req, res) => {
  const { userId } = req.params;
  favouriteQueries.getFavourites(userId)
    .then(favourites => {
      res.json({ favourites });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});



module.exports = router;