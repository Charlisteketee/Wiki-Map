const { getUsername } = require('../db/queries/database');


//middleware to check if user is logged in and fetch the username
const checkLoggedIn = (req, res, next) => {
  userId = req.cookies.user_id;

  if (userId) {
    console.log('req.cookies', userId);

    getUsername (userId)
    .then(username => {
      req.username = username;
      next();
    })
    .catch(error => {
      console.error('Error fetching username:', error);
      next();
    });
  } else {
    next(); // proceeds to next middleware even if there's an error
  }
};

module.exports = { checkLoggedIn };