const { getUser } = require('../db/queries/database');


// to check if user is logged in and fetch the username
const checkLoggedIn = (req, res, next) => {
  userId = req.cookies.user_id;
  console.log("userId", userId);
  if (userId) {
    console.log('req.cookies', userId);

    getUser(userId)
    .then(user => {
      req.username = user.username;
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