/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getUser } = require('../db/queries/database');
const { checkLoggedIn } = require('../helper-functions/checkLoggedIn');

// router.get('/', (req, res) => {
//   res.render('users');
// }); 

router.get('/', checkLoggedIn, (req, res) => {
  // Route handler where you want to check if user is logged in
  const username = req.username;
  res.render('_navbar', { username });
});
// We don't need to spend time on user registration and login:
// ex: localhost:8080/login/7
router.get('/login/:user_id', (req, res) => {
  // cookie-parser (plain text cookies)
  res.cookie('user_id', req.params.user_id);
  // req.session.user_id = 3;

  //send the user home
  res.redirect('/');
});






module.exports = router;
