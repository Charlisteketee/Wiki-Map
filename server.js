// load .env data into process.env
require('dotenv').config();

// Web server config
const cookieParser = require("cookie-parser");

const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const { checkLoggedIn } = require('./helper-functions/checkLoggedIn');


const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');
// let loggedInUser = null;


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.use(cookieParser()); // creates and populates req.cookies
app.use(express.json());
app.use(checkLoggedIn);
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));



// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
//const userApiRoutes = require('./routes/users-api');
// const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');
//const navbarApiRoutes = require('./routes/navbar-api');
const mapsApiRoutes = require('./routes/maps-api');
const db = require('./db/queries/database');
const leaflet = require('./helper-functions/leafletHelperFunctions');
const pointsApiRoutes = require('./routes/points-api');
const saveMapRoute = require('./routes/saveMap-api');



// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
//app.use('/api/database', userApiRoutes(db));
//app.use('/api/widgets', widhes);

app.use('/users', usersRoutes);
// Note: mount other resources here, using the same pattern above
app.use('/api/maps', mapsApiRoutes); // We can change the route (/api/maps) to just / once we have organized the index.ejs file
app.use('/api/maps/points', pointsApiRoutes);
app.use('/api/create-map/', saveMapRoute);

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', async (req, res) => {
  const userId = req.cookies.user_id; // For demonstration purposes; replace this with the actual user ID retrieval logic
  try {
    // Use Promise.all to fetch both mapsData and pointsData concurrently
    const [mapsData, pointsData] = await Promise.all([db.getMapsData(), db.getPointsData()]);
    // Associate marker data with each map based on map_id or any other relevant key
    const mapsWithPoints = leaflet.associatePointsWithMaps(mapsData, pointsData);
    const contributedNavBar = await db.getContributedNavbar(userId);
    const favouritesNavBar = await db.getFavouritesNavbar(userId);
    // Render the 'index' view and pass the maps data with associated points to it
    res.render('index', { mapsWithPoints, contributedNavBar, favouritesNavBar, userId: JSON.stringify(userId)});
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// module.exports = { checkLoggedIn };
