      //   // Existing map settings with padding
      //   var mapSettings = [
      //     {
      //         center: [51.515, -0.1],
      //         tileLayerUrl: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
      //         markers: [
      //             { coords: [51.505, -0.09] }, // Marker 1
      //             { coords: [51.515, -0.1] },  // Marker 2
      //             { coords: [51.525, -0.11] }  // Marker 3
      //         ]
      //     },
      //     {
      //         center: [40.7213, -73.9878],
      //         tileLayerUrl: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
      //         markers: [
      //             { coords: [40.7128, -74.0060] }, // Marker 1
      //             { coords: [40.7213, -73.9878] },  // Marker 2
      //             { coords: [40.7312, -73.9985] }  // Marker 3
      //         ]
      //     }
      // ];

      // // Function to create and render maps with padding
      // function createMaps() {
      //     var mapsContainer = document.getElementById('maps-container');

      //     mapSettings.forEach(function (setting, index) {
      //         // Create a map container div
      //         var mapDiv = document.createElement('div');
      //         mapDiv.className = 'map-container';
      //         mapDiv.id = 'map-' + index;
      //         mapsContainer.appendChild(mapDiv);

      //         // Create the map
      //         var map = L.map('map-' + index).setView(setting.center, 12);

      //         // Define the tile layer
      //         L.tileLayer(setting.tileLayerUrl, {
      //             attribution: setting.attribution
      //         }).addTo(map);

      //         // Add markers to the map based on the setting
      //         setting.markers.forEach(function (marker) {
      //             var coords = marker.coords;
      //             L.marker(coords).addTo(map);
      //         });

      //         // Adjust the zoom and center to include all markers with padding
      //         var group = new L.featureGroup(setting.markers.map(function (marker) {
      //             return L.marker(marker.coords);
      //         }));
      //         map.fitBounds(group.getBounds().pad(0.2)); // Adjust the padding factor as needed
      //     });
      // }

      // // Call the function to create and render existing maps with padding
      // createMaps();


      // Query the main database to retrieve map data
// Function to create and render maps with padding
const db = require('../db/queries/database');


// Associate marker data with maps based on map_id
function associatePointsWithMaps(mapsData, pointsData) {
  const mapsWithPoints = [];

  for (let i = 0; i < mapsData.length; i++) {
    const map = mapsData[i];

    const associatedPoints = [];

    for (let j = 0; j < pointsData.length; j++) {
      const point = pointsData[j];
      if (point.map_id === map.id) {
        associatedPoints.push(point);
      }
    }

    mapsWithPoints.push({ ...map, markers: associatedPoints });
  }

  return mapsWithPoints;
}

module.exports = {
  associatePointsWithMaps,
};
