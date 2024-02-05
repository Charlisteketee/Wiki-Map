// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
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
//const usersRoutes = require('./routes/users');
//const navbarApiRoutes = require('./routes/navbar-api');
const mapsApiRoutes = require('./routes/maps-api');
const pointsApiRoutes = require('./routes/points-api');
const favoritesApiRoutes = require('./routes/favourites-api');


// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
//app.use('/api/database', userApiRoutes(db));
//app.use('/api/widgets', widhes);
//app.use('/users', usersRoutes);
// app.use('/api/maps', navbarApiRoutes) // not sure what this route should be as it is a partial?
// Note: mount other resources here, using the same pattern above
app.use('/maps', mapsApiRoutes); // We can change the route (/maps) to just / once we have organized the index.ejs file
app.use('/api/maps/search', mapsApiRoutes);
app.use('/api/maps', mapsApiRoutes); // create a new map
app.use('/api/maps/:mapid', mapsApiRoutes); // delete a map
app.use('/api/maps/:id/points/:pointid', pointsApiRoutes); // create a new point
app.use('/api/maps/:id/points/:pointid/edit', pointsApiRoutes); // edit a point
app.use('/api/maps/:id/points/:pointid', pointsApiRoutes); // delete a point
app.use('/api/users/:userId/favorites', favoritesApiRoutes);


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
