const { associatePointsWithMaps} = require('./helper-functions/leafletHelperFunctions.js');
const { getMapsData, getPointsData, } = require('./db/queries/database.js');
// Function to create and render maps with padding
function createMaps() {
  // Fetch map data from the database
  getMapsData()
      .then((mapsData) => {
          // Fetch marker data (points) from the "points database"
          return getPointsData()
              .then((pointsData) => {
                  // Associate marker data with each map based on map_id or any other relevant key
                  const mapsWithPoints = associatePointsWithMaps(mapsData, pointsData);

                  // Create and render maps directly
                  var mapsContainer = document.getElementById('maps-container');

                  mapsWithPoints.forEach(function (mapData, index) {
                      // Create a map container div
                      var mapDiv = document.createElement('div');
                      mapDiv.className = 'map-container';
                      mapDiv.id = 'map-' + index;
                      mapsContainer.appendChild(mapDiv);

                      // Create the map
                      var map = L.map('map-' + index).setView([mapData.latitude, mapData.longitude], 12);

                      // Define the tile layer
                      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
                      }).addTo(map);

                      // Add markers to the map based on the fetched data
                      mapData.markers.forEach(function (marker) {
                          var coords = [marker.latitude, marker.longitude];
                          L.marker(coords).addTo(map);
                      });

                      // Adjust the zoom and center to include all markers with padding
                      var group = new L.featureGroup(mapData.markers.map(function (marker) {
                          return L.marker([marker.latitude, marker.longitude]);
                      }));
                      map.fitBounds(group.getBounds().pad(0.2)); // Adjust the padding factor as needed
                  });
              })
              .catch((error) => {
                  console.error('Error fetching points data:', error);
              });
      })
      .catch((error) => {
          console.error('Error fetching maps data:', error);
      });
}

// Call the createMaps function when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  createMaps();
});
