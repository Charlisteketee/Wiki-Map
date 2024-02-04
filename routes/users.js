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

/*
Notes from Andy's midterm lecture:
DON'T spend time on user registration and login, just copy paste from below:

ex
// localhost:3000/login/7
app.get('/login/:user_id' (req, res) => {
  //set the cookie (encrypted)
  req.cookies.user_id = req.params.user_id;
OR
  // cookie-parser (plain text cookies)
  res.cookie('user_id', req.params.user_id);

  //send the user somewhere
  res.redirect('/home');
});
*/

module.exports = router;
