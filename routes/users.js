/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.render('users');
}); 


// We don't need to spend time on user registration and login:
// ex: localhost:3000/login/7
router.get('/login/:user_id', (req, res) => {
  //set the cookie (encrypted)
  req.cookies.user_id = req.params.user_id;

/*  OR
  // cookie-parser (plain text cookies)
  res.cookie('user_id', req.params.user_id);
*/
  //send the user somewhere
  res.redirect('/');
});


module.exports = router;
