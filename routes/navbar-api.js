/*
 * All routes for the navbar Data are defined here
 * Since this file is loaded in server.js into api/navbar,
 *   these routes are mounted onto /api/navbar
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const db = require('../db/connection');


module.exports = router;