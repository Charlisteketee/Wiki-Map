/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { checkLoggedIn } = require('../helper-functions/checkLoggedIn');


router.get('/', (req, res) => {
  res.render('users');
}); 


// We don't need to spend time on user registration and login:
// ex: localhost:8080/login/7
router.get('/login/:user_id', (req, res) => {
  console.log('req.params', req.params);
  // cookie-parser (plain text cookies)
  res.cookie('user_id', req.params.user_id);
  // req.session.user_id = 3;

  //send the user home
  res.redirect('/');
});


// route for rendering username in navbar
router.get('/', checkLoggedIn, (req, res) => {
  const username = req.username;
  console.log("username", username);
  
  res.render('navbar', { username });
});



module.exports = router;
